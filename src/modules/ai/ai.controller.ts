// src/modules/ai/ai.controller.ts
import type { FastifyRequest, FastifyReply } from "fastify";
import {
  analyzeSchema,
  screenDetectSchema,
} from "./ai.schema.js";
import {
  callAIAnalyze,
  callAIScreenDetect,
} from "./ai.service.js";

/** Heavy: /v1/ai/analyze */
export async function analyzeHandler(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const parsed = analyzeSchema.safeParse(req.body);
  if (!parsed.success) return reply.status(400).send(parsed.error);

  const result = await callAIAnalyze(parsed.data);
  return reply.send(result);
}

/** Light: /v1/ai/screen/detect */
export async function screenDetectHandler(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const parsed = screenDetectSchema.safeParse(req.body);
  if (!parsed.success) return reply.status(400).send(parsed.error);

  const result = await callAIScreenDetect(parsed.data);
  return reply.send(result);
}
