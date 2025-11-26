import type { FastifyInstance } from "fastify";
import {
    createSessionHandler,
    endSessionHandler,
    getSessionHandler,
} from "./session.controller.js";

export default async function sessionRoutes(app: FastifyInstance) {
  app.post(
    "/",
    {
      schema: {
        summary: "세션 생성",
        body: {
          type: "object",
          properties: {
            locale: { type: "string" },
            kioskType: { type: "string" },
            kioskName: { type: "string" },
            deviceId: { type: "string" },
          },
        },
        response: {
          201: {
            description: "Session created",
            type: "object",
            properties: {
              id: { type: "string" },
              locale: { type: "string", nullable: true },
              status: { type: "string" },
              startedAt: { type: "string" },
            },
          },
        },
      },
    },
    createSessionHandler
  );

  app.patch(
    "/:id/end",
    {
      schema: {
        summary: "세션 종료",
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
            status: { type: "string", enum: ["COMPLETED", "CANCELLED", "ERROR"] },
          },
          required: ["status"],
        },
      },
    },
    endSessionHandler
  );

  app.get(
    "/:id",
    {
      schema: {
        summary: "세션 조회",
        params: {
          type: "object",
          properties: { id: { type: "string" } },
        },
      },
    },
    getSessionHandler
  );
}