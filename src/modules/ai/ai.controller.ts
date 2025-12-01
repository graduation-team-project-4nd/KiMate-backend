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
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** Heavy: /v1/ai/analyze */
export async function analyzeHandler(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const parsed = analyzeSchema.safeParse(req.body);
  if (!parsed.success) return reply.status(400).send(parsed.error);

  const data = parsed.data;

  // Check Session Status
  const session = await prisma.session.findUnique({
    where: { id: data.session_id },
  });

  if(!session) {
    return reply.status(404).send({ message: "Session not found" });
  }

  if (session.status !== "IN_PROGRESS") {
    return reply.status(400).send({
      message: `Cannot create event for a session in status: ${session.status}`,
    });
  }

  const result = await callAIAnalyze(data);
  return reply.send(result);
}

/** Light: /v1/ai/screen/detect */
export async function screenDetectHandler(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const parsed = screenDetectSchema.safeParse(req.body);
  if (!parsed.success) return reply.status(400).send(parsed.error);

  const data = parsed.data;

  // Check Session Status
  const session = await prisma.session.findUnique({
    where: { id: data.session_id },
  });
  
  if(!session) {
    return reply.status(404).send({ message: "Session not found" });
  }

  if (session.status !== "IN_PROGRESS") {
    return reply.status(400).send({
      message: `Cannot create event for a session in status: ${session.status}`,
    });
  }

  const result = await callAIScreenDetect(data);
  return reply.send(result);
}
