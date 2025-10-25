import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "src/users/users.module";
import { SessionsModule } from "src/sessions/sessions.module";
import { AuthController } from "./auth.controller";

import { AuthService } from "./auth.service";
import { AccountService } from "./services/account.service";
import { OtpService } from "./services/otp.service";
import { GoogleStrategy } from "./strategies/google.strategy";
import { AuthProviders } from "./auth.providers";
import { JwtProviders } from "src/common/providers/jwt.providers";

@Module({
  imports: [PassportModule.register({ session: false }), UsersModule, SessionsModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccountService,
    OtpService,
    GoogleStrategy,
    ...AuthProviders,
    ...JwtProviders,
  ],
  exports: [AuthService],
})
export class AuthModule {}
