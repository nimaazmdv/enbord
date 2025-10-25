import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { RealtimeService } from "src/realtime/realtime.service";
import { AbilityFactory, Action, subject } from "src/casl/ability.factory";
import { CreateBoardDto } from "./dto/create-board.dto";
import { UpdateBoardDto } from "./dto/update-board.dto";
import { SafeUser } from "src/common/decorators/current-user.decorator";
import { CommonErrors } from "src/common/errors/common.errors";
import { BoardErrors } from "./errors";

@Injectable()
export class BoardsService {
  constructor(
    private prismaService: PrismaService,
    private realtimeService: RealtimeService,
    private abilityFactory: AbilityFactory,
  ) {}

  async create(dto: CreateBoardDto, user: SafeUser) {
    const board = await this.prismaService.board.create({
      data: {
        ...dto,
        owner: { connect: { id: user.id } },
        memberships: { create: { memberId: user.id, role: "OWNER" } },
      },
    });

    this.realtimeService.joinUserToBoard(user.id, board.id);

    return { board };
  }

  async findAll(user: SafeUser) {
    const boards = await this.prismaService.board.findMany({
      where: { memberships: { some: { memberId: user.id } } },
    });

    return { boards };
  }

  async findOne(id: string, user: SafeUser) {
    const board = await this.prismaService.board.findUnique({
      where: { id },
      include: { _count: { select: { memberships: true } } },
    });

    if (!board) {
      throw new NotFoundException(CommonErrors.NOT_FOUND("board"));
    }

    const ability = await this.abilityFactory.createFor(user, board.id);
    if (ability.cannot(Action.Read, subject("Board", board))) {
      throw new ForbiddenException(BoardErrors.READ_FORBIDDEN);
    }

    return { board: { ...board, membersCount: board._count.memberships, _count: undefined } };
  }

  async update(id: string, dto: UpdateBoardDto, user: SafeUser) {
    const board = await this.prismaService.board.findUnique({ where: { id } });
    if (!board) {
      throw new NotFoundException(CommonErrors.NOT_FOUND("board"));
    }

    const ability = await this.abilityFactory.createFor(user, board.id);
    if (ability.cannot(Action.Update, subject("Board", board))) {
      throw new ForbiddenException(BoardErrors.UPDATE_FORBIDDEN);
    }

    const newBoard = await this.prismaService.board.update({ where: { id }, data: dto });

    this.realtimeService.emitToBoard(id, "board:updated", { board: newBoard });

    return { board: newBoard };
  }

  async remove(id: string, user: SafeUser) {
    const board = await this.prismaService.board.findUnique({ where: { id } });
    if (!board) {
      throw new NotFoundException(CommonErrors.NOT_FOUND("board"));
    }

    const ability = await this.abilityFactory.createFor(user, board.id);
    if (ability.cannot(Action.Delete, subject("Board", board))) {
      throw new ForbiddenException(BoardErrors.DELETE_FORBIDDEN);
    }

    await this.prismaService.board.delete({ where: { id } });

    this.realtimeService.emitToBoard(id, "board:removed", { id });
  }
}
