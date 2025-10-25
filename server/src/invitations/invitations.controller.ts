import { Body, Controller, Get, Param, Patch, Post, Delete } from "@nestjs/common";
import { InvitationsService } from "./invitations.service";
import { SendInvitationDto } from "./dto/send-invitation.dto";
import { CurrentUser, SafeUser } from "src/common/decorators/current-user.decorator";

@Controller()
export class InvitationsController {
  constructor(private invitationsService: InvitationsService) {}

  @Post("boards/:boardId/invitations")
  async send(
    @Param("boardId") boardId: string,
    @Body() dto: SendInvitationDto,
    @CurrentUser() user: SafeUser,
  ) {
    return this.invitationsService.send(boardId, dto, user);
  }

  @Get("boards/:boardId/invitations")
  async findAll(@Param("boardId") boardId: string, @CurrentUser() user: SafeUser) {
    return this.invitationsService.findAll(boardId, user);
  }

  @Patch("invitations/:id/accept")
  async accept(@Param("id") id: string, @CurrentUser() user: SafeUser) {
    return this.invitationsService.respond(id, "accept", user);
  }

  @Patch("invitations/:id/reject")
  async reject(@Param("id") id: string, @CurrentUser() user: SafeUser) {
    return this.invitationsService.respond(id, "reject", user);
  }

  @Delete("invitations/:id")
  async remove(@Param("id") id: string, @CurrentUser() user: SafeUser) {
    return this.invitationsService.remove(id, user);
  }
}
