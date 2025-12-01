# KiMate API Specification

## Part 1. 요약 명세서

| API | Method | Description | Request Body | Response Body | Auth |
|-----|--------|-------------|--------------|---------------|------|
| `/v1/healthz` | GET | 서버 상태 점검 (역할: 헬스 체크) | 없음 | `{ ok: boolean }` | 없음 |
| `/v1/sessions` | POST | 새 세션 생성, 상태는 기본 `IN_PROGRESS` | `{ locale?, kioskType?, kioskName?, deviceId? }` | `Session` 객체 | 없음 |
| `/v1/sessions/{id}/end` | PATCH | 기존 세션 종료 상태 업데이트 | `{ status: COMPLETED\|CANCELLED\|ERROR }` | 업데이트된 `Session` 객체 | 없음 |
| `/v1/sessions/{id}` | GET | 단일 세션 상세 조회 | 없음 | `Session` 객체 | 없음 |
| `/v1/sessions/{id}/events` | POST | 세션 타임라인 이벤트 기록 | `{ type: EventType, payload: object }` | `SessionEvent` 객체 | 없음 |
| `/v1/ai/analyze` | POST | Heavy AI 분석 (화면/대화 기반 추천) | `AnalyzeInput` | 외부 AI 응답(JSON) | 없음 |
| `/v1/ai/screen/detect` | POST | Light 화면 변경 감지 | `ScreenDetectInput` | 외부 AI 응답(JSON) | 없음 |

> `Session` 및 `SessionEvent` 구조는 Part 2에서 상세 설명합니다.

