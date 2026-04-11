import { z } from "zod";

// ─── Auth ────────────────────────────────────────────────

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  email: z.email("Invalid email address").max(255, "Email too long").toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password too long")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
  purpose: z
    .enum(["sales", "recruitment", "journalism", "research", "background_check", "personal"])
    .optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;

// ─── Search ──────────────────────────────────────────────

export const searchSchema = z.object({
  query: z.string().trim().min(2, "Query must be at least 2 characters").max(200, "Query too long"),
  type: z.enum(["name", "email", "phone", "username", "domain", "company", "natural_language"]).default("name"),
});

export type SearchInputValidated = z.infer<typeof searchSchema>;

// ─── Helper ──────────────────────────────────────────────

export function formatZodError(error: z.ZodError): string {
  return error.issues[0]?.message || "Invalid input";
}
