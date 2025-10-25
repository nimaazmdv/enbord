import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ValidationErrors } from "src/common/errors/validation.errors";

export class SendInvitationDto {
  @IsString()
  @IsNotEmpty(ValidationErrors.EMAIL_REQUIRED)
  @IsEmail({}, ValidationErrors.EMAIL_INVALID)
  email: string;
}
