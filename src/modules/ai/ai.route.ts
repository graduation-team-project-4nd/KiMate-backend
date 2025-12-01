import type { FastifyInstance } from "fastify";
import { analyzeHandler, screenDetectHandler } from "./ai.controller.js";
import {
  analyzeJsonSchema,
  screenDetectJsonSchema,
} from "./ai.schema.js";

export default async function aiRoutes(app: FastifyInstance) {
  // -------- /analyze --------
  app.post(
    "/analyze",
    {
        schema: {
        tags: ["AI"],
        summary: "AI 분석 (heavy)",
        body: analyzeJsonSchema,  // ✔ definitions만 들어감
        response: {
            200: {
            type: "object",
            properties: {
                status: { type: "string" },
                confidence: { type: "number" },
                response_message: { type: "string" },
                action: {
                type: "object",
                properties: {
                    type: { type: "string" },
                    params: { type: "object" }
                }
                }
            }
            }
        }
        }
    },
    analyzeHandler
    );

    app.post(
    "/screen/detect",
    {
        schema: {
        tags: ["AI"],
        summary: "화면 변경 감지 (light)",
        body: screenDetectJsonSchema, // ✔ 여기도 동일하게
        response: {
            200: {
            type: "object",
            properties: {
                is_changed: { type: "boolean" },
                similarity_score: { type: "number" },
                ai_analysis: {
                nullable: true,
                type: ["object", "null"]
                }
            }
            }
        }
        }
    },
    screenDetectHandler
    );
}