import { Injectable } from "@nestjs/common";
import { RealtimeGateway } from "./realtime.gateway";

@Injectable()
export class RealtimeService {
  constructor(private gateway: RealtimeGateway) {}

  joinUserToBoard(userId: string, boardId: string) {
    this.gateway.server.in(`user:${userId}`).socketsJoin(`board:${boardId}`);
  }

  removeUserFromBoard(userId: string, boardId: string) {
    this.gateway.server.in(`user:${userId}`).socketsLeave(`board:${boardId}`);
  }

  emitToRoom(room: string, event: string, payload?: any) {
    this.gateway.server.to(room).emit(event, payload);
  }

  emitToUser(userId: string, event: string, payload?: any) {
    this.gateway.server.to(`user:${userId}`).emit(event, payload);
  }

  emitToBoard(boardId: string, event: string, payload?: any) {
    this.gateway.server.to(`board:${boardId}`).emit(event, payload);
  }
}
