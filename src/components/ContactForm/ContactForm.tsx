"use client";

import { FormEvent, useRef, useState } from "react";
import Turnstile from "react-turnstile";

export default function ContactForm() {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [token, setToken] = useState<string>();

    const email = useRef<HTMLInputElement>(null);
    const message = useRef<HTMLTextAreaElement>(null);

    async function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const body = {
            email: email.current!.value,
            message: message.current!.value,
            token,
        };

        setLoading(true);

        const res = await fetch("/api/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        setLoading(false);

        if (res.status === 200) {
            email.current!.value = "";
            message.current!.value = "";
            setSubmitted(true);
            return;
        }

        const data = await res.json();

        setError(data.error ?? "Something went wrong. Please try again later.");
    }

    if (submitted) {
        return (
            <div className="p-5 mt-5 bg-light border-2 border-primary rounded-xl">
                <h2 className="text-xl">Message Sent!</h2>
                <p>
                    Thanks for getting in touch! I&apos;ll get back to you as
                    soon as I can.
                </p>
            </div>
        );
    }
    return (
        <form className="mt-5 flex flex-col gap-5" onSubmit={submit}>
            <div>
                <label>Email</label>
                <input
                    type="email"
                    ref={email}
                    className="bg-stone-700 block w-full rounded"
                    placeholder="hey@chezzer.dev"
                />
            </div>

            <div>
                <label>Message</label>
                <textarea
                    className="bg-stone-700 block w-full rounded"
                    ref={message}
                    placeholder="Your Message"
                ></textarea>
            </div>

            <Turnstile
                sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                onVerify={(token) => setToken(token)}
                className="hidden"
            />

            {error && <div className="text-red-600">{error}</div>}
            <div>
                <input
                    type="submit"
                    value="Send"
                    className={`
                        ${loading ? "opacity-50 pointer-events-none" : ""} 
                        bg-primary w-fill px-10 py-2 rounded text-black cursor-pointer
                    `}
                />
            </div>
        </form>
    );
}
