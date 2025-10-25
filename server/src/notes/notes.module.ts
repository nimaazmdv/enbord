import { Module } from "@nestjs/common";
import { BoardsModule } from "src/boards/boards.module";
import { ItemsModule } from "src/items/items.module";
import { NotesController } from "./notes.controller";
import { NotesService } from "./notes.service";

@Module({
  imports: [BoardsModule, ItemsModule],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
