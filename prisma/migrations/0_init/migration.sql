-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "GuestbookEntry" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(40) NOT NULL,
    "message" VARCHAR(280) NOT NULL,
    "url" VARCHAR(200),
    "background" VARCHAR(24) NOT NULL,
    "accent" VARCHAR(24) NOT NULL,
    "font" VARCHAR(12) NOT NULL,
    "ipHash" VARCHAR(64) NOT NULL,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GuestbookEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GuestbookEntry_createdAt_idx" ON "GuestbookEntry"("createdAt");

-- CreateIndex
CREATE INDEX "GuestbookEntry_ipHash_createdAt_idx" ON "GuestbookEntry"("ipHash", "createdAt");
