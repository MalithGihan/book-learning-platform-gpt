import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(120),
  password: z.string().min(8).max(72),
  role: z.enum(["student", "instructor"]).default("student"),
});

export const LoginSchema = z.object({
  email: z.string().email().max(120),
  password: z.string().min(8).max(72),
});

export const VerifyEmailSchema = z.object({
  email: z.string().email().max(120),
  code: z.string().regex(/^\d{6}$/),
});

export const ResendVerifySchema = z.object({
  email: z.string().email().max(120),
});