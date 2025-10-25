import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@prisma/client";
import { omitPassword } from "src/common/utils/query.utils";
import { hash } from "bcryptjs";

@Injectable()
export class UsersDomainService {
  constructor(private prismaService: PrismaService) {}

  async findOne(id: string) {
    return this.prismaService.user.findUnique({ where: { id }, ...omitPassword });
  }

  async findOneByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email: email.toLowerCase() },
      ...omitPassword,
    });
  }

  // Include password for local signin
  async findOneByEmailUnsafe(email: string) {
    return this.prismaService.user.findUnique({ where: { email: email.toLowerCase() } });
  }

  async create(input: Prisma.UserCreateInput) {
    return this.prismaService.user.create({
      data: {
        ...input,
        email: input.email.toLowerCase(),
        password: input.password ? await hash(input.password, 10) : undefined,
      },
      ...omitPassword,
    });
  }

  async verify(id: string, prisma: Prisma.TransactionClient = this.prismaService) {
    return prisma.user.update({
      where: { id },
      data: { verified: true },
      ...omitPassword,
    });
  }
}
