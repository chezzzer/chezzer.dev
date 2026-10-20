import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
    server: {
        DATABASE_URL: z.url(),
        TURNSTILE_SECRET_KEY: z.string().min(1),
        IP_HASH_SALT: z.string().min(8),
        NODE_ENV: z
            .enum(["development", "test", "production"])
            .default("development"),
    },
    client: {
        NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1),
    },
    runtimeEnv: {
        DATABASE_URL: process.env.DATABASE_URL,
        TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
        IP_HASH_SALT: process.env.IP_HASH_SALT,
        NODE_ENV: process.env.NODE_ENV,
        NEXT_PUBLIC_TURNSTILE_SITE_KEY:
            process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
    },
    emptyStringAsUndefined: true,
})
