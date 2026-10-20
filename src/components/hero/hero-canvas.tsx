"use client"

import { useEffect, useRef } from "react"
import {
    createField,
    stepField,
    type Field,
    type Pointer,
} from "~/components/hero/field"
import { createCompositor } from "~/components/hero/lens"
import {
    createMask,
    createPalette,
    createRim,
    drawFrame,
    parseHex,
    type Colors,
    type Palette,
    type TextLayer,
} from "~/components/hero/render"
import { drawSpill } from "~/components/hero/spill"
import { site } from "~/lib/site"
import { cn } from "~/lib/utils"

const idleDelay = 2000
const idleRamp = 600
const push = 12
const bulge = 0.3

type Layers = {
    width: number
    height: number
    dpr: number
    field: Field
    mask: TextLayer
    rim: TextLayer
    radius: number
    face: HTMLCanvasElement
    faceCtx: CanvasRenderingContext2D
    back: HTMLCanvasElement
    backCtx: CanvasRenderingContext2D
}

function readColors(): Colors {
    const style = getComputedStyle(document.documentElement)
    const read = (name: string) => parseHex(style.getPropertyValue(name))
    return {
        faint: read("--color-text-faint"),
        muted: read("--color-text-muted"),
        text: read("--color-text"),
        ember: read("--color-ember"),
        base: read("--color-surface-2"),
        line: read("--color-line"),
    }
}

function heroFont(family: string) {
    const size = Math.min(340, Math.max(84, window.innerWidth * 0.26))
    return `400 ${size}px ${family}`
}

