import { Router } from "express";
import rateLimit from "express-rate-limit";
import { register, login, me, logout, refresh } from "./auth.controller";
import { requireAuth } from "../../middlewares/requireAuth";

const router = Router();

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30 });

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/refresh", authLimiter, refresh);

router.get("/me", requireAuth, me);
router.post("/logout", requireAuth, logout);

export default router;
