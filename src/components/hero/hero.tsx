"use client"

import { useState } from "react"
import HeroCanvas from "~/components/hero/hero-canvas"
import HeroWord from "~/components/hero/hero-word"
import { cn } from "~/lib/utils"

const fade = "radial-gradient(ellipse at center, black 30%, transparent 75%)"

export default function Hero() {
    const [ready, setReady] = useState(false)

    return (
        <div className="relative h-[42vh] min-h-[240px] sm:h-[52vh]">
            <div
                aria-hidden
                className={cn(
                    "absolute inset-0 hairline-grid opacity-50 transition-opacity duration-700",
                    ready && "opacity-0"
                )}
                style={{ maskImage: fade }}
            />
            <HeroWord
                className={cn(
                    "transition-opacity duration-700",
                    ready && "opacity-0"
                )}
            />
            <HeroCanvas
                onReady={() => setReady(true)}
                className={cn(
                    "transition-opacity duration-700",
                    !ready && "opacity-0"
                )}
            />
        </div>
    )
}
