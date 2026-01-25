import { Router } from "express";
import { aiBudgetGuard } from "../middlewares/aiBudgetGuard";
import { generateAiReply } from "../services/ai.service";
import { requireAuth } from "../middlewares/requireAuth";
import { AiBudget } from "../models/AiBudget";
import { Course } from "../models/Course";
import { Enrollment } from "../models/Enrollment";

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
        { $inc: { used: -1 } },
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

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function safeJson<T>(text: string): T | null {
  if (!text) return null;

  try {
    return JSON.parse(text) as T;
  } catch {}

  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenceMatch?.[1]) {
    try {
      return JSON.parse(fenceMatch[1]) as T;
    } catch {}
  }

  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const slice = text.slice(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(slice) as T;
    } catch {}
  }

  return null;
}

function keywordFallback(message: string): string[] {
  const stop = new Set([
    "i",
    "want",
    "to",
    "be",
    "a",
    "an",
    "the",
    "what",
    "which",
    "courses",
    "course",
    "should",
    "follow",
    "for",
    "and",
    "or",
    "in",
    "of",
    "me",
    "my",
    "please",
    "give",
    "recommend",
    "recommendations",
  ]);

  return String(message)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length >= 3 && !stop.has(w))
    .slice(0, 8);
}

function categoryRegex(label: string) {
  return new RegExp(`^${escapeRegExp(label)}$`, "i"); // exact match, case-insensitive
}

type Track = "backend" | "frontend" | "fullstack" | null;

function inferTrackFromPrompt(message: string): Track {
  const s = message.toLowerCase();

  if (/\bfull\s*stack\b/.test(s) || s.includes("fullstack")) return "fullstack";
  if (/\bbackend\b/.test(s) || s.includes("server") || s.includes("api"))
    return "backend";
  if (/\bfrontend\b/.test(s) || s.includes("ui") || s.includes("react"))
    return "frontend";

  return null;
}

const TRACK_CATEGORIES: Record<Exclude<Track, null>, string[]> = {
  backend: ["Backend", "Programming", "Security", "Database", "DevOps"],
  frontend: ["Frontend", "UI", "Design"],
  fullstack: [
    "Frontend",
    "Backend",
    "Programming",
    "Security",
    "Database",
    "DevOps",
  ],
};

function buildCategoryConstraint(allowed: string[]) {
  return {
    $or: allowed.map((cat) => ({ category: categoryRegex(cat) })),
  };
}

