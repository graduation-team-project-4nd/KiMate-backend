import type { FastifyRequest, FastifyReply } from "fastify";
import * as service from "./session.service.js";
import { createSessionSchema, endSessionSchema } from "./session.schema.js";

export async function createSessionHandler(req: FastifyRequest, reply: FastifyReply) {
    const parsed = createSessionSchema.safeParse(req.body);
    if(!parsed.success) return reply.status(400).send(parsed.error);

    const session = await service.createSession(parsed.data);
    return reply.status(201).send(session);
}

export async function endSessionHandler(req:FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    
    const parsed = endSessionSchema.safeParse(req.body);
    if(!parsed.success) return reply.status(400).send(parsed.error);
    
    const session = await service.endSession(id, parsed.data);
    return reply.status(200).send(session);
}

export async function getSessionHandler(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    
    const session = await service.getSession(id);
    if(!session) return reply.status(404).send({ message: "Session not found" });

    return reply.send(session);
}