// src/modules/ai/ai.service.ts
import axios from "axios";
import type { AnalyzeInput, ScreenDetectInput } from "./ai.schema.js";

const AI_SERVER = process.env.AI_SERVER_URL ?? "http://localhost:8000";

/** /api/analyze 호출 (heavy) */
export async function callAIAnalyze(data: AnalyzeInput) {
  const res = await axios.post(`${AI_SERVER}/api/analyze`, data, {
    timeout: 15_000,
  });
  return res.data;
}

/** /api/screen/detect 호출 (light) */
export async function callAIScreenDetect(data: ScreenDetectInput) {
  const res = await axios.post(`${AI_SERVER}/api/screen/detect`, data, {
    timeout: 15_000,
  });
  return res.data;
}
