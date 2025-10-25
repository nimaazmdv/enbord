import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { Public } from "src/common/decorators/public.decorator";
import { AuthGuard as PassportGuard } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";

import { SignupRequestDto } from "./dto/signup-request.dto";
import { SignupVerifyDto } from "./dto/signup-verify.dto";
import { SigninDto } from "./dto/signin.dto";
import { ResendOtpDto } from "./dto/resend-otp.dto";
import { Request, Response } from "express";
import { CurrentUser, SafeUser } from "src/common/decorators/current-user.decorator";

@Controller("auth")
export class AuthController {
  private readonly clientOrigin: string;
  private readonly cookieExpiresInMs: number;

  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    this.clientOrigin = configService.getOrThrow("CLIENT_ORIGIN");
    this.cookieExpiresInMs =
      +this.configService.getOrThrow("REFRESH_TOKEN_EXPIRES_IN_DAY") * 24 * 60 * 60_000;
  }

  @Public()
  @Post("signup/request")
  async signupRequest(@Body() dto: SignupRequestDto) {
    return this.authService.signupRequest(dto);
  }

  @Public()
  @Post("signup/resend-otp")
  @HttpCode(HttpStatus.OK)
  async signupResendOtp(@Body() dto: ResendOtpDto) {
    return this.authService.signupResendOtp(dto.email);
  }

  @Public()
  @Post("signup/verify")
  @HttpCode(HttpStatus.OK)
  async signupVerify(
    @Body() dto: SignupVerifyDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userAgent = req.headers["user-agent"] ?? null;
    const { refreshToken, ...values } = await this.authService.signupVerify(dto, userAgent);

    this.persistRefreshToken(res, refreshToken, req.secure);
    return values;
  }

  @Public()
  @Post("signin")
  @HttpCode(HttpStatus.OK)
  async signin(
    @Body() dto: SigninDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userAgent = req.headers["user-agent"] ?? null;
    const { refreshToken, ...values } = await this.authService.localSignin(dto, userAgent);

    this.persistRefreshToken(res, refreshToken, req.secure);
    return values;
  }

  @Public()
  @Get("google")
  @UseGuards(PassportGuard("google"))
  async googleAuth() {}

  @Public()
  @Get("google/callback")
  @UseGuards(PassportGuard("google"))
  async googleCallback(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const userAgent = req.headers["user-agent"] ?? null;
    const { refreshToken, accessToken } = await this.authService.googleSignin(
      req.user as any,
      userAgent,
    );

    this.persistRefreshToken(res, refreshToken, req.secure);

    return res.redirect(`${this.clientOrigin}/auth/callback?token=${accessToken}`);
  }

  @Public()
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const currentRefreshToken = req.cookies["refresh_token"];

    const { refreshToken, ...values } = await this.authService.refresh(currentRefreshToken);

    this.persistRefreshToken(res, refreshToken, req.secure);
    return values;
  }

  @Post("signout")
  @HttpCode(HttpStatus.NO_CONTENT)
  async signout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies["refresh_token"];
    await this.authService.signout(refreshToken);

    res.clearCookie("refresh_token");
  }

  @Get()
  async getMe(@CurrentUser() user: SafeUser) {
    return { user };
  }

  private async persistRefreshToken(res: Response, refreshToken: string, secure: boolean) {
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure,
      maxAge: this.cookieExpiresInMs,
    });
  }
}