router.post("/search", aiBudgetGuard, async (req, res) => {
  const { message, limit } = req.body as { message?: string; limit?: number };

  if (!message || typeof message !== "string") {
    return res.status(400).json({ ok: false, error: "message is required" });
  }

  const take = typeof limit === "number" && limit > 0 ? Math.min(limit, 12) : 6;

  try {
    const ai = await generateAiReply({
      userMessage: [
        "Convert the user's goal into a course search query JSON.",
        "Return ONLY valid JSON (no markdown).",
        "Use only simple words that might exist in the course catalog.",
        "Schema:",
        `{
          "keywords": string[],
          "category"?: string,
          "level"?: string,
          "tags"?: string[]
        }`,
        "",
        `User: ${message}`,
      ].join("\n"),
    });

    type AiQuery = {
      keywords?: string[];
      category?: string;
      level?: string;
      tags?: string[];
    };

    const q = safeJson<AiQuery>(ai.text) ?? {};

    const keywords =
      Array.isArray(q.keywords) && q.keywords.length
        ? q.keywords.filter(Boolean)
        : keywordFallback(message);

    const aiTags = Array.isArray(q.tags) ? q.tags.filter(Boolean) : [];
    const aiCategory = typeof q.category === "string" ? q.category.trim() : "";
    const aiLevel = typeof q.level === "string" ? q.level.trim() : "";

    const baseFilter: Record<string, any> = { published: true };

    const track = inferTrackFromPrompt(message);
    const allowedCategories = track ? TRACK_CATEGORIES[track] : [];

    const aiCategoryNorm = aiCategory ? aiCategory.trim() : "";

    const and: any[] = [];

    if (allowedCategories.length) {
      and.push(buildCategoryConstraint(allowedCategories));
    } else if (aiCategoryNorm) {
      and.push({ category: categoryRegex(aiCategoryNorm) });
    }

    if (keywords.length) {
      const regs = keywords.map(
        (k) => new RegExp(escapeRegExp(String(k)), "i"),
      );
      and.push({
        $or: [
          { title: { $in: regs } },
          { description: { $in: regs } },
          { tags: { $in: regs } },
          { category: { $in: regs } },
        ],
      });
    }

    const filterWithCategory: Record<string, any> = { ...baseFilter };
    if (and.length) filterWithCategory.$and = and;

    if (aiCategory) filterWithCategory.category = aiCategory;

    if (keywords.length) {
      const regs = keywords.map(
        (k) => new RegExp(escapeRegExp(String(k)), "i"),
      );
      filterWithCategory.$or = [
        { title: { $in: regs } },
        { description: { $in: regs } },
        { tags: { $in: regs } },
        { category: { $in: regs } },
      ];
    }

    let candidates = await Course.find(filterWithCategory)
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    if (!candidates.length && allowedCategories.length) {
      candidates = await Course.find({
        published: true,
        $or: allowedCategories.map((cat) => ({ category: categoryRegex(cat) })),
      })
        .sort({ createdAt: -1 })
        .limit(200)
        .lean();
    }

    if (!candidates.length) {
      candidates = await Course.find({ published: true })
        .sort({ createdAt: -1 })
        .limit(200)
        .lean();
    }

    const scored = candidates
      .map((c: any) => {
        let score = 0;

        // keyword boosts
        for (const k of keywords) {
          const kk = String(k).toLowerCase();
          if (
            String(c.title || "")
              .toLowerCase()
              .includes(kk)
          )
            score += 3;
          if (
            String(c.description || "")
              .toLowerCase()
              .includes(kk)
          )
            score += 1;
          if (
            Array.isArray(c.tags) &&
            c.tags.some((t: string) => String(t).toLowerCase().includes(kk))
          )
            score += 2;
          if (
            String(c.category || "")
              .toLowerCase()
              .includes(kk)
          )
            score += 2;
        }

        if (
          aiCategory &&
          String(c.category || "").toLowerCase() === aiCategory.toLowerCase()
        )
          score += 3;

        if (aiLevel && c.level === aiLevel) score += 1;

        if (aiTags.length && Array.isArray(c.tags)) {
          const courseTags = c.tags.map((t: any) => String(t).toLowerCase());
          for (const t of aiTags) {
            if (courseTags.includes(String(t).toLowerCase())) score += 3;
          }
        }

        return { c, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, take)
      .map((x) => x.c);

    const picked =
      scored.length > 0
        ? scored
        : await Course.find({ published: true })
            .sort({ createdAt: -1 })
            .limit(take)
            .lean();

    const userId = (req as any).user?.id ?? req.user?.id;
    const role = (req as any).user?.role ?? req.user?.role;

    let merged = picked.map((c: any) => ({ ...c, enrollmentStatus: null }));

    if (userId && role === "student" && merged.length) {
      const ids = merged.map((c: any) => c._id);
      const enrollments = await Enrollment.find({
        student: userId,
        course: { $in: ids },
      })
        .select("course status")
        .lean();

      const statusByCourse = new Map<string, string>();
      for (const e of enrollments)
        statusByCourse.set(String(e.course), e.status);

      merged = merged.map((c: any) => ({
        ...c,
        enrollmentStatus: statusByCourse.get(String(c._id)) || null,
      }));
    }

    return res.json({
      ok: true,
      reply:
        merged.length > 0
          ? `Here are ${merged.length} published courses that match your goal.`
          : "No published courses found. Please try different keywords.",
      courses: merged,
      remaining: (req as any).aiRemaining ?? null,
    });
  } catch (e: any) {
    const status = e?.status ?? e?.response?.status;
    if (status === 401) {
      await AiBudget.updateOne(
        { _id: "global", used: { $gt: 0 } },
        { $inc: { used: -1 } },
      );
    }

    const remaining = (req as any).aiRemaining ?? null;
    const adjustedRemaining =
      status === 401 && typeof remaining === "number"
        ? remaining + 1
        : remaining;

    return res.status(502).json({
      ok: false,
      error: e?.message || "AI search failed",
      remaining: adjustedRemaining,
    });
  }
});

export default router;
