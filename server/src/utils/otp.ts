import crypto from "crypto";

export function genOtp6() {
  const n = crypto.randomInt(0, 1_000_000);
  return n.toString().padStart(6, "0");
}

export function hashOtp(code: string) {
  return crypto.createHash("sha256").update(code).digest("hex");
}

export function safeEqHash(a: string, b: string) {
  const ab = Buffer.from(a, "hex");
  const bb = Buffer.from(b, "hex");
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}
