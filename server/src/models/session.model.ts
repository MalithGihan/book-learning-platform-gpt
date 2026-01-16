import mongoose, { Schema, InferSchemaType } from "mongoose";

const sessionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    refreshTokenHash: { type: String, required: true },
    ip: { type: String },
    userAgent: { type: String },
    createdAt: { type: Date, default: Date.now },
    lastUsedAt: { type: Date, default: Date.now },
    revokedAt: { type: Date },
    revokeReason: { type: String },
    rotatedAt: { type: Date },
  },
  { timestamps: true }
);

export type SessionDoc = InferSchemaType<typeof sessionSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Session =
  mongoose.models.Session || mongoose.model("Session", sessionSchema);
