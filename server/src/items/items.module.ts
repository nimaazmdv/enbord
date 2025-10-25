import { Module } from "@nestjs/common";
import { BoardsModule } from "src/boards/boards.module";
import { ItemsController } from "./items.controller";
import { ItemsService } from "./items.service";
import { ItemsDomainService } from "./items-domain.service";

@Module({
  imports: [BoardsModule],
  controllers: [ItemsController],
  providers: [ItemsService, ItemsDomainService],
  exports: [ItemsDomainService],
})
export class ItemsModule {}
