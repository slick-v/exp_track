import { z } from "zod";

// import { registerSchema, type RegisterFormValues } from "./schema";
// import { loginSchema, type LoginFormValues } from "./schema";

export const registerSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  full_name: z.string().optional(),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;


export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;