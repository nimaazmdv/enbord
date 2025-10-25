import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "src/prisma/prisma.service";

import { Otp } from "@prisma/client";
import { generateSixDigits, hmacSha256 } from "src/common/utils/crypto.utils";

@Injectable()
export class OtpService {
  private readonly secret: string;
  private readonly resendIntervalSec: number;
  private readonly expiresAtMs: number;
  private readonly maxAttempts: number;

  constructor(
    private configService: ConfigService,
    private prismaService: PrismaService,
  ) {
    this.secret = this.configService.getOrThrow("OTP_SECRET");
    this.resendIntervalSec = +this.configService.getOrThrow("OTP_RESEND_INTERVAL_SEC");
    this.expiresAtMs = +this.configService.getOrThrow("OTP_EXPIRES_IN_MIN") * 60_000;
    this.maxAttempts = +this.configService.getOrThrow("OTP_MAX_ATTEMPTS");
  }

  async createFor(userId: string, purpose: Otp["purpose"]) {
    const lastOtp = await this.prismaService.otp.findFirst({
      where: { userId, purpose },
      orderBy: { createdAt: "desc" },
    });

    if (lastOtp) {
      const diffSec = (Date.now() - lastOtp.createdAt.getTime()) / 1000;

      if (diffSec < this.resendIntervalSec) {
        return { success: false, cooldown: Math.ceil(this.resendIntervalSec - diffSec) };
      }
    }

    const code = await this.prismaService.$transaction(async (tx) => {
      // Consume all previous unconsumed otps
      await tx.otp.updateMany({
        where: { userId, purpose, consumedAt: null },
        data: { consumedAt: new Date() },
      });

      const code = generateSixDigits();

      await tx.otp.create({
        data: {
          userId,
          purpose,
          code: hmacSha256(code, this.secret),
          expiresAt: new Date(Date.now() + this.expiresAtMs),
        },
      });

      return code;
    });

    return { success: true, cooldown: this.resendIntervalSec, code };
  }

  async verify(userId: string, code: string, purpose: Otp["purpose"]) {
    const otp = await this.prismaService.otp.findFirst({
      where: {
        userId,
        purpose,
        consumedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!otp) {
      return { verified: false, reason: "not_found" };
    }

    if (otp.attempts === this.maxAttempts) {
      return { verified: false, reason: "too_many_attempts" };
    }

    if (otp.code !== hmacSha256(code, this.secret)) {
      await this.prismaService.otp.update({
        where: { id: otp.id },
        data: { attempts: { increment: 1 } },
      });

      return { verified: false, reason: "mismatch" };
    }

    await this.prismaService.otp.update({
      where: { id: otp.id },
      data: { consumedAt: new Date() },
    });

    return { verified: true };
  }
}
