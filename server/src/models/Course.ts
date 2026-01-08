import mongoose, { Schema, InferSchemaType } from "mongoose";

const courseSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, default: "", maxlength: 2000 },
    category: { type: String, default: "", trim: true, maxlength: 80 },
    level: { type: String, enum: ["beginner", "intermediate", "advanced"], default: "beginner" },
    tags: { type: [String], default: [] },
    price: { type: Number, default: 0, min: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    published: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export type CourseDoc = InferSchemaType<typeof courseSchema> & { _id: mongoose.Types.ObjectId };
export const Course = mongoose.models.Course || mongoose.model("Course", courseSchema);
