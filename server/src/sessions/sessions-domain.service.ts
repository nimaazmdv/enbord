import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { REFRESH_TOKEN_SERVICE } from "src/common/constants/di.constants";

import { v4 as uuidv4 } from "uuid";
import { sha256 } from "src/common/utils/crypto.utils";

@Injectable()
export class SessionsDomainService {
  private readonly expiresInMs: number;

  constructor(
    private configService: ConfigService,
    private prismaService: PrismaService,
    @Inject(REFRESH_TOKEN_SERVICE) private refreshTokenService: JwtService,
  ) {
    this.expiresInMs =
      +this.configService.getOrThrow("REFRESH_TOKEN_EXPIRES_IN_DAY") * 24 * 60 * 60_000;
  }

  async persist(userAgent: string | null, sub: string) {
    const id = uuidv4();

    const refreshToken = await this.refreshTokenService.signAsync({ sub, sessionId: id });
    const session = await this.prismaService.session.create({
      data: {
        id,
        userAgent,
        refreshToken: sha256(refreshToken),
        expiresAt: new Date(Date.now() + this.expiresInMs),
        user: { connect: { id: sub } },
      },
    });

    return { session, refreshToken };
  }

  async rotate(id: string, sub: string) {
    const refreshToken = await this.refreshTokenService.signAsync({ sub, sessionId: id });
    const session = await this.prismaService.session.update({
      where: { id },
      data: {
        refreshToken: sha256(refreshToken),
        expiresAt: new Date(Date.now() + this.expiresInMs),
        rotatedAt: new Date(),
      },
    });

    return { session, refreshToken };
  }

  async revoke(id: string) {
    return this.prismaService.session.update({ where: { id }, data: { revokedAt: new Date() } });
  }

  async verify(id: string, refreshToken: string) {
    const session = await this.prismaService.session.findUnique({ where: { id } });

    if (!session) {
      return { verified: false, reason: "not_found" };
    }

    if (session.revokedAt) {
      return { verified: false, reason: "revoked" };
    }

    if (session.expiresAt < new Date()) {
      return { verified: false, reason: "expired" };
    }

    if (session.refreshToken !== sha256(refreshToken)) {
      return { verified: false, reason: "mismatch" };
    }

    return { verified: true, session };
  }
}
