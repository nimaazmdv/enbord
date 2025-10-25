import { Controller, Post, Body, Patch, Param } from "@nestjs/common";
import { NotesService } from "./notes.service";
import { CreateNoteDto } from "./dto/create-note.dto";
import { UpdateNoteDto } from "./dto/update-note.dto";
import { CurrentUser, SafeUser } from "src/common/decorators/current-user.decorator";

@Controller()
export class NotesController {
  constructor(private notesService: NotesService) {}

  @Post("boards/:boardId/notes")
  async create(
    @Param("boardId") boardId: string,
    @Body() dto: CreateNoteDto,
    @CurrentUser() user: SafeUser,
  ) {
    return this.notesService.create(boardId, dto, user);
  }

  @Patch("notes/:id")
  async update(@Param("id") id: string, @Body() dto: UpdateNoteDto, @CurrentUser() user: SafeUser) {
    return this.notesService.update(id, dto, user);
  }
}
