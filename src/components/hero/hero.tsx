"use client"

import { useEffect, useRef, useState } from "react"
import HeroWord from "~/components/hero/hero-word"
import { createScene } from "~/components/hero/scene"
import { cn } from "~/lib/utils"

const fade = "radial-gradient(ellipse at center, black 30%, transparent 75%)"

export default function Hero() {
    const [ready, setReady] = useState(false)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const wordRef = useRef<HTMLParagraphElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const fallback = wordRef.current
        if (!canvas || !fallback) return
        return createScene({ canvas, fallback, onReady: () => setReady(true) })
    }, [])

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
                ref={wordRef}
                className={cn(
                    "transition-opacity duration-700",
                    ready && "opacity-0"
                )}
            />
            <canvas
                ref={canvasRef}
                aria-hidden
                className={cn(
                    "absolute inset-0 h-full w-full touch-pan-y transition-opacity duration-700",
                    !ready && "opacity-0"
                )}
            />
        </div>
    )
}
