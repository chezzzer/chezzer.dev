import { env } from "@/inc/env";
import { checkTurnstile } from "@/inc/turnstile";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { email, message, token } = await request.json();

    if (request.method !== "POST") {
        return new NextResponse(
            JSON.stringify({ name: "Method Not Allowed" }),
            { status: 405 }
        );
    }

    if (!email || !message) {
        return new NextResponse(
            JSON.stringify({ error: "Enter both fields." }),
            {
                status: 400,
            }
        );
    }

    if (process.env.NODE_ENV === "production") {
        const turnstileOutcome = await checkTurnstile(token, request.ip);
        if (!turnstileOutcome) {
            return new NextResponse(
                JSON.stringify({ error: "CAPTCHA failed." }),
                {
                    status: 400,
                }
            );
        }
    }

    await fetch(env.DISCORD_WEBHOOK, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            content: `__${email}__ sent a message:\n\n${message}`,
        }),
    });

    return new NextResponse(JSON.stringify({ success: true }), {
        status: 200,
    });
}
