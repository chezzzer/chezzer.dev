import { type ReactNode } from "react"
import {
    accents,
    backgroundFor,
    fontClasses,
    tiltFor,
    type Accent,
    type Background,
    type Font,
} from "~/lib/guestbook/styles"
import { cn } from "~/lib/utils"

export default function GuestbookCard({
    id,
    background,
    accent,
    font,
    message,
    footer,
    tilt = true,
    className,
}: {
    id: string
    background: Background
    accent: Accent
    font: Font
    message: ReactNode
    footer: ReactNode
    tilt?: boolean
    className?: string
}) {
    return (
        <article
            className={cn(
                "relative flex min-h-40 flex-col bg-surface-1 p-5 embossed",
                className
            )}
            style={{
                backgroundImage: backgroundFor(background, accent),
                boxShadow: `inset 0 2px 0 ${accents[accent]}, var(--shadow-emboss)`,
                transform: tilt ? `rotate(${tiltFor(id)}deg)` : undefined,
            }}
        >
            <div
                className={cn(
                    "flex-1 break-words whitespace-pre-wrap text-text",
                    fontClasses[font]
                )}
                style={{
                    textShadow:
                        "0 1px 2px rgba(0, 0, 0, 0.9), 0 0 10px rgba(14, 13, 11, 0.8)",
                }}
            >
                {message}
            </div>
            <footer
                className="mt-4 flex items-end justify-between gap-3 label text-text-muted"
                style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.9)" }}
            >
                {footer}
            </footer>
        </article>
    )
}
