import type { FastifyDynamicSwaggerOptions } from "@fastify/swagger";
import type { FastifySwaggerUiOptions } from "@fastify/swagger-ui";

export const swaggerOptions: FastifyDynamicSwaggerOptions = {
  swagger: {
    info: {
      title: "KiMate API",
      version: "1.0.0",
      description: "Interactive kiosk session API documentation",
    },
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
  },
};

export const swaggerUiOptions: FastifySwaggerUiOptions = {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: "list",
    deepLinking: false,
  },
};
