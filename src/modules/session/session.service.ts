import { PrismaClient } from "@prisma/client";
import type { CreateSessionInput, EndSessionInput } from "./session.schema.js";

const prisma = new PrismaClient();

export async function createSession(data: CreateSessionInput) {
    return prisma.session.create({
        data: {
            locale: data.locale ?? null,
            kioskType: data.kioskType ?? null,
            kioskName: data.kioskName ?? null,
            deviceId: data.deviceId ?? null,
            status: "IN_PROGRESS",
        },
    });
}

export async function endSession(id: string, data: EndSessionInput) {
    return prisma.session.update({
        where: { id },
        data: {
            status: data.status,
            endedAt: new Date(),
        },
    });
}

export async function getSession(id: string) {
    return prisma.session.findUnique({
        where: { id },
    });
}