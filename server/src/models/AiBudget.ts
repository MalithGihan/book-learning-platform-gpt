import { Schema, model } from "mongoose";

const AiBudgetSchema = new Schema(
  {
    _id: { type: String, default: "global" },
    used: { type: Number, default: 0 },
    limit: { type: Number, required: true },
  },
  { timestamps: true }
);

export const AiBudget = model("AiBudget", AiBudgetSchema);
