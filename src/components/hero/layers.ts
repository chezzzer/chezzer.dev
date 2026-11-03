import { contextOf, createCanvas } from "~/components/hero/canvas"
import { type Colors } from "~/components/hero/colors"
import { type Cursor } from "~/components/hero/cursor"
import { lightField } from "~/components/hero/dots"
import { drawFace } from "~/components/hero/face"
import { createField, type Field } from "~/components/hero/field"
import {
    createGame,
    gameVisible,
    revealAt,
    type Game,
} from "~/components/hero/game"
import { drawGame } from "~/components/hero/game-draw"
import { type Compositor } from "~/components/hero/lens"
import { type Palette } from "~/components/hero/palette"
import { drawSpill } from "~/components/hero/spill"
import { type Font } from "~/components/hero/theme"
import { createWord, type Word } from "~/components/hero/word"
import { site } from "~/lib/site"

const bulge = 0.3

export type Layers = {
    width: number
    height: number
    dpr: number
    colors: Colors
    palette: Palette
    field: Field
    game: Game
    word: Word
    idleRadius: number
    playRadius: number
    face: HTMLCanvasElement
    faceCtx: CanvasRenderingContext2D
    back: HTMLCanvasElement
    backCtx: CanvasRenderingContext2D
    front: HTMLCanvasElement
    frontCtx: CanvasRenderingContext2D
}

export type LayerOptions = {
    font: Font
    colors: Colors
    palette: Palette
}

export function measure(canvas: HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect()
    return {
        width: Math.max(1, Math.round(rect.width)),
        height: Math.max(1, Math.round(rect.height)),
    }
}

export function createLayers(
    canvas: HTMLCanvasElement,
    options: LayerOptions
): Layers {
    const { font, colors, palette } = options
    const { width, height } = measure(canvas)
    const small = width < 640
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)

    const face = createCanvas(canvas.width, canvas.height)
    const back = createCanvas(canvas.width, canvas.height)
    const front = createCanvas(canvas.width, canvas.height)

    const word = createWord({
        text: site.name,
        font: font.font,
        letterSpacing: font.letterSpacing,
        width,
        height,
        dpr,
        colors,
    })
    const field = createField(width, height, small ? 18 : 14)
    const game = createGame({ field, word, colors, small })

    return {
        width,
        height,
        dpr,
        colors,
        palette,
        field,
        game,
        word,
        idleRadius: small ? 150 : 220,
        playRadius: small ? 70 : 90,
        face,
        faceCtx: contextOf(face),
        back,
        backCtx: contextOf(back),
        front,
        frontCtx: contextOf(front),
    }
}

export function drawLayers(
    layers: Layers,
    compositor: Compositor,
    cursor: Cursor,
    time: number
) {
    const { width, height, dpr, colors, palette, field, game, word } = layers
    const { pointer, radius } = cursor
    lightField(field, time)

    layers.faceCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
    drawFace(layers.faceCtx, {
        field,
        word,
        pointer,
        time,
        radius,
        palette,
        colors,
        alpha: revealAt(game, time),
        width,
        height,
    })

    layers.backCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
    drawSpill(layers.backCtx, { field, palette, time, width, height })

    const front = gameVisible(game) ? layers.front : null
    if (front) {
        layers.frontCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
        layers.frontCtx.clearRect(0, 0, width, height)
        drawGame(layers.frontCtx, game, colors)
    }

    compositor.draw({
        face: layers.face,
        back: layers.back,
        front,
        pointer,
        radius,
        strength: bulge,
        dpr,
    })
}
