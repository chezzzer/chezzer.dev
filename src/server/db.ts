import "server-only"

import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "generated/prisma"
import { Pool } from "pg"
import { env } from "~/lib/env"

function createPrismaClient() {
    const pool = new Pool({
        connectionString: env.DATABASE_URL,
        max: 5,
        idleTimeoutMillis: 20_000,
        connectionTimeoutMillis: 10_000,
    })

    return new PrismaClient({
        adapter: new PrismaPg(pool),
        log: env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    })
}

const globalForPrisma = globalThis as unknown as {
    prisma: ReturnType<typeof createPrismaClient> | undefined
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db
