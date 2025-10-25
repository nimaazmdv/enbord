import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { RealtimeModule } from "./realtime/realtime.module";
import { CaslModule } from "./casl/casl.module";
import { EmailModule } from "./email/email.module";
import { AuthModule } from "./auth/auth.module";
import { SessionsModule } from "./sessions/sessions.module";
import { UsersModule } from "./users/users.module";
import { BoardsModule } from "./boards/boards.module";
import { MembershipsModule } from "./memberships/memberships.module";
import { ItemsModule } from "./items/items.module";
import { NotesModule } from "./notes/notes.module";
import { InvitationsModule } from "./invitations/invitations.module";
import { NotificationsModule } from "./notifications/notifications.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    RealtimeModule,
    CaslModule,
    EmailModule,
    AuthModule,
    SessionsModule,
    UsersModule,
    BoardsModule,
    MembershipsModule,
    ItemsModule,
    NotesModule,
    InvitationsModule,
    NotificationsModule,
  ],
})
export class AppModule {}
