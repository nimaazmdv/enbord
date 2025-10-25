import { JsonWebTokenError, JwtService, TokenExpiredError } from "@nestjs/jwt";
import { User } from "@prisma/client";

export function getSafeUser(user: User) {
  const { password, ...safeUser } = user;
  return safeUser;
}

export async function tryVerifyToken(jwtService: JwtService, token: string) {
  try {
    const payload = await jwtService.verifyAsync(token);
    return { verified: true, payload };
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return { verified: false, reason: "expired" };
    }

    if (error instanceof JsonWebTokenError) {
      return { verified: false, reason: "invalid" };
    }

    throw error;
  }
}
