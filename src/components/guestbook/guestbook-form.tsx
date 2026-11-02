"use client"

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile"
import { useRef, useState } from "react"
import GuestbookCard from "~/components/guestbook/guestbook-card"
import StylePicker, {
    type CardStyle,
} from "~/components/guestbook/style-picker"
import { env } from "~/lib/env"
import { fontClasses } from "~/lib/guestbook/styles"
import { cn } from "~/lib/utils"
import { api } from "~/trpc/react"

const maxMessage = 280

export default function GuestbookForm() {
    const [style, setStyle] = useState<CardStyle>({
        background: "kiwi",
        accent: "moss",
        font: "mono",
    })
    const [name, setName] = useState("")
    const [message, setMessage] = useState("")
    const [url, setUrl] = useState("")
    const [posted, setPosted] = useState(false)
    const [checking, setChecking] = useState(false)
    const [checkFailed, setCheckFailed] = useState(false)
    const turnstile = useRef<TurnstileInstance>(null)
    const utils = api.useUtils()

    const create = api.guestbook.create.useMutation({
        onSuccess: async () => {
            setMessage("")
            setUrl("")
            setPosted(true)
            await utils.guestbook.list.invalidate()
        },
        onSettled: () => {
            turnstile.current?.reset()
        },
    })

    const ready =
        name.trim() && message.trim() && !create.isPending && !checking

    const submit = async () => {
        setPosted(false)
        setCheckFailed(false)
        setChecking(true)
        try {
            const token =
                turnstile.current?.getResponse() ??
                (await turnstile.current?.getResponsePromise())
            if (!token) {
                setCheckFailed(true)
                return
            }
            create.mutate({
                name,
                message,
                url,
                ...style,
                turnstileToken: token,
            })
        } catch {
            setCheckFailed(true)
        } finally {
            setChecking(false)
        }
    }

    const status = create.error
        ? create.error.message
        : checkFailed
          ? "the captcha didn't finish, try again"
          : posted
            ? "posted. thanks."
            : ""

    return (
        <form
            className="flex flex-col gap-5"
            onSubmit={(event) => {
                event.preventDefault()
                if (ready) void submit()
            }}
        >
            <GuestbookCard
                id="draft"
                tilt={false}
                {...style}
                message={
                    <textarea
                        value={message}
                        onChange={(event) =>
                            setMessage(event.target.value.slice(0, maxMessage))
                        }
                        placeholder="write whatever.. a note, a doodle in text, anything"
                        rows={4}
                        required
                        aria-label="Message"
                        className={cn(
                            "w-full resize-none bg-transparent placeholder:text-text-faint focus:outline-none",
                            fontClasses[style.font]
                        )}
                    />
                }
                footer={
                    <>
                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                            <input
                                value={name}
                                onChange={(event) =>
                                    setName(event.target.value.slice(0, 40))
                                }
                                placeholder="your name"
                                required
                                aria-label="Name"
                                className="w-full bg-transparent py-1.5 text-text placeholder:text-text-faint focus:outline-none"
                            />
                            <input
                                value={url}
                                onChange={(event) =>
                                    setUrl(event.target.value.slice(0, 200))
                                }
                                placeholder="a link, optional"
                                type="url"
                                aria-label="Link"
                                className="w-full bg-transparent py-1.5 placeholder:text-text-faint focus:outline-none"
                            />
                        </div>
                        <span className="text-text-faint tabular-nums">
                            {message.length}/{maxMessage}
                        </span>
                    </>
                }
            />
            <StylePicker value={style} onChange={setStyle} />
            <div className="flex flex-wrap items-center gap-4">
                <button
                    type="submit"
                    disabled={!ready}
                    className="rounded-full bg-surface-1 px-5 py-2 font-mono text-sm text-text embossed transition-colors enabled:hover:bg-surface-2 disabled:text-text-faint"
                >
                    {create.isPending || checking ? "posting" : "post it"}
                </button>
                <p className="label" aria-live="polite">
                    {status}
                </p>
            </div>
            <Turnstile
                ref={turnstile}
                siteKey={env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                options={{
                    theme: "dark",
                    size: "flexible",
                    appearance: "interaction-only",
                }}
                className="empty:hidden"
            />
        </form>
    )
}
