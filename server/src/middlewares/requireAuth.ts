import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { User } from "../models/user.model";

const ACCESS_COOKIE = "access_token";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.[ACCESS_COOKIE];
    if (!token) return res.status(401).json({ ok: false, error: "Not authenticated" });

    const payload = verifyAccessToken(token);

    const user = await User.findById(payload.sub).lean();
    if (!user) return res.status(401).json({ ok: false, error: "Not authenticated" });

    req.user = { id: String(user._id), email: user.email, role: user.role, name: user.name };
    next();
  } catch {
    return res.status(401).json({ ok: false, error: "Invalid or expired token" });
  }
}
