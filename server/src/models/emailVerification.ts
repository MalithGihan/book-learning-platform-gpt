import mongoose, { Schema, InferSchemaType } from "mongoose";

const emailVerificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    codeHash: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: true },
    attempts: { type: Number, default: 0 },
    sentCount: { type: Number, default: 1 },
    lastSentAt: { type: Date, default: () => new Date() },
  },
  { timestamps: true }
);

emailVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

emailVerificationSchema.index({ userId: 1 }, { unique: true });

export type EmailVerificationDoc = InferSchemaType<typeof emailVerificationSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const EmailVerification =
  mongoose.models.EmailVerification ||
  mongoose.model("EmailVerification", emailVerificationSchema);
