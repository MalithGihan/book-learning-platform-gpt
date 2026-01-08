import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { LoginSchema, RegisterSchema } from "./auth.schema";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/jwt";
import { cookieOptions } from "../../utils/cookies";
import { User } from "../../models/user.model";

const ACCESS_COOKIE = "access_token";
const REFRESH_COOKIE = "refresh_token";

function safeUser(u: any) {
  return { id: String(u._id), name: u.name, email: u.email, role: u.role, createdAt: u.createdAt };
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = RegisterSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ ok: false, error: "Invalid payload" });

    const { name, email, password } = parsed.data;
    const existing = await User.findOne({ email }).lean();
    if (existing) return res.status(409).json({ ok: false, error: "Email already in use" });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash, role: "student" });

    const payload = { sub: String(user._id), role: user.role, email: user.email };
    res.cookie(ACCESS_COOKIE, signAccessToken(payload), cookieOptions());
    res.cookie(REFRESH_COOKIE, signRefreshToken(payload), cookieOptions());

    return res.status(201).json({ ok: true, user: safeUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ ok: false, error: "Invalid payload" });

    const { email, password } = parsed.data;

    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user) return res.status(401).json({ ok: false, error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, (user as any).passwordHash);
    if (!ok) return res.status(401).json({ ok: false, error: "Invalid credentials" });

    const payload = { sub: String(user._id), role: user.role, email: user.email };
    res.cookie(ACCESS_COOKIE, signAccessToken(payload), cookieOptions());
    res.cookie(REFRESH_COOKIE, signRefreshToken(payload), cookieOptions());

    return res.json({ ok: true, user: safeUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function me(req: Request, res: Response) {
  return res.json({ ok: true, user: req.user });
}

export async function logout(_req: Request, res: Response) {
  const opts = cookieOptions();
  res.clearCookie(ACCESS_COOKIE, opts);
  res.clearCookie(REFRESH_COOKIE, opts);
  return res.json({ ok: true });
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.[REFRESH_COOKIE];
    if (!token) return res.status(401).json({ ok: false, error: "Missing refresh token" });

    const payload = verifyRefreshToken(token);

    // optional: ensure user still exists
    const user = await User.findById(payload.sub).lean();
    if (!user) return res.status(401).json({ ok: false, error: "Invalid refresh token" });

    const newPayload = { sub: String(user._id), role: user.role, email: user.email };
    res.cookie(ACCESS_COOKIE, signAccessToken(newPayload), cookieOptions());

    return res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}
