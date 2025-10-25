import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ValidationErrors } from "src/common/errors/validation.errors";

export class CreateBoardDto {
  @IsString()
  @IsNotEmpty(ValidationErrors.NAME_REQUIRED)
  name: string;

  @IsString()
  @IsOptional()
  icon?: string;
}
