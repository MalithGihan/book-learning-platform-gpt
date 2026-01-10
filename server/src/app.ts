import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import routes from "./routes";
import { originCheck } from "./middlewares/originCheck";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());

  const allowedList = (
    process.env.CLIENT_ORIGINS ||
    process.env.CLIENT_ORIGIN ||
    "http://localhost:5173"
  )
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const allowed = new Set(allowedList);

  const corsOptions = {
    origin(
      origin: string | undefined,
      cb: (err: Error | null, ok?: boolean) => void
    ) {
      if (!origin) return cb(null, true);
      return allowed.has(origin)
        ? cb(null, true)
        : cb(new Error("CORS blocked"));
    },
    credentials: true,
  };

  app.use(
    cors({
      origin(origin, cb) {
        if (!origin) return cb(null, true);
        return allowed.has(origin)
          ? cb(null, true)
          : cb(new Error("CORS blocked"));
      },
      credentials: true,
    })
  );

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 300,
    })
  );

  app.use(originCheck);
  app.options("/*path", cors(corsOptions));
  app.use("/api/v1", routes);
  app.get("/health", (_req, res) => res.json({ ok: true }));

  return app;
}
