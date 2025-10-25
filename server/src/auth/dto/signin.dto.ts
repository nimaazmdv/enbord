import { IsString, IsEmail, IsNotEmpty } from "class-validator";
import { ValidationErrors } from "src/common/errors/validation.errors";

export class SigninDto {
  @IsString()
  @IsNotEmpty(ValidationErrors.EMAIL_REQUIRED)
  @IsEmail({}, ValidationErrors.EMAIL_INVALID)
  email: string;

  @IsString()
  @IsNotEmpty(ValidationErrors.PASSWORD_REQUIRED)
  password: string;
}
