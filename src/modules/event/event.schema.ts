import { z } from "zod";

export const createEventSchema = z.object({ // 세션 생성시 필요한 입력 데이터의 구조와 제약조건
    type: z.enum([
        "SCREEN_CHANGED",
        "AI_INTENT_RESULT",
        "AI_TARGET_RESULT",
        "TARGET_SELECTED",
        "WRONG_TOUCH",
        "RETRY",
    ]),
    payload: z.any(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>; // Zod 스키마로부터 TypeScript 타입 자동 생성