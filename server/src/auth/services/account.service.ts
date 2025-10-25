import { Injectable } from "@nestjs/common";
import { Account, Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { omitPassword } from "src/common/utils/query.utils";

@Injectable()
export class AccountService {
  constructor(private prismaService: PrismaService) {}

  async create(
    input: Prisma.AccountCreateInput,
    prisma: Prisma.TransactionClient = this.prismaService,
  ) {
    return prisma.account.create({ data: input });
  }

  async findOneByIdentity(provider: Account["provider"], providerId: string) {
    return this.prismaService.account.findUnique({
      where: { providerIdentity: { provider, providerId } },
      include: { user: omitPassword },
    });
  }
}
