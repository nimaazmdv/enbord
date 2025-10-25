import { IsNotEmpty, IsString } from "class-validator";
import { ValidationErrors } from "src/common/errors/validation.errors";

export class CreateNoteDto {
  @IsString()
  @IsNotEmpty(ValidationErrors.CONTENT_REQUIRED)
  content: string;
}
