import type { Request, Response, NextFunction } from "express";

function getAllowedOrigins() {
  const raw = process.env.CLIENT_ORIGINS || process.env.CLIENT_ORIGIN || "";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function originFromReferer(referer?: string | null) {
  if (!referer) return null;
  try {
    return new URL(referer).origin;
  } catch {
    return null;
  }
}

export function originCheck(req: Request, res: Response, next: NextFunction) {
  const method = req.method.toUpperCase();
  const isStateChanging = !["GET", "HEAD", "OPTIONS"].includes(method);
  if (!isStateChanging) return next();

  const allowed = getAllowedOrigins();
  if (allowed.length === 0) return next(); 

  const origin = req.headers.origin as string | undefined;
  const referer = req.headers.referer as string | undefined;
  const refOrigin = originFromReferer(referer);

  const isDev = (process.env.NODE_ENV || "development") !== "production";
  if (isDev && !origin && !refOrigin) return next();

  const ok =
    (origin && allowed.includes(origin)) ||
    (refOrigin && allowed.includes(refOrigin));

  if (!ok) {
    return res.status(403).json({ ok: false, error: "CSRF blocked (bad origin)" });
  }

  next();
}
