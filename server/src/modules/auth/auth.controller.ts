import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";

import { User } from "../../models/user.model";
import { Session } from "../../models/session.model";

import { RegisterSchema, LoginSchema } from "./auth.schema";

import { signAccessToken } from "../../utils/jwt";
import { cookieOptions, shortCookieOptions } from "../../utils/cookies";

import { newRefreshToken, hashToken } from "../../utils/refreshToken";
import { audit } from "../audit/audit.service";

import { genOidcParams, getGoogleClient } from "./google.oidc";
import mongoose from "mongoose";
import { lookupIpLocation } from "../../utils/ipLocation";

const ACCESS_COOKIE = "access_token";
const REFRESH_COOKIE = "refresh_token";

const ACCESS_MAX_AGE_MS = 15 * 60 * 1000;
const REFRESH_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

const OIDC_STATE = "oidc_state";
const OIDC_NONCE = "oidc_nonce";
const OIDC_CV = "oidc_cv";

function getCurrentUrl(req: Request) {
  const host = req.get("host");
  const proto = (req.headers["x-forwarded-proto"] as string) || req.protocol;
  return new URL(`${proto}://${host}${req.originalUrl}`);
}

const MAX_FAILS = 5;
const LOCK_MS = 5 * 60 * 1000;

function accessCookieOptions() {
  return { ...cookieOptions(), maxAge: ACCESS_MAX_AGE_MS };
}
function refreshCookieOptions() {
  return { ...cookieOptions(), maxAge: REFRESH_MAX_AGE_MS };
}

function safeUser(u: any) {
  return {
    id: String(u._id),
    name: u.name,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt,
  };
}

function getCurrentSessionId(req: Request): string | null {
  const combined = req.cookies?.[REFRESH_COOKIE];
  if (!combined) return null;
  const dot = combined.indexOf(".");
  if (dot <= 0) return null;
  return combined.slice(0, dot);
}

