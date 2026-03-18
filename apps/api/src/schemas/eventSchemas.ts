import { z } from "zod";

const eventTypes = ["Interview", "Assessment", "Follow Up"] as const;

export const createEventSchema = z.object({
  type: z.enum(eventTypes),
  description: z.string().min(5).max(400),
  occurredOn: z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "Invalid date"
  })
});
