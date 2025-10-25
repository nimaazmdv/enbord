import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AbilityFactory, Action, subject } from "src/casl/ability.factory";
import { BoardsDomainService } from "src/boards/boards-domain.service";
import { SafeUser } from "src/common/decorators/current-user.decorator";
import { RealtimeService } from "src/realtime/realtime.service";
import { UpdateMemberDto } from "./dto/update-member.dto";
import { CommonErrors } from "src/common/errors/common.errors";
import { MembershipErrors } from "./errors";
import { omitPassword } from "src/common/utils/query.utils";

@Injectable()
export class MembershipsService {
  constructor(
    private prismaService: PrismaService,
    private abilityFactory: AbilityFactory,
    private realtimeService: RealtimeService,
    private boardsDomainService: BoardsDomainService,
  ) {}

  async findAll(boardId: string, user: SafeUser) {
    const board = await this.boardsDomainService.findOne(boardId);
    if (!board) {
      throw new NotFoundException(CommonErrors.NOT_FOUND("board"));
    }

    const ability = await this.abilityFactory.createFor(user, boardId);
    if (ability.cannot(Action.Read, subject("BoardMember", { boardId: board.id } as any))) {
      throw new ForbiddenException(MembershipErrors.READ_FORBIDDEN);
    }

    const memberships = await this.prismaService.membership.findMany({
      where: { boardId },
      include: { member: omitPassword },
    });

    return { memberships };
  }

  async findOne(boardId: string, memberId: string, user: SafeUser) {
    const membership = await this.prismaService.membership.findUnique({
      where: { id: { boardId, memberId } },
      include: { member: omitPassword },
    });
    if (!membership) {
      throw new NotFoundException(CommonErrors.NOT_FOUND("membership"));
    }

    const ability = await this.abilityFactory.createFor(user, boardId);
    if (ability.cannot(Action.Read, subject("Membership", membership))) {
      throw new ForbiddenException(MembershipErrors.READ_FORBIDDEN);
    }

    return { membership };
  }

  async update(boardId: string, memberId: string, dto: UpdateMemberDto, user: SafeUser) {
    const membership = await this.prismaService.membership.findUnique({
      where: { id: { boardId, memberId } },
    });
    if (!membership) {
      throw new NotFoundException(CommonErrors.NOT_FOUND("membership"));
    }

    const ability = await this.abilityFactory.createFor(user, boardId);
    if (ability.cannot(Action.Update, subject("Membership", membership))) {
      throw new ForbiddenException(MembershipErrors.UPDATE_FORBIDDEN);
    }

    const newMembership = await this.prismaService.membership.update({
      where: { id: { boardId, memberId } },
      data: dto,
      include: { member: omitPassword },
    });

    this.realtimeService.emitToUser(memberId, "ability:staled");
    this.realtimeService.emitToBoard(boardId, "member:updated", { membership: newMembership });

    return { membership: newMembership };
  }

  async remove(boardId: string, memberId: string, user: SafeUser) {
    const membership = await this.prismaService.membership.findUnique({
      where: { id: { boardId, memberId } },
    });
    if (!membership) {
      throw new NotFoundException(CommonErrors.NOT_FOUND("membership"));
    }

    const ability = await this.abilityFactory.createFor(user, boardId);
    if (ability.cannot(Action.Delete, subject("Membership", membership))) {
      throw new ForbiddenException(MembershipErrors.REMOVE_FORBIDDEN);
    }

    await this.prismaService.membership.delete({ where: { id: { boardId, memberId } } });

    this.realtimeService.removeUserFromBoard(user.id, boardId);
    this.realtimeService.emitToBoard(boardId, "member:removed", { id: memberId });
    this.realtimeService.emitToBoard(boardId, "board:decreased", { id: boardId });
    this.realtimeService.emitToUser(memberId, "board:removed", { id: boardId });
  }

  async leave(boardId: string, user: SafeUser) {
    const board = await this.boardsDomainService.findOne(boardId);
    if (!board) {
      throw new NotFoundException(CommonErrors.NOT_FOUND("board"));
    }

    const ability = await this.abilityFactory.createFor(user, boardId);
    if (ability.cannot(Action.Leave, subject("Board", board))) {
      throw new ForbiddenException(MembershipErrors.LEAVE_FORBIDDEN);
    }

    await this.prismaService.membership.delete({ where: { id: { boardId, memberId: user.id } } });

    this.realtimeService.removeUserFromBoard(user.id, boardId);
    this.realtimeService.emitToBoard(boardId, "member:removed", { id: user.id });
    this.realtimeService.emitToBoard(boardId, "board:decreased", { id: boardId });
  }
}
