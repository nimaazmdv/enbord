import { IsString, IsEmail, IsNotEmpty, Matches } from "class-validator";
import { ValidationErrors } from "src/common/errors/validation.errors";

export class SignupVerifyDto {
  @IsString()
  @IsNotEmpty(ValidationErrors.EMAIL_REQUIRED)
  @IsEmail({}, ValidationErrors.EMAIL_INVALID)
  email: string;

  @IsString()
  @IsNotEmpty(ValidationErrors.OTP_REQUIRED)
  @Matches(/^\d{6}$/, ValidationErrors.OTP_INVALID)
  otp: string;
}
