import type { FastifyInstance } from "fastify";
import { createEventHandler } from "./event.controller.js";

export default async function eventRoutes(app: FastifyInstance) {
  app.post(
    "/:id/events",
    {
      schema: {
        summary: "세션 이벤트 기록",
        tags: ["Event"],
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
          required: ["id"],
        },
        body: {
          type: "object",
          properties: {
            type: {
              type: "string",
              enum: [
                "SCREEN_CHANGED",
                "AI_INTENT_RESULT",
                "AI_TARGET_RESULT",
                "TARGET_SELECTED",
                "WRONG_TOUCH",
                "RETRY",
              ],
            },
            payload: { type: "object" },
          },
          required: ["type", "payload"],
        },
      },
    },
    createEventHandler
  );
}
