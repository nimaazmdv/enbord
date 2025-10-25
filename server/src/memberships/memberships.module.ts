import { Module } from "@nestjs/common";
import { BoardsModule } from "src/boards/boards.module";
import { MembershipsController } from "./memberships.controller";
import { MembershipsService } from "./memberships.service";
import { MembershipsDomainService } from "./memberships-domain.service";

@Module({
  imports: [BoardsModule],
  controllers: [MembershipsController],
  providers: [MembershipsService, MembershipsDomainService],
  exports: [MembershipsDomainService],
})
export class MembershipsModule {}
