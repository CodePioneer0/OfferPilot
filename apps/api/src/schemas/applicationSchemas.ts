import { z } from "zod";

const applicationStageOptions = [
  "Wishlist",
  "Applied",
  "Phone Screen",
  "Technical Round",
  "Final Round",
  "Offer",
  "Rejected"
] as const;

const dateField = z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
  message: "Invalid date"
});

const urlField = z.string().url();

export const createApplicationSchema = z.object({
  company: z.string().min(2).max(120),
  role: z.string().min(2).max(120),
  location: z.string().max(120).optional(),
  jobUrl: urlField.optional(),
  stage: z.enum(applicationStageOptions),
  salaryMin: z.number().int().min(0).optional(),
  salaryMax: z.number().int().min(0).optional(),
  appliedOn: dateField,
  notes: z.string().max(2000).optional()
});

export const updateApplicationSchema = createApplicationSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required for update"
  });
