import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { RealtimeService } from "src/realtime/realtime.service";
import { AbilityFactory, Action, subject } from "src/casl/ability.factory";
import { BoardsDomainService } from "src/boards/boards-domain.service";
import { UsersDomainService } from "src/users/users-domain.service";
import { MembershipsDomainService } from "src/memberships/memberships-domain.service";
import { NotificationsDomainService } from "src/notifications/notifications-domain.service";

import { SendInvitationDto } from "./dto/send-invitation.dto";
import { SafeUser } from "src/common/decorators/current-user.decorator";
import { Board } from "@prisma/client";
import { CommonErrors } from "src/common/errors/common.errors";
import { InvitationErrors } from "./errors";
import { omitPassword } from "src/common/utils/query.utils";

@Injectable()
export class InvitationsService {
  constructor(
    private prismaService: PrismaService,
    private realtimeService: RealtimeService,
    private abilityFactory: AbilityFactory,
    private boardsDomainService: BoardsDomainService,
    private usersDomainService: UsersDomainService,
    private membershipsDomainService: MembershipsDomainService,
    private notificationsDomainService: NotificationsDomainService,
  ) {}

  async send(boardId: string, dto: SendInvitationDto, user: SafeUser) {
    const board = await this.boardsDomainService.findOne(boardId);
    if (!board) {
      throw new NotFoundException(CommonErrors.NOT_FOUND("board"));
    }

    const ability = await this.abilityFactory.createFor(user, boardId);
    if (ability.cannot(Action.Create, subject("Invitation", { boardId } as any))) {
      throw new ForbiddenException(InvitationErrors.INVITE_FORBIDDEN);
    }

    const receiver = await this.usersDomainService.findOneByEmail(dto.email);
    if (!receiver) {
      throw new NotFoundException(InvitationErrors.USER_NOT_EXISTS);
    }

    const membership = await this.membershipsDomainService.findOne(boardId, receiver.id);
    if (membership) {
      throw new ConflictException(InvitationErrors.ALREADY_MEMBER);
    }

    const pendingInvitation = await this.prismaService.invitation.findFirst({
      where: { boardId, receiverId: receiver.id, status: "PENDING" },
    });

    if (pendingInvitation) {
      throw new ConflictException(InvitationErrors.ALREADY_SENT);
    }

    const { invitation, notification } = await this.prismaService.$transaction(async (tx) => {
      const invitation = await tx.invitation.create({
        data: {
          board: { connect: { id: boardId } },
          sender: { connect: { id: user.id } },
          receiver: { connect: { id: receiver.id } },
        },
        include: { sender: omitPassword, receiver: omitPassword },
      });

      const notification = await this.notificationsDomainService.createForInvitation(
        invitation.id,
        receiver.id,
        { senderName: user.name, boardName: board.name },
        tx,
      );

      return { invitation, notification };
    });

    this.realtimeService.emitToBoard(boardId, "invitation:created", { invitation });
    this.realtimeService.emitToUser(receiver.id, "notification:received", { notification });

    return { invitation };
  }

  async findAll(boardId: string, user: SafeUser) {
    const board = await this.boardsDomainService.findOne(boardId);
    if (!board) {
      throw new NotFoundException(CommonErrors.NOT_FOUND("board"));
    }

    const ability = await this.abilityFactory.createFor(user, boardId);
    if (ability.cannot(Action.Read, subject("Invitation", { boardId: board.id } as any))) {
      throw new ForbiddenException(InvitationErrors.READ_FORBIDDEN);
    }

    const invitations = await this.prismaService.invitation.findMany({
      where: { boardId, deletedAt: null },
      include: { sender: omitPassword, receiver: omitPassword },
    });

    return { invitations };
  }

  async remove(id: string, user: SafeUser) {
    const invitation = await this.prismaService.invitation.findUnique({ where: { id } });
    if (!invitation) {
      throw new NotFoundException(CommonErrors.NOT_FOUND("invitation"));
    }

    const ability = await this.abilityFactory.createFor(user, invitation.boardId);
    if (ability.cannot(Action.Delete, subject("Invitation", invitation))) {
      throw new ForbiddenException(InvitationErrors.DELETE_FORBIDDEN);
    }

    await this.prismaService.invitation.update({ where: { id }, data: { deletedAt: new Date() } });

    this.realtimeService.emitToBoard(invitation.boardId, "invitation:removed", {
      id,
      boardId: invitation.boardId,
    });
  }

  async respond(id: string, response: "accept" | "reject", user: SafeUser) {
    const invitation = await this.prismaService.invitation.findUnique({ where: { id } });
    if (!invitation) {
      throw new NotFoundException(CommonErrors.NOT_FOUND("invitation"));
    }

    const ability = await this.abilityFactory.createFor(user);
    if (ability.cannot(Action.Respond, subject("Invitation", invitation))) {
      throw new ForbiddenException(InvitationErrors.RESPOND_FORBIDDEN);
    }

    if (invitation.status !== "PENDING") {
      throw new ConflictException(InvitationErrors.ALREADY_RESPONDED);
    }

    const { newInvitation, newNotification } = await this.prismaService.$transaction(async (tx) => {
      // Update the invitation as responded
      const newInvitation = await tx.invitation.update({
        where: { id },
        data: {
          status: response === "accept" ? "ACCEPTED" : "REJECTED",
          respondedAt: new Date(),
        },
      });

      // Update the associated notification as responded
      const newNotification = await this.notificationsDomainService.markAsInactiveForInvitation(
        id,
        tx,
      );

      if (response === "accept") {
        const member = await this.membershipsDomainService.create(invitation.boardId, user.id, tx);

        this.realtimeService.joinUserToBoard(user.id, invitation.boardId);
        this.realtimeService.emitToBoard(invitation.boardId, "member:joined", { member });
        this.realtimeService.emitToBoard(invitation.boardId, "board:increased", {
          id: invitation.boardId,
        });
      }

      return { newInvitation, newNotification };
    });

    const board = await this.boardsDomainService.findOne(invitation.boardId);

    this.realtimeService.emitToBoard(invitation.boardId, "invitation:responded", {
      invitation: newInvitation,
    });

    return { notification: newNotification, board: response === "accept" ? board : undefined };
  }
}