export default function HeroCanvas({
    onReady,
    className,
}: {
    onReady: () => void
    className?: string
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const probeRef = useRef<HTMLSpanElement>(null)
    const readyRef = useRef(onReady)

    useEffect(() => {
        readyRef.current = onReady
    }, [onReady])

    useEffect(() => {
        const canvas = canvasRef.current
        const probe = probeRef.current
        if (!canvas || !probe) return

        const compositor = createCompositor(canvas)

        const reduceMotion = matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
        const family = getComputedStyle(probe).fontFamily
        const colors = readColors()
        const palette: Palette = createPalette(colors)

        let cancelled = false
        let layers: Layers | null = null
        let frame = 0
        let visible = true
        let lastTime = 0
        let lastInput = 0
        let hasInput = false
        let wasInside = false
        const target: Pointer = { x: 0, y: 0 }
        const pointer: Pointer = { x: 0, y: 0 }
        const auto: Pointer = { x: 0, y: 0 }

        const build = () => {
            const rect = canvas.getBoundingClientRect()
            const width = Math.max(1, Math.round(rect.width))
            const height = Math.max(1, Math.round(rect.height))
            const small = width < 640
            const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
            canvas.width = Math.round(width * dpr)
            canvas.height = Math.round(height * dpr)
            compositor.resize()

            const face = document.createElement("canvas")
            face.width = canvas.width
            face.height = canvas.height
            const faceCtx = face.getContext("2d")!

            const back = document.createElement("canvas")
            back.width = canvas.width
            back.height = canvas.height
            const backCtx = back.getContext("2d")!

            const text = {
                text: site.name,
                font: heroFont(family),
                width,
                height,
                dpr,
            }
            const mask = createMask(text)

            layers = {
                width,
                height,
                dpr,
                field: createField(width, height, small ? 18 : 14),
                mask,
                rim: createRim(text),
                radius: small ? 150 : 220,
                face,
                faceCtx,
                back,
                backCtx,
            }

            if (!hasInput) {
                target.x = mask.centerX - mask.wordWidth * 0.4
                target.y = mask.centerY - height * 0.08
                pointer.x = target.x
                pointer.y = target.y
            }
        }

        const draw = (time: number) => {
            if (!layers) return

            layers.faceCtx.setTransform(layers.dpr, 0, 0, layers.dpr, 0, 0)
            drawFrame(layers.faceCtx, {
                field: layers.field,
                pointer,
                time,
                radius: layers.radius,
                palette,
                colors,
                mask: layers.mask.canvas,
                rim: layers.rim.canvas,
                width: layers.width,
                height: layers.height,
            })

            layers.backCtx.setTransform(layers.dpr, 0, 0, layers.dpr, 0, 0)
            drawSpill(layers.backCtx, {
                field: layers.field,
                palette,
                time,
                width: layers.width,
                height: layers.height,
            })

            compositor.draw({
                face: layers.face,
                back: layers.back,
                pointer,
                radius: layers.radius,
                strength: bulge,
                dpr: layers.dpr,
            })
        }

        const autopilot = (time: number) => {
            if (!layers) return
            auto.x =
                layers.width / 2 +
                layers.mask.wordWidth * 0.42 * Math.sin(time * 0.37)
            auto.y =
                layers.height / 2 +
                layers.height * 0.22 * Math.sin(time * 0.53 + 1)
        }

        const step = (dt: number) => {
            if (!layers) return
            stepField(layers.field, {
                pointer,
                radius: layers.radius,
                push,
                dt,
            })
        }

        const tick = (now: number) => {
            if (cancelled || !layers) return
            const time = now / 1000
            const dt = lastTime
                ? Math.min((now - lastTime) / 1000, 0.05)
                : 0.016
            lastTime = now

            const idle = now - lastInput
            if (idle > idleDelay) {
                const blend = Math.min(1, (idle - idleDelay) / idleRamp)
                autopilot(time)
                target.x += (auto.x - target.x) * blend * 0.08
                target.y += (auto.y - target.y) * blend * 0.08
            }

            const ease = 1 - Math.exp(-dt * 8)
            pointer.x += (target.x - pointer.x) * ease
            pointer.y += (target.y - pointer.y) * ease

            step(dt)
            draw(time)

            if (visible && !document.hidden) {
                frame = requestAnimationFrame(tick)
            } else {
                frame = 0
            }
        }

        const resume = () => {
            if (cancelled || reduceMotion || frame) return
            if (!visible || document.hidden) return
            lastTime = 0
            frame = requestAnimationFrame(tick)
        }

        const onPointer = (event: PointerEvent) => {
            const rect = canvas.getBoundingClientRect()
            const x = event.clientX - rect.left
            const y = event.clientY - rect.top
            const inside =
                x >= 0 && y >= 0 && x <= rect.width && y <= rect.height
            if (!inside) {
                if (wasInside)
                    lastInput = performance.now() - idleDelay - idleRamp
                wasInside = false
                return
            }
            wasInside = true
            target.x = x
            target.y = y
            lastInput = performance.now()
            hasInput = true
            if (reduceMotion && layers) {
                pointer.x = target.x
                pointer.y = target.y
                step(0.05)
                draw(lastInput / 1000)
            }
        }

        const onVisibility = () => resume()

        const observer = new IntersectionObserver(([entry]) => {
            visible = entry?.isIntersecting ?? true
            resume()
        })
        const resizer = new ResizeObserver(() => {
            if (!layers) return
            build()
            draw(performance.now() / 1000)
        })

        const start = async () => {
            try {
                await document.fonts.load(heroFont(family), site.name)
            } catch {}
            if (cancelled) return
            build()
            lastInput = performance.now()
            draw(lastInput / 1000)
            readyRef.current()
            observer.observe(canvas)
            resizer.observe(canvas)
            window.addEventListener("pointermove", onPointer, { passive: true })
            document.addEventListener("visibilitychange", onVisibility)
            resume()
        }

        void start()

        return () => {
            cancelled = true
            if (frame) cancelAnimationFrame(frame)
            observer.disconnect()
            resizer.disconnect()
            window.removeEventListener("pointermove", onPointer)
            document.removeEventListener("visibilitychange", onVisibility)
        }
    }, [])

    return (
        <>
            <span ref={probeRef} aria-hidden className="sr-only font-hero">
                {site.name}
            </span>
            <canvas
                ref={canvasRef}
                aria-hidden
                className={cn(
                    "absolute inset-0 h-full w-full touch-pan-y",
                    className
                )}
            />
        </>
    )
}
