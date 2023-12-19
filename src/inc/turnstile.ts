import { env } from "./env";

export async function checkTurnstile(
    token: string,
    ip?: string
): Promise<boolean> {
    const body = {
        secret: env.TURNSTILE_SECRET_KEY,
        response: token,
        ip,
    };

    const result = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
            method: "POST",
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" },
        }
    );

    const json = await result.json();

    return Boolean(json.success);
}
