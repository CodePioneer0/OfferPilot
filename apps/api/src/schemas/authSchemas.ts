import { z } from "zod";

const passwordRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,72}$/;

export const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z
    .string()
    .regex(passwordRule, "Password must include uppercase, lowercase, number, and be 8+ chars")
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});
