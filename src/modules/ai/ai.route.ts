// src/modules/ai/ai.route.ts
import type { FastifyInstance } from "fastify";
import {
  analyzeHandler,
  screenDetectHandler,
} from "./ai.controller.js";

export default async function aiRoutes(app: FastifyInstance) {
  // Heavy LLM 분석
  app.post(
    "/analyze",
    {
      schema: {
        summary: "AI 분석 (heavy) - 화면+발화 기반 action 추천",
        tags: ["AI"],
      },
    },
    analyzeHandler
  );

  // 화면 변경 감지 (light)
  app.post(
    "/screen/detect",
    {
      schema: {
        summary: "화면 전환 감지 (light)",
        tags: ["AI"],
      },
    },
    screenDetectHandler
  );
}
