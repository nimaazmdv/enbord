import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { RealtimeService } from "src/realtime/realtime.service";
import { AbilityFactory, Action, subject } from "src/casl/ability.factory";
import { BoardsDomainService } from "src/boards/boards-domain.service";
import { Prisma } from "@prisma/client";
import { SafeUser } from "src/common/decorators/current-user.decorator";
import { omitPassword } from "src/common/utils/query.utils";
import { CommonErrors } from "src/common/errors/common.errors";
import { ItemErrors } from "./errors";

@Injectable()
export class ItemsService {
  constructor(
    private prismaService: PrismaService,
    private realtimeService: RealtimeService,
    private abilityFactory: AbilityFactory,
    private boardsDomainService: BoardsDomainService,
  ) {}

  async findAll(boardId: string, cursor: string = "", user: SafeUser) {
    const TAKE = 20;

    const board = await this.boardsDomainService.findOne(boardId);
    if (!board) {
      throw new NotFoundException(CommonErrors.NOT_FOUND("board"));
    }

    const ability = await this.abilityFactory.createFor(user, boardId);
    if (ability.cannot(Action.Read, subject("Item", { boardId } as any))) {
      throw new ForbiddenException(ItemErrors.READ_ALL_FORBIDDEN);
    }

    const args = {
      orderBy: { createdAt: "desc" },
      take: TAKE + 1, // Fetch extra to check next page
      include: { note: true },
      cursor: cursor ? { id: cursor } : undefined, // Start from cursor item
      skip: cursor ? 1 : undefined, // Skip the cursor item itself
    } satisfies Prisma.ItemFindManyArgs;

    const items = await this.prismaService.item.findMany({ where: { boardId }, ...args });
    const hasNextPage = items.length > TAKE;

    // Drop the extra item if there is another page
    const results = hasNextPage ? items.slice(0, TAKE) : items;
    const nextCursor = hasNextPage ? results[results.length - 1].id : null;

    return { items: results, nextCursor };
  }

  async findOne(id: string, user: SafeUser) {
    const item = await this.prismaService.item.findUnique({
      where: { id },
      include: { note: true, createdBy: omitPassword },
    });

    if (!item) {
      throw new NotFoundException(CommonErrors.NOT_FOUND("item"));
    }

    const ability = await this.abilityFactory.createFor(user, item.boardId);
    if (ability.cannot(Action.Read, subject("Item", item))) {
      throw new ForbiddenException(ItemErrors.READ_FORBIDDEN);
    }

    return { item };
  }

  async remove(id: string, user: SafeUser) {
    const item = await this.prismaService.item.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException(CommonErrors.NOT_FOUND("item"));
    }

    const ability = await this.abilityFactory.createFor(user, item.boardId);
    if (ability.cannot(Action.Delete, subject("Item", item))) {
      throw new ForbiddenException(ItemErrors.DELETE_FORBIDDEN);
    }

    await this.prismaService.item.delete({ where: { id } });

    this.realtimeService.emitToBoard(item.boardId, "item:removed", { id, boardId: item.boardId });
  }
}
