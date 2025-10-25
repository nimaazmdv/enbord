import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class BoardsDomainService {
  constructor(private prismaService: PrismaService) {}

  async findAll(where: Prisma.BoardWhereInput) {
    return this.prismaService.board.findMany({ where });
  }

  async findOne(id: string) {
    return this.prismaService.board.findUnique({ where: { id } });
  }
}
