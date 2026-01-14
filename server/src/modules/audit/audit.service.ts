import type { Request } from "express";
import { AuditLog } from "./audit.model";

export async function audit(req: Request, action: string, meta?: Record<string, unknown>) {
  try {
    const actorId = (req as any).user?.id ? (req as any).user.id : undefined;
    await AuditLog.create({
      actorId,
      action,
      ip: req.ip,
      userAgent: req.get("user-agent"),
      method: req.method,
      path: req.originalUrl,
      meta: meta || {},
    });
  } catch {
   
  }
}
