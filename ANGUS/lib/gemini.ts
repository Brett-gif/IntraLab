import { GoogleGenerativeAI } from "@google/generative-ai";
import { geminiOutputSchema, type GeminiOutput } from "@/lib/schemas";

const PROMPT = `SYSTEM / INSTRUCTION:
You are an assistant that converts lab updates into structured records and dual-audience translations for wet-lab and dry-lab collaborators.
Return ONLY valid JSON that matches the given schema. Do not include markdown, backticks, commentary, or extra keys.
Rules:
- Do NOT invent sample IDs, plasmid IDs, file names, parameters, concentrations, times, or results. If missing, ask in followups.
- If uncertain, lower confidence and put questions in followups.
- Make translations concise and actionable (max 6 bullet-like sentences).
- If author_mode is "wet", still produce both translations.
- Use empty arrays when unknown; never use null except where allowed (due).
- confidence must be between 0 and 1.

SCHEMA:
{
  "title": string,
  "mode": "wet" | "dry",
  "translated": {
    "for_wet": string,
    "for_dry": string
  },
  "structured": {
    "objective": string,
    "inputs": {
      "samples": string[],
      "files": string[],
      "reagents_or_strains": string[]
    },
    "methods": Array<{ "name": string, "params": Record<string, string> }>,
    "results": {
      "key_numbers": Record<string, number>,
      "notes": string
    },
    "handoff": {
      "requested_actions": Array<{ "owner_role": "wet"|"dry", "task": string, "due": string|null }>,
      "needed_from_other_side": string[]
    },
    "tags": string[]
  },
  "confidence": number,
  "followups": string[]
}

INPUT:
`;

export async function translateUpdate(input: {
  author_mode: "wet" | "dry";
  project_description: string;
  messy_text: string;
  attachments: Array<{ type: string; url: string }>;
}): Promise<GeminiOutput> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GOOGLE_API_KEY");
  }

  const client = new GoogleGenerativeAI(apiKey);
  const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });

  const inputJson = JSON.stringify({
    mode: input.author_mode,
    project_description: input.project_description,
    messy_text: input.messy_text,
    attachments: input.attachments
  });

  const result = await model.generateContent(`${PROMPT}${inputJson}`);
  const text = result.response.text().trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (error) {
    throw new Error("Gemini returned invalid JSON");
  }

  return geminiOutputSchema.parse(parsed);
}
