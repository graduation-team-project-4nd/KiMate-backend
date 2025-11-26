import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { swaggerOptions, swaggerUiOptions } from "./swagger.js";

// 라우트들
import sessionRoutes from "./modules/session/session.route.js";
import eventRoutes from "./modules/event/event.route.js";

export async function buildApp() {
  const app = Fastify({ logger: true });

  // Plugins
  await app.register(cors);
  await app.register(helmet, {
    // Swagger UI requires relaxed CSP to load inline assets
    contentSecurityPolicy: false,
  });

  // Swagger
  await app.register(swagger, swaggerOptions);

  // Swagger UI
  await app.register(swaggerUI, swaggerUiOptions);

  // Health Check
  app.get("/v1/healthz", async () => ({ ok: true }));

  // Register Routes
  app.register(sessionRoutes, { prefix: "/v1/sessions" });
  app.register(eventRoutes, { prefix: "/v1/sessions" });
  return app;
}
