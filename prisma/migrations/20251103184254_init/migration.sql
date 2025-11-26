-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "locale" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "status" TEXT,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);