async function issueSessionCookies(req: Request, res: Response, user: any) {
  const rawRefresh = newRefreshToken();

  const session = await Session.create({
    userId: user._id,
    refreshTokenHash: hashToken(rawRefresh),
    ip: req.ip,
    userAgent: req.get("user-agent"),
    lastUsedAt: new Date(),
  });

  const combined = `${String(session._id)}.${rawRefresh}`;
  const payload = { sub: String(user._id), role: user.role, email: user.email };

  res.cookie(ACCESS_COOKIE, signAccessToken(payload), accessCookieOptions());
  res.cookie(REFRESH_COOKIE, combined, refreshCookieOptions());

  return session;
}

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const parsed = RegisterSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: "Invalid payload" });
    }

    const { name, password, role } = parsed.data;
    const email = parsed.data.email.toLowerCase().trim();

    const existing = await User.findOne({ email }).lean();
    if (existing) {
      return res.status(409).json({ ok: false, error: "Email already in use" });
    }

    const safeRole = role === "instructor" ? "instructor" : "student";

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      passwordHash,
      role: safeRole,
      emailVerified: false,
    });

    await issueSessionCookies(req, res, user);
    await audit(req, "auth.register", { email: user.email });

    return res.status(201).json({ ok: true, user: safeUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: "Invalid payload" });
    }

    const email = parsed.data.email.toLowerCase().trim();
    const { password } = parsed.data;

    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user) {
      await audit(req, "auth.login_failed", { email });
      return res.status(401).json({ ok: false, error: "Invalid credentials" });
    }

    if (user.lockUntil && user.lockUntil.getTime() > Date.now()) {
      await audit(req, "auth.locked_login_attempt", { email });
      return res
        .status(423)
        .json({ ok: false, error: "Account temporarily locked" });
    }

    const passwordHash = (user as any).passwordHash;
    if (!passwordHash) {
      await audit(req, "auth.login_failed_no_password", { email });
      return res.status(401).json({ ok: false, error: "Use Google sign-in" });
    }

    const ok = await bcrypt.compare(password, passwordHash);
    if (!ok) {
      user.failedLoginCount = (user.failedLoginCount || 0) + 1;

      if (user.failedLoginCount >= MAX_FAILS) {
        user.lockUntil = new Date(Date.now() + LOCK_MS);
        user.failedLoginCount = 0;
      }

      await user.save();
      await audit(req, "auth.login_failed", { email });

      return res.status(401).json({ ok: false, error: "Invalid credentials" });
    }

    user.failedLoginCount = 0;
    user.lockUntil = undefined as any;
    user.lastLoginAt = new Date();
    await user.save();

    await issueSessionCookies(req, res, user);
    await audit(req, "auth.login", { email: user.email });

    return res.json({ ok: true, user: safeUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function me(req: Request, res: Response) {
  return res.json({ ok: true, user: req.user });
}

export async function logout(req: Request, res: Response) {
  const combined = req.cookies?.[REFRESH_COOKIE];

  if (combined) {
    const dot = combined.indexOf(".");
    if (dot > 0) {
      const sessionId = combined.slice(0, dot);
      await Session.findByIdAndUpdate(sessionId, {
        revokedAt: new Date(),
        revokeReason: "logout",
      }).catch(() => {});
    }
  }

  res.clearCookie(ACCESS_COOKIE, accessCookieOptions());
  res.clearCookie(REFRESH_COOKIE, refreshCookieOptions());

  await audit(req, "auth.logout");

  return res.json({ ok: true });
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const combined = req.cookies?.[REFRESH_COOKIE];
    if (!combined) {
      return res
        .status(401)
        .json({ ok: false, error: "Missing refresh token" });
    }

    const dot = combined.indexOf(".");
    if (dot < 0) {
      return res
        .status(401)
        .json({ ok: false, error: "Invalid refresh token" });
    }

    const sessionId = combined.slice(0, dot);
    const rawRefresh = combined.slice(dot + 1);

    const session = await Session.findById(sessionId);
    if (!session || session.revokedAt) {
      return res
        .status(401)
        .json({ ok: false, error: "Invalid refresh token" });
    }

    const incomingHash = hashToken(rawRefresh);
    if (incomingHash !== session.refreshTokenHash) {
      session.revokedAt = new Date();
      session.revokeReason = "refresh_reuse_detected";
      await session.save();

      await audit(req, "auth.refresh_reuse_detected", { sessionId });
      return res
        .status(401)
        .json({ ok: false, error: "Refresh token reuse detected" });
    }

    const user = await User.findById(session.userId).lean();
    if (!user) {
      return res
        .status(401)
        .json({ ok: false, error: "Invalid refresh token" });
    }

    const newRaw = newRefreshToken();
    session.refreshTokenHash = hashToken(newRaw);
    session.lastUsedAt = new Date();
    session.rotatedAt = new Date();
    await session.save();

    const payload = {
      sub: String(user._id),
      role: user.role,
      email: user.email,
    };
    res.cookie(ACCESS_COOKIE, signAccessToken(payload), accessCookieOptions());
    res.cookie(
      REFRESH_COOKIE,
      `${String(session._id)}.${newRaw}`,
      refreshCookieOptions()
    );

    await audit(req, "auth.refresh", { sessionId: String(session._id) });

    return res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

export async function googleStart(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const client = await getGoogleClient();
    const { state, nonce, codeVerifier, codeChallenge } = genOidcParams();

    res.cookie(OIDC_STATE, state, shortCookieOptions());
    res.cookie(OIDC_NONCE, nonce, shortCookieOptions());
    res.cookie(OIDC_CV, codeVerifier, shortCookieOptions());

    const url = client.authorizationUrl({
      scope: "openid email profile",
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      state,
      nonce,
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    });

    return res.redirect(url);
  } catch (err) {
    next(err);
  }
}

export async function googleCallback(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const client = await getGoogleClient();

    const state = req.cookies?.[OIDC_STATE];
    const nonce = req.cookies?.[OIDC_NONCE];
    const codeVerifier = req.cookies?.[OIDC_CV];

    if (!state || !nonce || !codeVerifier) {
      return res.status(400).json({ ok: false, error: "Missing OIDC cookies" });
    }

    const params = client.callbackParams(req);

    const tokenSet = await client.callback(
      process.env.GOOGLE_REDIRECT_URI!,
      params,
      {
        state,
        nonce,
        code_verifier: codeVerifier,
      }
    );

    const claims = tokenSet.claims();
    const email = String(claims.email || "")
      .toLowerCase()
      .trim();
    const sub = String(claims.sub || "");
    const name = String(claims.name || "User");
    const picture = claims.picture ? String(claims.picture) : undefined;
    const emailVerified = Boolean(claims.email_verified);

    if (!email || !sub) {
      return res
        .status(400)
        .json({ ok: false, error: "Invalid Google profile" });
    }

    let user = await User.findOne({ "authProviders.google.sub": sub });
    if (!user) user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        role: "student",
        emailVerified,
        authProviders: { google: { sub, picture } },
        lastLoginAt: new Date(),
      });
    } else {
      user.name = user.name || name;
      user.emailVerified = user.emailVerified || emailVerified;
      user.authProviders = user.authProviders || {};
      user.authProviders.google = { sub, picture };
      user.lastLoginAt = new Date();
      await user.save();
    }

    res.clearCookie(OIDC_STATE, shortCookieOptions());
    res.clearCookie(OIDC_NONCE, shortCookieOptions());
    res.clearCookie(OIDC_CV, shortCookieOptions());

    await issueSessionCookies(req, res, user);
    await audit(req, "auth.google.login", { email: user.email });

    const origin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
    return res.redirect(new URL("/auth/success", origin).toString());
  } catch (err) {
    next(err);
  }
}

