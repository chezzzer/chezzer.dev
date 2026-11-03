import { rgba, type Colors } from "~/components/hero/colors"
import { drawDots } from "~/components/hero/dots"
import { type Field, type Pointer } from "~/components/hero/field"
import { type Palette } from "~/components/hero/palette"
import { type Word } from "~/components/hero/word"

export type FaceState = {
    field: Field
    word: Word
    pointer: Pointer
    time: number
    radius: number
    palette: Palette
    colors: Colors
    alpha: number
    width: number
    height: number
}

export function drawFace(ctx: CanvasRenderingContext2D, state: FaceState) {
    const { word, pointer, time, radius, colors, alpha, width, height } = state

    ctx.globalCompositeOperation = "source-over"
    ctx.globalAlpha = 1
    ctx.clearRect(0, 0, width, height)
    ctx.globalAlpha = alpha
    ctx.fillStyle = rgba(colors.base)
    ctx.fillRect(0, 0, width, height)

    const glow = ctx.createRadialGradient(
        pointer.x,
        pointer.y,
        0,
        pointer.x,
        pointer.y,
        radius * 2.4
    )
    glow.addColorStop(0, rgba(colors.ember, 0.12))
    glow.addColorStop(0.45, rgba(colors.ember, 0.045))
    glow.addColorStop(1, rgba(colors.ember, 0))
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, width, height)

    drawDots(ctx, {
        field: state.field,
        palette: state.palette,
        time,
        dim: 1,
        sparse: false,
    })

    ctx.globalCompositeOperation = "destination-in"
    ctx.drawImage(word.mask, 0, 0, width, height)
    ctx.globalCompositeOperation = "source-over"
    ctx.drawImage(word.rim.canvas, 0, 0, width, height)
    ctx.globalAlpha = 1
}
