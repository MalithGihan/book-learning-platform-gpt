import mongoose, { Schema, InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 120,
    },

    passwordHash: { type: String, select: false },

    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
      required: true,
    },

    emailVerified: { type: Boolean, default: false },

    authProviders: {
      google: {
        _id: false,
        sub: { type: String },
        picture: { type: String },
      },
    },

    lastLoginAt: { type: Date },

    failedLoginCount: { type: Number, default: 0 },
    lockUntil: { type: Date },
  },
  { timestamps: true }
);

userSchema.index({ "authProviders.google.sub": 1 }, { unique: true, sparse: true });

export type UserDoc = InferSchemaType<typeof userSchema> & { _id: mongoose.Types.ObjectId };
export const User = mongoose.models.User || mongoose.model("User", userSchema);
