import { Module } from "@nestjs/common";
import { BoardsModule } from "src/boards/boards.module";
import { UsersModule } from "src/users/users.module";
import { MembershipsModule } from "src/memberships/memberships.module";
import { NotificationsModule } from "src/notifications/notifications.module";
import { InvitationsController } from "./invitations.controller";
import { InvitationsService } from "./invitations.service";

@Module({
  imports: [BoardsModule, UsersModule, MembershipsModule, NotificationsModule],
  controllers: [InvitationsController],
  providers: [InvitationsService],
})
export class InvitationsModule {}
