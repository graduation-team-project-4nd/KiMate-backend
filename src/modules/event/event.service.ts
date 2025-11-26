import { PrismaClient } from "@prisma/client";
import type { CreateEventInput } from "./event.schema.js";

const prisma = new PrismaClient();

export async function createEvent(sessionId: string, data: CreateEventInput) {
    return prisma.sessionEvent.create({
        data: {
            sessionId,
            type: data.type,
            payload: data.payload,
        },
    });
}