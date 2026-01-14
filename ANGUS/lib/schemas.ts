import { z } from "zod";

export const attachmentSchema = z.object({
  type: z.string().min(1),
  url: z.string().url()
});

export const createProjectSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(4)
});

export const createUpdateSchema = z.object({
  project_id: z.string().uuid(),
  author_mode: z.enum(["wet", "dry"]),
  project_description: z.string().min(4),
  messy_text: z.string().min(10),
  attachments: z.array(attachmentSchema).default([])
});

export const geminiOutputSchema = z.object({
  title: z.string(),
  mode: z.enum(["wet", "dry"]),
  translated: z.object({
    for_wet: z.string(),
    for_dry: z.string()
  }),
  structured: z.object({
    objective: z.string(),
    inputs: z.object({
      samples: z.array(z.string()),
      files: z.array(z.string()),
      reagents_or_strains: z.array(z.string())
    }),
    methods: z.array(
      z.object({
        name: z.string(),
        params: z.record(z.string(), z.string())
      })
    ),
    results: z.object({
      key_numbers: z.record(z.string(), z.number()),
      notes: z.string()
    }),
    handoff: z.object({
      requested_actions: z.array(
        z.object({
          owner_role: z.enum(["wet", "dry"]),
          task: z.string(),
          due: z.string().nullable()
        })
      ),
      needed_from_other_side: z.array(z.string())
    }),
    tags: z.array(z.string())
  }),
  confidence: z.number().min(0).max(1),
  followups: z.array(z.string())
});

export type GeminiOutput = z.infer<typeof geminiOutputSchema>;
