import "server-only"

import { env } from "~/lib/env"

export async function verifyTurnstile(token: string, ip?: string) {
    const body = new URLSearchParams({
        secret: env.TURNSTILE_SECRET_KEY,
        response: token,
    })
    if (ip) body.set("remoteip", ip)

    const response = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        { method: "POST", body }
    )
    const result = (await response.json()) as { success?: boolean }
    return result.success === true
}
