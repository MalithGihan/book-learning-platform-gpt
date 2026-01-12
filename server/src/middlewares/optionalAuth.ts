import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { User } from "../models/user.model";

const ACCESS_COOKIE = "access_token";

export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.[ACCESS_COOKIE];
    if (!token) return next();

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub).lean();
    if (!user) return next();

    req.user = { id: String(user._id), email: user.email, role: user.role, name: user.name };
    return next();
  } catch {
    // ignore invalid/expired token (public endpoint should still work)
    return next();
  }
}
