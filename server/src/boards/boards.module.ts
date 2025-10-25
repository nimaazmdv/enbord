import { Module } from "@nestjs/common";
import { BoardsController } from "./boards.controller";
import { BoardsService } from "./boards.service";
import { BoardsDomainService } from "./boards-domain.service";

@Module({
  controllers: [BoardsController],
  providers: [BoardsService, BoardsDomainService],
  exports: [BoardsDomainService],
})
export class BoardsModule {}
