import mongoose, { Schema, InferSchemaType } from "mongoose";

const auditSchema = new Schema(
  {
    actorId: { type: Schema.Types.ObjectId, ref: "User", required: false },
    action: { type: String, required: true },
    ip: { type: String },
    userAgent: { type: String },
    method: { type: String },
    path: { type: String },
    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export type AuditDoc = InferSchemaType<typeof auditSchema> & { _id: mongoose.Types.ObjectId };
export const AuditLog = mongoose.models.AuditLog || mongoose.model("AuditLog", auditSchema);
