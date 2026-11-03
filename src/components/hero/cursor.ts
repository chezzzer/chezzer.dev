import { type Pointer } from "~/components/hero/field"
import { type Layers } from "~/components/hero/layers"

const idleDelay = 2000
const idleRamp = 600

export type Cursor = {
    target: Pointer
    rest: Pointer
    pointer: Pointer
    auto: Pointer
    follow: number
    radius: number
    input: number | null
    lastInput: number
    hasInput: boolean
    wasInside: boolean
}

export function createCursor(): Cursor {
    return {
        target: { x: 0, y: 0 },
        rest: { x: 0, y: 0 },
        pointer: { x: 0, y: 0 },
        auto: { x: 0, y: 0 },
        follow: 0,
        radius: 0,
        input: null,
        lastInput: 0,
        hasInput: false,
        wasInside: false,
    }
}

export function placeCursor(cursor: Cursor, layers: Layers) {
    cursor.radius = layers.idleRadius
    if (cursor.hasInput) return

    const { word, height } = layers
    cursor.target.x = word.centerX - word.wordWidth * 0.4
    cursor.target.y = word.centerY - height * 0.08
    settleCursor(cursor)
}

export function settleCursor(cursor: Cursor) {
    cursor.rest.x = cursor.target.x
    cursor.rest.y = cursor.target.y
    cursor.pointer.x = cursor.target.x
    cursor.pointer.y = cursor.target.y
}

export function wakeCursor(cursor: Cursor, now: number) {
    cursor.lastInput = now
}

export function moveCursor(cursor: Cursor, x: number, y: number, now: number) {
    cursor.wasInside = true
    cursor.target.x = x
    cursor.target.y = y
    cursor.input = x
    cursor.lastInput = now
    cursor.hasInput = true
}

export function leaveCursor(cursor: Cursor, now: number) {
    if (cursor.wasInside) cursor.lastInput = now - idleDelay - idleRamp
    cursor.wasInside = false
}

export function releaseCursor(cursor: Cursor) {
    cursor.input = null
}

function autopilot(cursor: Cursor, layers: Layers, time: number) {
    cursor.auto.x =
        layers.width / 2 + layers.word.wordWidth * 0.42 * Math.sin(time * 0.37)
    cursor.auto.y =
        layers.height / 2 + layers.height * 0.22 * Math.sin(time * 0.53 + 1)
}

export function stepCursor(
    cursor: Cursor,
    layers: Layers,
    now: number,
    time: number,
    dt: number
) {
    const { target, rest, pointer, auto } = cursor
    const { game } = layers

    const idle = now - cursor.lastInput
    if (idle > idleDelay) {
        const blend = Math.min(1, (idle - idleDelay) / idleRamp)
        autopilot(cursor, layers, time)
        target.x += (auto.x - target.x) * blend * 0.08
        target.y += (auto.y - target.y) * blend * 0.08
    }

    const ease = 1 - Math.exp(-dt * 8)
    rest.x += (target.x - rest.x) * ease
    rest.y += (target.y - rest.y) * ease

    cursor.follow += ((game.playing ? 1 : 0) - cursor.follow) * ease
    pointer.x = rest.x + (game.ball.x - rest.x) * cursor.follow
    pointer.y = rest.y + (game.ball.y - rest.y) * cursor.follow

    const goal = game.playing ? layers.playRadius : layers.idleRadius
    cursor.radius += (goal - cursor.radius) * ease
}
