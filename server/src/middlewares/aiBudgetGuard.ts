import type { Request, Response, NextFunction } from "express";
import { AiBudget } from "../models/AiBudget";

export async function aiBudgetGuard(req: Request, res: Response, next: NextFunction) {
  const limit = Number(process.env.AI_REQUEST_LIMIT ?? 250);

  await AiBudget.updateOne(
    { _id: "global" },
    { $setOnInsert: { used: 0, limit } },
    { upsert: true }
  );

  const updated = await AiBudget.findOneAndUpdate(
    { _id: "global", used: { $lt: limit } },
    { $inc: { used: 1 }, $set: { limit } },
    { new: true }
  );

  if (!updated) {
    return res.status(429).json({
      ok: false,
      error: `AI request limit reached (${limit}).`,
    });
  }

  (req as any).aiRemaining = limit - updated.used;
  next();
}
