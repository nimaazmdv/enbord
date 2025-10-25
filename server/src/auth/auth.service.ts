import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { EmailService } from "src/email/email.service";
import { AccountService } from "./services/account.service";
import { OtpService } from "./services/otp.service";
import { UsersDomainService } from "src/users/users-domain.service";
import { SessionsDomainService } from "src/sessions/sessions-domain.service";
import { JwtService } from "@nestjs/jwt";
import { ACCESS_TOKEN_SERVICE, REFRESH_TOKEN_SERVICE } from "src/common/constants/di.constants";

import { SignupRequestDto } from "./dto/signup-request.dto";
import { SignupVerifyDto } from "./dto/signup-verify.dto";
import { SigninDto } from "./dto/signin.dto";
import { SafeUser } from "src/common/decorators/current-user.decorator";
import { Profile } from "passport-google-oauth20";
import { AuthErrors } from "./errors";

import { getSafeUser, tryVerifyToken } from "./utils";
import { compare } from "bcryptjs";

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private emailService: EmailService,
    private accountService: AccountService,
    private otpService: OtpService,
    private usersDomainService: UsersDomainService,
    private sessionsDomainService: SessionsDomainService,
    @Inject(ACCESS_TOKEN_SERVICE) private accessTokenService: JwtService,
    @Inject(REFRESH_TOKEN_SERVICE) private refreshTokenService: JwtService,
  ) {}

  async signupRequest(dto: SignupRequestDto) {
    let user = await this.usersDomainService.findOneByEmail(dto.email);

    if (user) {
      if (user.verified) {
        throw new ConflictException(AuthErrors.ALREADY_REGISTERED);
      }
      // Reuse the unverified user
    } else {
      // Create a new unverified user with local account
      user = await this.usersDomainService.create({
        ...dto,
        accounts: { create: { provider: "LOCAL", providerId: dto.email } },
      });
    }

    const result = await this.otpService.createFor(user.id, "SIGNUP");

    if (result.success) {
      this.emailService.sendOtpVerificationEmail(user.email, result.code!);
    }

    return { cooldown: result.cooldown };
  }

  async signupResendOtp(email: string) {
    const user = await this.usersDomainService.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException(AuthErrors.USER_NOT_FOUND);
    }

    if (user.verified) {
      throw new ConflictException(AuthErrors.ALREADY_REGISTERED);
    }

    const result = await this.otpService.createFor(user.id, "SIGNUP");

    if (result.success) {
      this.emailService.sendOtpVerificationEmail(user.email, result.code!);
    }

    return { cooldown: result.cooldown };
  }

  async signupVerify(dto: SignupVerifyDto, userAgent: string | null) {
    const user = await this.usersDomainService.findOneByEmail(dto.email);

    if (!user) {
      throw new BadRequestException(AuthErrors.USER_NOT_FOUND);
    }

    if (user.verified) {
      throw new ConflictException(AuthErrors.ALREADY_REGISTERED);
    }

    const result = await this.otpService.verify(user.id, dto.otp, "SIGNUP");
    if (!result.verified) {
      throw new BadRequestException(
        result.reason === "too_many_attempts"
          ? AuthErrors.TOO_MANY_OTP_ATTEMPTS
          : AuthErrors.INVALID_OTP,
      );
    }

    // Mark user as verified
    const verifiedUser = await this.usersDomainService.verify(user.id);

    // Sign user in
    return this.signin(verifiedUser, userAgent);
  }

  async localSignin(dto: SigninDto, userAgent: string | null) {
    const user = await this.usersDomainService.findOneByEmailUnsafe(dto.email);

    if (!user || !user.verified) {
      throw new UnauthorizedException(AuthErrors.NOT_REGISTERED);
    }

    const localAccount = await this.accountService.findOneByIdentity("LOCAL", user.email);

    if (!localAccount) {
      throw new UnauthorizedException(AuthErrors.MISSING_LOCAL_ACCOUNT);
    }

    if (!(await compare(dto.password, user.password!))) {
      throw new UnauthorizedException(AuthErrors.WRONG_PASSWORD);
    }

    return this.signin(getSafeUser(user), userAgent);
  }

  async googleSignin(profile: Profile, userAgent: string | null) {
    let googleAccount = await this.accountService.findOneByIdentity("GOOGLE", profile.id);

    const user = await this.prismaService.$transaction(async (tx) => {
      let user: SafeUser | null;

      if (!googleAccount) {
        // No google account, lets see if there's any user
        user = await this.usersDomainService.findOneByEmail(profile.emails![0].value);

        if (user) {
          // If there's a user, link it to a google account
          await this.accountService.create(
            { provider: "GOOGLE", providerId: profile.id, user: { connect: { id: user.id } } },
            tx,
          );

          // Mark them as verified
          if (!user.verified) {
            this.usersDomainService.verify(user.id, tx);
          }
        } else {
          // No user at all, create and link
          user = await this.usersDomainService.create({
            email: profile.emails![0].value,
            name: profile.displayName,
            verified: true,
            accounts: { create: { provider: "GOOGLE", providerId: profile.id } },
          });
        }
      } else {
        user = googleAccount.user;
      }

      return user;
    });

    return this.signin(user, userAgent);
  }

  // Used in auth guards
  async verifyAccess(accessToken?: string) {
    if (!accessToken) {
      throw new UnauthorizedException(AuthErrors.MISSING_TOKEN);
    }

    const result = await tryVerifyToken(this.accessTokenService, accessToken);
    if (!result.verified) {
      throw new UnauthorizedException(
        result.reason === "expired" ? AuthErrors.EXPIRED_TOKEN : AuthErrors.INVALID_TOKEN,
      );
    }
    const { sub } = result.payload;

    const currentUser = await this.usersDomainService.findOne(sub);

    if (!currentUser) {
      throw new UnauthorizedException(AuthErrors.VOID_TOKEN);
    }

    return currentUser;
  }

  async refresh(currentRefreshToken?: string) {
    if (!currentRefreshToken) {
      throw new UnauthorizedException(AuthErrors.MISSING_TOKEN);
    }

    const rtResult = await tryVerifyToken(this.refreshTokenService, currentRefreshToken);
    if (!rtResult.verified) {
      throw new UnauthorizedException(
        rtResult.reason === "expired" ? AuthErrors.EXPIRED_TOKEN : AuthErrors.INVALID_TOKEN,
      );
    }
    const { sub, sessionId } = rtResult.payload;

    const user = await this.usersDomainService.findOne(sub);
    if (!user) {
      throw new UnauthorizedException(AuthErrors.VOID_TOKEN);
    }

    const sessionResult = await this.sessionsDomainService.verify(sessionId, currentRefreshToken);

    if (!sessionResult.verified) {
      switch (sessionResult.reason) {
        case "not_found":
          throw new UnauthorizedException(AuthErrors.MISSING_SESSION);
        case "revoked":
          throw new UnauthorizedException(AuthErrors.REVOKED_SESSION);
        case "expired":
          throw new UnauthorizedException(AuthErrors.EXPIRED_SESSION);
        case "mismatch":
          throw new UnauthorizedException(AuthErrors.MISMATCH_IN_SESSION);
      }
    }

    const accessToken = await this.accessTokenService.signAsync({ sub: user.id });
    const { refreshToken } = await this.sessionsDomainService.rotate(sessionId, user.id);

    return { accessToken, refreshToken, user };
  }

  async signout(refreshToken?: string) {
    if (!refreshToken) return;

    const result = await tryVerifyToken(this.refreshTokenService, refreshToken);
    if (!result.verified) return;
    const { sessionId } = result.payload;

    await this.sessionsDomainService.revoke(sessionId);
  }

  private async signin(user: SafeUser, userAgent: string | null) {
    const accessToken = await this.accessTokenService.signAsync({ sub: user.id });
    const { refreshToken } = await this.sessionsDomainService.persist(userAgent, user.id);

    return { accessToken, refreshToken, user };
  }
}
