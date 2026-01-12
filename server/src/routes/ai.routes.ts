import { Router } from "express";
import { aiBudgetGuard } from "../middlewares/aiBudgetGuard";
import { generateAiReply } from "../services/ai.service";
import { requireAuth } from "../middlewares/requireAuth";
import { AiBudget } from "../models/AiBudget";

const router = Router();

router.post("/chat", requireAuth, aiBudgetGuard, async (req, res) => {
  const { message, context } = req.body as { message?: string; context?: any };

  if (!message || typeof message !== "string") {
    return res.status(400).json({ ok: false, error: "message is required" });
  }

  try {
    const out = await generateAiReply({ userMessage: message, context });

    return res.json({
      ok: true,
      reply: out.text,
      remaining: (req as any).aiRemaining ?? null,
    });
  } catch (e: any) {
    const status = e?.status ?? e?.response?.status;
    if (status === 401) {
      await AiBudget.updateOne(
        { _id: "global", used: { $gt: 0 } },
        { $inc: { used: -1 } }
      );
    }

    const remaining = (req as any).aiRemaining ?? null;
    const adjustedRemaining =
      status === 401 && typeof remaining === "number"
        ? remaining + 1
        : remaining;

    return res.status(502).json({
      ok: false,
      error: e?.message || "AI request failed",
      remaining: adjustedRemaining,
    });
  }
});

export default router;
