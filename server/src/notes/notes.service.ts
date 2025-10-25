import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { RealtimeService } from "src/realtime/realtime.service";
import { AbilityFactory, Action, subject } from "src/casl/ability.factory";
import { BoardsDomainService } from "src/boards/boards-domain.service";
import { ItemsDomainService } from "src/items/items-domain.service";
import { CreateNoteDto } from "./dto/create-note.dto";
import { UpdateNoteDto } from "./dto/update-note.dto";
import { SafeUser } from "src/common/decorators/current-user.decorator";
import { CommonErrors } from "src/common/errors/common.errors";
import { NoteErrors } from "./errors";

@Injectable()
export class NotesService {
  constructor(
    private prismaService: PrismaService,
    private realtimeService: RealtimeService,
    private abilityFactory: AbilityFactory,
    private boardsDomainService: BoardsDomainService,
    private itemsDomainService: ItemsDomainService,
  ) {}

  async create(boardId: string, dto: CreateNoteDto, user: SafeUser) {
    const board = await this.boardsDomainService.findOne(boardId);
    if (!board) {
      throw new NotFoundException(CommonErrors.NOT_FOUND("board"));
    }

    const ability = await this.abilityFactory.createFor(user, boardId);
    if (ability.cannot(Action.Create, subject("Item", { boardId } as any))) {
      throw new ForbiddenException(NoteErrors.CREATE_FORBIDDEN);
    }

    const item = await this.itemsDomainService.createNote(boardId, user.id, dto);

    this.realtimeService.emitToBoard(boardId, "item:created", { item });

    return { item };
  }

  async update(id: string, dto: UpdateNoteDto, user: SafeUser) {
    const item = await this.itemsDomainService.findOne(id);
    if (!item) {
      throw new NotFoundException(CommonErrors.NOT_FOUND("note"));
    }

    const ability = await this.abilityFactory.createFor(user, item.boardId);
    if (ability.cannot(Action.Update, subject("Item", item))) {
      throw new ForbiddenException(NoteErrors.UPDATE_FORBIDDEN);
    }

    const newItem = await this.itemsDomainService.updateNote(id, dto);

    this.realtimeService.emitToBoard(item.boardId, "item:updated", { item: newItem });

    return { item: newItem };
  }
}
