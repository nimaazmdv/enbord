import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { SafeUser } from "src/common/decorators/current-user.decorator";

@Injectable()
export class NotificationsService {
  constructor(private prismaService: PrismaService) {}

  async findAll(user: SafeUser) {
    const notifications = await this.prismaService.notification.findMany({
      where: { receiverId: user.id },
      include: { invitation: true },
    });

    return { notifications };
  }

  async removeAll(user: SafeUser) {
    const { count } = await this.prismaService.notification.deleteMany({
      where: {
        receiverId: user.id,
        needsAction: false,
      },
    });

    return { count };
  }
}
