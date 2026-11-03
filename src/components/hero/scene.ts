import {
    createCursor,
    leaveCursor,
    moveCursor,
    placeCursor,
    releaseCursor,
    settleCursor,
    stepCursor,
    wakeCursor,
} from "~/components/hero/cursor"
import { stepField } from "~/components/hero/field"
import { endGame, startGame, stepGame } from "~/components/hero/game"
import {
    createLayers,
    drawLayers,
    measure,
    type Layers,
} from "~/components/hero/layers"
import { createCompositor } from "~/components/hero/lens"
import { createPalette } from "~/components/hero/palette"
import { readColors, readFont } from "~/components/hero/theme"
import { site } from "~/lib/site"

const push = 12

export type SceneOptions = {
    canvas: HTMLCanvasElement
    fallback: HTMLElement
    onReady: () => void
}

export function createScene(options: SceneOptions) {
    const { canvas, fallback, onReady } = options
    const compositor = createCompositor(canvas)
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches
    const colors = readColors()
    const palette = createPalette(colors)
    const cursor = createCursor()

    let cancelled = false
    let layers: Layers | null = null
    let frame = 0
    let visible = true
    let lastTime = 0

    const build = () => {
        layers = createLayers(canvas, {
            font: readFont(fallback),
            colors,
            palette,
        })
        compositor.resize()
        placeCursor(cursor, layers)
    }

    const draw = (time: number) => {
        if (layers) drawLayers(layers, compositor, cursor, time)
    }

    const step = (now: number, time: number, dt: number) => {
        if (!layers) return
        const { game, field, word } = layers

        stepGame(game, field, word, { input: cursor.input, time, dt })
        stepCursor(cursor, layers, now, time, dt)
        stepField(field, {
            pointer: cursor.pointer,
            radius: cursor.radius,
            push,
            dt,
        })
    }

    const tick = (now: number) => {
        if (cancelled || !layers) return
        const time = now / 1000
        const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0.016
        lastTime = now

        step(now, time, dt)
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

    const locate = (event: PointerEvent) => {
        const rect = canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height
        return { x, y, inside }
    }

    const onPointer = (event: PointerEvent) => {
        const { x, y, inside } = locate(event)
        if (!inside) {
            leaveCursor(cursor, performance.now())
            return
        }
        moveCursor(cursor, x, y, performance.now())
        if (reduceMotion && layers) {
            settleCursor(cursor)
            stepField(layers.field, {
                pointer: cursor.pointer,
                radius: cursor.radius,
                push,
                dt: 0.05,
            })
            draw(cursor.lastInput / 1000)
        }
    }

    const onPress = (event: PointerEvent) => {
        onPointer(event)
        if (reduceMotion || !layers) return
        const { x, y, inside } = locate(event)
        if (inside && !layers.game.playing) {
            startGame(layers.game, x, y)
        }
    }

    const onRelease = (event: PointerEvent) => {
        if (event.pointerType === "touch") releaseCursor(cursor)
    }

    const onVisibility = () => resume()

    const observer = new IntersectionObserver(([entry]) => {
        visible = entry?.isIntersecting ?? true
        if (!visible && layers) endGame(layers.game)
        resume()
    })

    const resizer = new ResizeObserver(() => {
        if (!layers) return
        const { width, height } = measure(canvas)
        if (width === layers.width && height === layers.height) return
        build()
        draw(performance.now() / 1000)
    })

    const start = async () => {
        try {
            await document.fonts.load(readFont(fallback).font, site.name)
        } catch {}
        if (cancelled) return
        build()
        wakeCursor(cursor, performance.now())
        draw(cursor.lastInput / 1000)
        onReady()
        observer.observe(canvas)
        resizer.observe(canvas)
        window.addEventListener("pointermove", onPointer, { passive: true })
        window.addEventListener("pointerdown", onPress, { passive: true })
        window.addEventListener("pointerup", onRelease, { passive: true })
        window.addEventListener("pointercancel", onRelease, { passive: true })
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
        window.removeEventListener("pointerdown", onPress)
        window.removeEventListener("pointerup", onRelease)
        window.removeEventListener("pointercancel", onRelease)
        document.removeEventListener("visibilitychange", onVisibility)
    }
}