> `/ai`의 응답은 AI Module API의 응답을 그대로 전달하므로 해당 [Specification](https://github.com/graduation-team-project-4nd/KiMate/issues/1#issue-3661205296)을 참고하길 바랍니다. 

---

## Part 2. 상세 명세서

### 📌 **1. [GET] /v1/healthz**
#### • 설명(Description)
- 역할(Role): 배포 환경 혹은 모니터링 시스템이 서버 상태를 확인할 때 사용
- 요청 파라미터(Request Params): 없음
- 응답 형태(Response): `{ ok: boolean }`
- 에러 상황(Errors): 내부 서버 오류 시 500
- 주의사항(Notes): 캐싱 없이 실시간 호출 권장

#### • 요청 형식(Request)
```json
{}
```

#### • 응답 형식(Response)
```json
{
  "ok": true
}
```

#### • 필드 설명(Field Details)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `ok` | boolean | 예 | 서버가 정상일 경우 `true` |

#### • 요청 예시(Request Example)
```json
{}
```

#### • 응답 예시(Response Example)
```json
{
  "ok": true
}
```

#### • 에러 코드(Error Cases)
| HTTP Status | Description |
|-------------|-------------|
| 500 | Fastify 내부 오류 |

---

### 📌 **2. [POST] /v1/sessions**
#### • 설명(Description)
- 역할: 새 사용자 세션을 생성하여 이후 이벤트/AI 호출에서 참조할 고유 ID 발급
- 요청 파라미터: Body 내 선택적 메타데이터
- 응답 형태: 생성된 `Session` 전체 레코드
- 에러 상황: 입력 스키마 위반 또는 DB 실패
- 주의사항: 응답의 `id`를 클라이언트가 저장해야 이후 API 호출에 사용 가능

#### • 요청 형식(Request)
```json
{
  "locale": "string?",
  "kioskType": "string?",
  "kioskName": "string?",
  "deviceId": "string?"
}
```

#### • 응답 형식(Response)
```json
{
  "id": "string",
  "locale": "string|null",
  "kioskType": "string|null",
  "kioskName": "string|null",
  "deviceId": "string|null",
  "status": "IN_PROGRESS|COMPLETED|CANCELLED|ERROR",
  "startedAt": "ISO8601 string",
  "endedAt": "ISO8601 string|null"
}
```

#### • 필드 설명(Field Details)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `locale` | string | 선택 | UI/음성 언어 코드 |
| `kioskType` | string | 선택 | 장비 유형 |
| `kioskName` | string | 선택 | 설치 지점 이름 |
| `deviceId` | string | 선택 | 단말 고유 ID |

#### • 요청 예시(Request Example)
```json
{
  "locale": "ko-KR",
  "kioskType": "AIRPORT_CHECKIN",
  "kioskName": "Gimpo T1 A-12",
  "deviceId": "device-001"
}
```

#### • 응답 예시(Response Example)
```json
{
  "id": "f3c2f3b2-1cbd-4a89-88c1-1234567890ab",
  "locale": "ko-KR",
  "kioskType": "AIRPORT_CHECKIN",
  "kioskName": "Gimpo T1 A-12",
  "deviceId": "device-001",
  "status": "IN_PROGRESS",
  "startedAt": "2025-01-15T03:25:11.123Z",
  "endedAt": null
}
```

#### • 에러 코드(Error Cases)
| HTTP Status | Description |
|-------------|-------------|
| 400 | Zod 스키마 검증 실패 |
| 500 | Prisma 삽입 실패 등 서버 오류 |

---

### 📌 **3. [PATCH] /v1/sessions/{id}/end**
#### • 설명(Description)
- 역할: 세션 진행 상태를 종료 상태로 업데이트하고 종료 시간을 기록
- 요청 파라미터: Path `id`, Body `status`
- 응답 형태: 업데이트된 `Session`
- 에러 상황: 존재하지 않는 세션 ID, 스키마 오류
- 주의사항: 종료 후 재호출 시 Prisma 예외 발생 가능, 프론트는 상태 전환 관리 필요

#### • 요청 형식(Request)
```json
{
  "status": "COMPLETED|CANCELLED|ERROR"
}
```

#### • 응답 형식(Response)
```json
{
  "id": "string",
  "status": "COMPLETED|CANCELLED|ERROR",
  "endedAt": "ISO8601 string",
  "...": "기타 Session 필드 동일"
}
```

#### • 필드 설명(Field Details)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | Path string | 예 | 대상 세션 UUID |
| `status` | string enum | 예 | 종료 결과 |

#### • 요청 예시(Request Example)
```json
{
  "status": "COMPLETED"
}
```

#### • 응답 예시(Response Example)
```json
{
  "id": "f3c2f3b2-1cbd-4a89-88c1-1234567890ab",
  "status": "COMPLETED",
  "endedAt": "2025-01-15T03:32:40.891Z",
  "locale": "ko-KR",
  "kioskType": "AIRPORT_CHECKIN",
  "kioskName": "Gimpo T1 A-12",
  "deviceId": "device-001",
  "startedAt": "2025-01-15T03:25:11.123Z"
}
```

#### • 에러 코드(Error Cases)
| HTTP Status | Description |
|-------------|-------------|
| 400 | Body 누락 혹은 enum 불일치 |
| 404 | 세션 없음 (컨트롤러에서 명시적으로 404 반환 필요) |
| 500 | Prisma update 실패 |

---

### 📌 **4. [GET] /v1/sessions/{id}**
#### • 설명(Description)
- 역할: 세션 상태 및 메타데이터 확인
- 요청 파라미터: Path `id`
- 응답 형태: `Session`
- 에러 상황: 세션 없음 → 404
- 주의사항: 존재하지 않는 ID 요청 시 `{ "message": "Session not found" }`

#### • 요청 형식(Request)
```json
{}
```

#### • 응답 형식(Response)
```json
{
  "id": "string",
  "locale": "string|null",
  "kioskType": "string|null",
  "kioskName": "string|null",
  "deviceId": "string|null",
  "status": "SessionStatus",
  "startedAt": "ISO8601 string",
  "endedAt": "ISO8601 string|null"
}
```

#### • 필드 설명(Field Details)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | Path string | 예 | 조회할 세션 UUID |

#### • 요청 예시(Request Example)
```json
{}
```

#### • 응답 예시(Response Example)
```json
{
  "id": "f3c2f3b2-1cbd-4a89-88c1-1234567890ab",
  "locale": null,
  "kioskType": null,
  "kioskName": null,
  "deviceId": null,
  "status": "IN_PROGRESS",
  "startedAt": "2025-01-15T03:25:11.123Z",
  "endedAt": null
}
```

#### • 에러 코드(Error Cases)
| HTTP Status | Description |
|-------------|-------------|
| 404 | `Session not found` |
| 500 | Prisma 오류 |

---

### 📌 **5. [POST] /v1/sessions/{id}/events**
#### • 설명(Description)
- 역할: 세션 수행 중 발생한 이벤트를 서버 타임라인에 기록
- 요청 파라미터: Path `id`, Body `type` + `payload`
- 응답 형태: 생성된 `SessionEvent`
- 에러 상황: 잘못된 타입, 세션 없음
- 주의사항: `payload`는 자유 형식 JSON이므로 프론트-백 간 규칙 합의 필요

#### • 요청 형식(Request)
```json
{
  "type": "SCREEN_CHANGED|AI_INTENT_RESULT|AI_TARGET_RESULT|TARGET_SELECTED|WRONG_TOUCH|RETRY",
  "payload": {}
}
```

#### • 응답 형식(Response)
```json
{
  "id": "string",
  "sessionId": "string",
  "type": "EventType",
  "payload": {},
  "timestamp": "ISO8601 string"
}
```

#### • 필드 설명(Field Details)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | Path string | 예 | 대상 세션 UUID |
| `type` | enum | 예 | 이벤트 종류 |
| `payload` | object | 예 | 이벤트 상세 데이터 |

#### • 요청 예시(Request Example)
```json
{
  "type": "SCREEN_CHANGED",
  "payload": {
    "screenId": "home",
    "timestamp": "2025-01-15T03:26:00.000Z"
  }
}
```

#### • 응답 예시(Response Example)
```json
{
  "id": "c21c1c74-90e5-4e65-b62f-a12e6d741234",
  "sessionId": "f3c2f3b2-1cbd-4a89-88c1-1234567890ab",
  "type": "SCREEN_CHANGED",
  "payload": {
    "screenId": "home",
    "timestamp": "2025-01-15T03:26:00.000Z"
  },
  "timestamp": "2025-01-15T03:26:01.111Z"
}
```

#### • 에러 코드(Error Cases)
| HTTP Status | Description |
|-------------|-------------|
| 400 | 요청 Body 검증 실패 |
| 404 | 세션 미존재 (DB 제약 실패 시) |
| 500 | Prisma 삽입 실패 |

---

### 📌 **6. [POST] /v1/ai/analyze**
#### • 설명(Description)
- 역할: OCR 텍스트, 대화 이력, 버튼 정보를 기반으로 외부 AI 서버에 행동 추천 요청
- 요청 파라미터: Body 전체 구조 `AnalyzeInput`
- 응답 형태: 외부 AI 결과를 그대로 반환 (JSON)
- 에러 상황: 입력 검증 실패, 외부 서버 오류, 타임아웃
- 주의사항: 응답 구조는 AI 서버 스펙에 의존하므로 프론트/백 간 별도 계약 필요

#### • 요청 형식(Request)
```json
{
  "session_id": "string",
  "user_input": "string?",
  "ocr_texts": ["string"],
  "dialogue_history": [
    { "role": "string", "utterance": "string", "action": "any?" }
  ],
  "last_btn": "string"
}
```

#### • 응답 형식(Response)
```json
{
  "recommended_actions": [],
  "confidence": "number",
  "reasoning": "string"
}
```
> 실제 필드는 AI 서버 응답에 따라 달라질 수 있습니다.

#### • 필드 설명(Field Details)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `session_id` | string | 예 | 세션 UUID |
| `user_input` | string | 선택 | 최신 사용자 발화 |
| `ocr_texts` | string[] | 예 | OCR 결과 문자열 목록 |
| `dialogue_history` | array | 예 | 역할/발화 히스토리 |
| `last_btn` | string | 예 | 마지막 터치 버튼 식별자 |

#### • 요청 예시(Request Example)
```json
{
  "session_id": "f3c2f3b2-1cbd-4a89-88c1-1234567890ab",
  "user_input": "수하물 추가하고 싶어요",
  "ocr_texts": ["수하물 추가", "탑승권 발급"],
  "dialogue_history": [
    { "role": "user", "utterance": "대한항공 예매했어요" },
    { "role": "assistant", "utterance": "어떤 서비스를 도와드릴까요?" }
  ],
  "last_btn": "home_bottom_right"
}
```

#### • 응답 예시(Response Example)
```json
{
  "recommended_actions": [
    { "type": "NAVIGATE", "target": "baggage" }
  ],
  "confidence": 0.92,
  "reasoning": "사용자가 수하물 추가를 요청했습니다."
}
```

#### • 에러 코드(Error Cases)
| HTTP Status | Description |
|-------------|-------------|
| 400 | 스키마 검증 실패 |
| 500 | 외부 AI 서버 오류, 타임아웃, 네트워크 실패 |

---

### 📌 **7. [POST] /v1/ai/screen/detect**
#### • 설명(Description)
- 역할: 이전/현재 OCR 텍스트 비교 및 대화 맥락을 기반으로 화면 변경 여부 판단
- 요청 파라미터: Body 구조 `ScreenDetectInput`
- 응답 형태: 외부 AI 결과 JSON
- 에러 상황: 스키마 오류, 외부 서버 실패
- 주의사항: 화면 변경 감지 결과에 따라 프론트에서 추가 행동(예: `/v1/ai/analyze`)을 호출해야 함

#### • 요청 형식(Request)
```json
{
  "previous_texts": ["string"],
  "current_texts": ["string"],
  "session_id": "string",
  "user_input": "string?",
  "dialogue_history": [
    { "role": "string", "utterance": "string", "action": "any?" }
  ]
}
```

#### • 응답 형식(Response)
```json
{
  "screenChanged": "boolean",
  "matchedScreen": "string",
  "confidence": "number"
}
```

#### • 필드 설명(Field Details)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `previous_texts` | string[] | 예 | 이전 화면 OCR 텍스트 |
| `current_texts` | string[] | 예 | 현재 화면 OCR 텍스트 |
| `session_id` | string | 예 | 세션 UUID |
| `user_input` | string | 선택 | 최신 발화 |
| `dialogue_history` | array | 예 | 대화 히스토리 |

#### • 요청 예시(Request Example)
```json
{
  "previous_texts": ["탑승권 발급", "수하물 추가"],
  "current_texts": ["결제", "영수증 발급"],
  "session_id": "f3c2f3b2-1cbd-4a89-88c1-1234567890ab",
  "dialogue_history": [
    { "role": "user", "utterance": "결제 화면이 떴어요" }
  ]
}
```

#### • 응답 예시(Response Example)
```json
{
  "screenChanged": true,
  "matchedScreen": "PAYMENT",
  "confidence": 0.81
}
```

#### • 에러 코드(Error Cases)
| HTTP Status | Description |
|-------------|-------------|
| 400 | 요청 Body 검증 실패 |
| 500 | 외부 AI 서버 오류 또는 타임아웃 |
