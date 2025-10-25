import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class MembershipsDomainService {
  constructor(private prismaService: PrismaService) {}

  async create(
    boardId: string,
    memberId: string,
    prisma: Prisma.TransactionClient = this.prismaService,
  ) {
    return prisma.membership.create({
      data: {
        board: { connect: { id: boardId } },
        member: { connect: { id: memberId } },
        role: "MEMBER",
      },
    });
  }

  async findOne(boardId: string, memberId: string) {
    return this.prismaService.membership.findUnique({ where: { id: { boardId, memberId } } });
  }
}
