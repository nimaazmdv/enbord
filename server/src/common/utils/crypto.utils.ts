import crypto from "crypto";

export function generateSixDigits() {
  return crypto.randomInt(100000, 1000000).toString();
}

export function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function hmacSha256(value: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}
