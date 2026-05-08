import { z } from "zod";

export const launchSubmissionSchema = z.object({
  name: z.string().trim().min(2).max(120),
  category: z.string().trim().min(2).max(80),
  summary: z.string().trim().min(20).max(500),
  sourceUrl: z.string().trim().url().optional().or(z.literal(""))
});

export type LaunchSubmissionInput = z.infer<typeof launchSubmissionSchema>;