export async function listSessions(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = (req as any).user?.id;
    const currentSessionId = getCurrentSessionId(req);

    const sessions = await Session.find({
      userId,
      revokedAt: { $exists: false },
    })
      .sort({ lastUsedAt: -1 })
      .limit(25)
      .lean();

    return res.json({
      ok: true,
      sessions: sessions.map((s: any) => ({
        id: String(s._id),
        ip: s.ip,
        location: lookupIpLocation(s.ip),
        userAgent: s.userAgent,
        createdAt: s.createdAt,
        lastUsedAt: s.lastUsedAt,
        isCurrent: currentSessionId
          ? String(s._id) === currentSessionId
          : false,
      })),
    });
  } catch (err) {
    next(err);
  }
}

export async function revokeSession(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = (req as any).user?.id;
    const sessionId = String(req.params.id || "");
    const currentSessionId = getCurrentSessionId(req);

    if (!mongoose.isValidObjectId(sessionId)) {
      return res.status(400).json({ ok: false, error: "Invalid session id" });
    }

    const session = await Session.findOne({ _id: sessionId, userId });
    if (!session) {
      return res.status(404).json({ ok: false, error: "Session not found" });
    }

    if (!session.revokedAt) {
      session.revokedAt = new Date();
      session.revokeReason = "manual_revoke";
      await session.save();
    }

    if (currentSessionId && sessionId === currentSessionId) {
      res.clearCookie(ACCESS_COOKIE, accessCookieOptions());
      res.clearCookie(REFRESH_COOKIE, refreshCookieOptions());
    }

    await audit(req, "auth.session_revoked", { sessionId });

    return res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

export async function revokeOtherSessions(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = (req as any).user?.id;
    const currentSessionId = getCurrentSessionId(req);

    if (!currentSessionId) {
      return res
        .status(400)
        .json({ ok: false, error: "Missing current session" });
    }

    const result = await Session.updateMany(
      {
        userId,
        revokedAt: { $exists: false },
        _id: { $ne: currentSessionId },
      },
      {
        $set: { revokedAt: new Date(), revokeReason: "revoke_others" },
      }
    );

    await audit(req, "auth.revoke_others", {
      currentSessionId,
      revokedCount: (result as any).modifiedCount ?? undefined,
    });

    return res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

export async function logoutAll(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = (req as any).user?.id;

    await Session.updateMany(
      { userId, revokedAt: { $exists: false } },
      { $set: { revokedAt: new Date(), revokeReason: "logout_all" } }
    ).catch(() => {});

    res.clearCookie(ACCESS_COOKIE, accessCookieOptions());
    res.clearCookie(REFRESH_COOKIE, refreshCookieOptions());

    await audit(req, "auth.logout_all");

    return res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}
