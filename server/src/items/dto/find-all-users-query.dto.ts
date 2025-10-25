import { IsOptional, IsString } from "class-validator";

export class FindAllUsersQueryDto {
  @IsOptional()
  @IsString()
  cursor?: string;
}
