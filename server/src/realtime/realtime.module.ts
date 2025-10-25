import { Global, Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { BoardsModule } from "src/boards/boards.module";
import { RealtimeGateway } from "./realtime.gateway";
import { RealtimeService } from "./realtime.service";

@Global()
@Module({
  imports: [AuthModule, BoardsModule],
  providers: [RealtimeGateway, RealtimeService],
  exports: [RealtimeService],
})
export class RealtimeModule {}
