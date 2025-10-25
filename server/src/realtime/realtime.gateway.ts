import { OnGatewayConnection, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { AuthService } from "src/auth/auth.service";
import { BoardsDomainService } from "src/boards/boards-domain.service";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  },
})
export class RealtimeGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;

  constructor(
    private authService: AuthService,
    private boardsDomainService: BoardsDomainService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      // Authenticate user
      const token = client.handshake.auth?.token;
      const user = await this.authService.verifyAccess(token);

      // Join user personal room
      client.join(`user:${user.id}`);

      // Join all boards user is part of
      const boards = await this.boardsDomainService.findAll({
        memberships: { some: { memberId: user.id } },
      });
      boards.forEach((board) => client.join(`board:${board.id}`));
    } catch (error) {
      console.error(error);
      client.disconnect();
    }
  }
}
