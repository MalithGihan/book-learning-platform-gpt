import { z } from "zod";

export const CreateCourseSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().max(2000).optional(),
  category: z.string().max(80).optional(),
  level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  tags: z.array(z.string().min(1).max(30)).max(20).optional(),
  price: z.number().min(0).optional(),
  published: z.boolean().optional(),
});

export const UpdateCourseSchema = CreateCourseSchema.partial();
