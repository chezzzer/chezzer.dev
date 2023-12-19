import { env } from "./env";

export async function checkTurnstile(
    token: string,
    ip?: string
): Promise<boolean> {
    const formData = new URLSearchParams();
    formData.append("secret", env.TURNSTILE_SECRET_KEY);
    formData.append("response", token);

    if (ip) {
        formData.append("remoteip", ip);
    }

    const result = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        { method: "POST", body: formData }
    );

    const json = await result.json();

    return Boolean(json.success);
}
