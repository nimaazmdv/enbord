import { IsString, IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { ValidationErrors } from "src/common/errors/validation.errors";

export class SignupRequestDto {
  @IsString()
  @IsNotEmpty(ValidationErrors.NAME_REQUIRED)
  name: string;

  @IsString()
  @IsNotEmpty(ValidationErrors.EMAIL_REQUIRED)
  @IsEmail({}, ValidationErrors.EMAIL_INVALID)
  email: string;

  @IsString()
  @IsNotEmpty(ValidationErrors.PASSWORD_REQUIRED)
  @MinLength(8, ValidationErrors.PASSWORD_WEAK)
  password: string;
}
