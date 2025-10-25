import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@prisma/client";
import { omitPassword } from "src/common/utils/query.utils";

@Injectable()
export class ItemsDomainService {
  constructor(private prismaService: PrismaService) {}

  async findOne(id: string) {
    return this.prismaService.item.findUnique({ where: { id } });
  }

  async createNote(
    boardId: string,
    createdById: string,
    note: Omit<Prisma.NoteCreateInput, "item">,
  ) {
    return this.prismaService.item.create({
      data: {
        type: "NOTE",
        board: { connect: { id: boardId } },
        createdBy: { connect: { id: createdById } },
        note: { create: note },
      },
      include: { note: true, createdBy: omitPassword },
    });
  }

  async updateNote(id: string, newNote: Prisma.NoteUpdateInput) {
    return this.prismaService.item.update({
      where: { id },
      data: { note: { update: newNote } },
      include: { note: true, createdBy: omitPassword },
    });
  }
}
