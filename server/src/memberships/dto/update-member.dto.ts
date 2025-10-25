import { Role } from "@prisma/client";
import { IsIn } from "class-validator";

export class UpdateMemberDto {
  @IsIn([Role.MEMBER, Role.MANAGER])
  role: Extract<Role, "MEMBER" | "MANAGER">;
}
