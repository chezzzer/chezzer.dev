import { type Field } from "~/components/hero/field"
import { drawPoints, type Palette } from "~/components/hero/render"

export type SpillState = {
    field: Field
    palette: Palette
    time: number
    width: number
    height: number
}

export function drawSpill(ctx: CanvasRenderingContext2D, state: SpillState) {
    const { field, palette, time, width, height } = state

    ctx.globalCompositeOperation = "source-over"
    ctx.clearRect(0, 0, width, height)
    drawPoints(ctx, { field, palette, time, dim: 0.6, sparse: true })

    const radius = width * 0.5
    const fade = ctx.createRadialGradient(0, 0, 0, 0, 0, radius)
    fade.addColorStop(0.25, "rgba(0, 0, 0, 1)")
    fade.addColorStop(0.8, "rgba(0, 0, 0, 0)")
    ctx.globalCompositeOperation = "destination-in"
    ctx.save()
    ctx.translate(width / 2, height / 2)
    ctx.scale(1, (height / width) * 1.1)
    ctx.fillStyle = fade
    ctx.fillRect(-radius, -radius, radius * 2, radius * 2)
    ctx.restore()
    ctx.globalCompositeOperation = "source-over"
}
