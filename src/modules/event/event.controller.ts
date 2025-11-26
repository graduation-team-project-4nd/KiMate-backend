import type { FastifyRequest, FastifyReply } from "fastify";
import { createEventSchema } from "./event.schema.js";
import * as service from "./event.service.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createEventHandler(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = req.params as { id: string };

  const parsed = createEventSchema.safeParse(req.body);
  if (!parsed.success) {
    return reply.status(400).send(parsed.error);
  }

  // Check Session Status
  const session = await prisma.session.findUnique({
    where: { id },
    select: { status: true }
  });

  if(!session) {
    return reply.status(404).send({ message: "Session not found" });
  }

  if (session.status !== "IN_PROGRESS") {
    return reply.status(400).send({
      message: `Cannot create event for a session in status: ${session.status}`,
    });
  }

  const event = await service.createEvent(id, parsed.data);
  return reply.status(201).send(event);
}