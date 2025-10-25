import { IsString, IsEmail, IsNotEmpty } from "class-validator";
import { ValidationErrors } from "src/common/errors/validation.errors";

export class ResendOtpDto {
  @IsString()
  @IsNotEmpty(ValidationErrors.EMAIL_REQUIRED)
  @IsEmail({}, ValidationErrors.EMAIL_INVALID)
  email: string;
}
