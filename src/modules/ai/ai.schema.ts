import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

export const analyzeSchema = z.object({
  session_id: z.string(),
  user_input: z.string().optional(),
  ocr_texts: z.array(z.string()),
  dialogue_history: z.array(
    z.object({
      role: z.string(),
      utterance: z.string(),
      action: z.any().optional()
    })
  ),
  last_btn: z.string(),
});

export type AnalyzeInput = z.infer<typeof analyzeSchema>;

export const screenDetectSchema = z.object({
  previous_texts: z.array(z.string()),
  current_texts: z.array(z.string()),
  session_id: z.string(),
  user_input: z.string().optional(),
  dialogue_history: z.array(
    z.object({
      role: z.string(),
      utterance: z.string(),
      action: z.any().optional()
    })
  ),
});

export type ScreenDetectInput = z.infer<typeof screenDetectSchema>;

export const analyzeJsonSchemaRoot = zodToJsonSchema(analyzeSchema as any, "AnalyzeSchema");
export const analyzeJsonSchema =
  analyzeJsonSchemaRoot.definitions?.AnalyzeSchema ?? analyzeJsonSchemaRoot;

export const screenJsonSchemaRoot = zodToJsonSchema(screenDetectSchema as any, "ScreenDetectSchema");
export const screenDetectJsonSchema =
  screenJsonSchemaRoot.definitions?.ScreenDetectSchema ?? screenJsonSchemaRoot;
