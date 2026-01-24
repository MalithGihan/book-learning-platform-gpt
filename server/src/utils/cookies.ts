import type { CookieOptions } from "express";

export function cookieOptions(): CookieOptions {
  const secure = String(process.env.COOKIE_SECURE || "false") === "true";
  const sameSite = (process.env.COOKIE_SAMESITE || "lax") as "lax" | "strict" | "none";

  return {
    httpOnly: true,
    secure,
    sameSite,
    path: "/",
  };
}

export function shortCookieOptions(maxAgeMs = 10 * 60 * 1000) {
  return { ...cookieOptions(), maxAge: maxAgeMs };
}
