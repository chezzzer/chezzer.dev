"use client"

import {
    accentIds,
    accents,
    backgroundFor,
    backgroundIds,
    fontIds,
    type Accent,
    type Background,
    type Font,
} from "~/lib/guestbook/styles"
import { cn } from "~/lib/utils"

export type CardStyle = {
    background: Background
    accent: Accent
    font: Font
}

export default function StylePicker({
    value,
    onChange,
}: {
    value: CardStyle
    onChange: (next: CardStyle) => void
}) {
    return (
        <div className="flex flex-col gap-4">
            <div
                role="group"
                aria-label="Background"
                className="flex flex-wrap gap-2"
            >
                {backgroundIds.map((background) => (
                    <button
                        key={background}
                        type="button"
                        aria-label={background}
                        title={background}
                        aria-pressed={value.background === background}
                        onClick={() => onChange({ ...value, background })}
                        className={cn(
                            "h-9 w-9 border bg-surface-1 transition-colors",
                            value.background === background
                                ? "border-text"
                                : "border-line hover:border-line-strong"
                        )}
                        style={{
                            backgroundImage: backgroundFor(
                                background,
                                value.accent
                            ),
                        }}
                    />
                ))}
            </div>
            <div className="flex flex-wrap items-center gap-5">
                <div role="group" aria-label="Accent" className="flex gap-2">
                    {accentIds.map((accent) => (
                        <button
                            key={accent}
                            type="button"
                            title={accent}
                            aria-pressed={value.accent === accent}
                            onClick={() => onChange({ ...value, accent })}
                            className={cn(
                                "flex h-9 w-9 items-center justify-center rounded-full transition-transform",
                                value.accent === accent
                                    ? "scale-110"
                                    : "hover:scale-105"
                            )}
                            aria-label={accent}
                        >
                            <span
                                className={cn(
                                    "block h-5 w-5 rounded-full ring-2 ring-offset-2 ring-offset-surface-1",
                                    value.accent === accent
                                        ? "ring-text"
                                        : "ring-transparent"
                                )}
                                style={{ backgroundColor: accents[accent] }}
                            />
                        </button>
                    ))}
                </div>
                <div
                    role="group"
                    aria-label="Font"
                    className="flex gap-0.5 rounded-full bg-surface-1 p-1 embossed"
                >
                    {fontIds.map((font) => (
                        <button
                            key={font}
                            type="button"
                            aria-pressed={value.font === font}
                            onClick={() => onChange({ ...value, font })}
                            className={cn(
                                "rounded-full px-3 py-2 text-xs transition-colors",
                                font === "mono" && "font-mono",
                                font === "sans" && "font-sans",
                                font === "hand" && "font-hand text-sm",
                                value.font === font
                                    ? "bg-ink text-text debossed"
                                    : "text-text-muted hover:text-text"
                            )}
                        >
                            {font}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
