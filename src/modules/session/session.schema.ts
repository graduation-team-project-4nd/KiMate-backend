import { z } from "zod";

export const createSessionSchema = z.object({ // 세션 생성시 필요한 입력 데이터의 구조와 제약조건
    locale: z.string().optional(),
    kioskType: z.string().optional(),
    kioskName: z.string().optional(),
    deviceId: z.string().optional(),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>; // Zod 스키마로부터 TypeScript 타입 자동 생성

// 세션 종료시 status 키가 필수
export const endSessionSchema = z.object({
    status: z.enum(["COMPLETED", "CANCELLED", "ERROR"]),
});

export type EndSessionInput = z.infer<typeof endSessionSchema>;