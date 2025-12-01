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
        summary: "AI 분석 (heavy) - 화면+발화 기반 action 추천",
        body: {
          ...analyzeJsonSchema,
          example: {
            session_id: "sess_001",
            user_input: "불고기 버거 하나",
            ocr_texts: ["추천메뉴", "불고기버거", "치즈버거"],
            dialogue_history: [],
            last_btn: "추천메뉴"
          }
        },
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
            },
            example: {
              status: "success",
              confidence: 0.95,
              response_message: "불고기버거를 선택합니다.",
              action: {
                type: "click_text",
                params: { target_text: "불고기버거" }
              }
            }
          }
        }
      }
    },
    analyzeHandler
  );

  // -------- /screen/detect --------
  app.post(
    "/screen/detect",
    {
      schema: {
        tags: ["AI"],
        summary: "화면 전환 감지 (light)",
        body: {
          ...screenDetectJsonSchema,
          example: {
            previous_texts: ["추천메뉴", "불고기버거"],
            current_texts: ["결제", "카드", "삼성페이"],
            session_id: "sess_002",
            user_input: "",
            dialogue_history: []
          }
        },
        response: {
          200: {
            type: "object",
            properties: {
              is_changed: { type: "boolean" },
              similarity_score: { type: "number" },
              ai_analysis: {
                type: ["object", "null"],
                nullable: true
              }
            },
            example: {
              is_changed: true,
              similarity_score: 0.12,
              ai_analysis: {
                status: "success",
                confidence: 0.98,
                response_message: "결제 화면입니다.",
                action: { type: "speak_only", params: {} }
              }
            }
          }
        }
      }
    },
    screenDetectHandler
  );
}
