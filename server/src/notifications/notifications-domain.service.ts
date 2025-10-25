import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class NotificationsDomainService {
  constructor(private prismaService: PrismaService) {}

  async createForInvitation(
    invitationId: string,
    receiverId: string,
    payload?: any,
    prisma: Prisma.TransactionClient = this.prismaService,
  ) {
    return prisma.notification.create({
      data: {
        type: "INVITATION_RECEIVED",
        invitation: { connect: { id: invitationId } },
        receiver: { connect: { id: receiverId } },
        needsAction: true,
        payload,
      },
      include: { invitation: true },
    });
  }

  async markAsInactiveForInvitation(
    invitationId: string,
    prisma: Prisma.TransactionClient = this.prismaService,
  ) {
    const notification = await prisma.notification.findFirst({ where: { invitationId } });

    return prisma.notification.update({
      where: { id: notification!.id },
      data: { needsAction: false },
      include: { invitation: true },
    });
  }
}
