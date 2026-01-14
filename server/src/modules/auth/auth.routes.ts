import { Router } from "express";
import rateLimit from "express-rate-limit";
import { requireAuth } from "../../middlewares/requireAuth";
import {
  register,
  login,
  me,
  logout,
  refresh,
  googleStart,
  googleCallback,
  logoutAll,
  listSessions,
  revokeSession,
  revokeOtherSessions,
} from "./auth.controller";

const router = Router();
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30 });

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  keyGenerator: (req) => {
    const email = (req.body?.email || "").toLowerCase().trim();
    return `${req.ip}:${email}`;
  },
});

const oauthLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });
const sessionLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 60 });


router.post("/register", authLimiter, register);
router.post("/login", loginLimiter, login);
router.post("/refresh", authLimiter, refresh);

router.get("/sessions", requireAuth, sessionLimiter, listSessions);
router.post("/sessions/revoke-others", requireAuth, sessionLimiter, revokeOtherSessions);
router.post("/sessions/:id/revoke", requireAuth, sessionLimiter, revokeSession);
router.post("/logout-all", requireAuth, sessionLimiter, logoutAll);

router.get("/google/start", oauthLimiter, googleStart);
router.get("/google/start", authLimiter, googleStart);
router.get("/google/callback", googleCallback);

router.get("/me", requireAuth, me);
router.post("/logout", requireAuth, logout);

export default router;
