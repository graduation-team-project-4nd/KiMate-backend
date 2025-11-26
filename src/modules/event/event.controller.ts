import type { FastifyRequest, FastifyReply } from "fastify";
import { createEventSchema } from "./event.schema.js";
import * as service from "./event.service.js";

export async function createEventHandler(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = req.params as { id: string };

  const parsed = createEventSchema.safeParse(req.body);
  if (!parsed.success) {
    return reply.status(400).send(parsed.error);
  }

  const event = await service.createEvent(id, parsed.data);
  return reply.status(201).send(event);
}