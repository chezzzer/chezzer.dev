import { contextOf, createCanvas } from "~/components/hero/canvas"
import { rgba, type Colors } from "~/components/hero/colors"
import { clampRect, fullRect, type Rect } from "~/components/hero/rect"

export type Rim = {
    canvas: HTMLCanvasElement
    scratch: HTMLCanvasElement
    offset: number
    colors: Colors
}

type RimPass = {
    shape: [number, number][]
    cut: [number, number]
    color: string
}

function ringOffsets(offset: number): [number, number][] {
    const offsets: [number, number][] = []
    for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
            if (dx || dy) offsets.push([dx * offset, dy * offset])
        }
    }
    return offsets
}

function rimPasses(rim: Rim): RimPass[] {
    const { offset, colors } = rim
    return [
        {
            shape: ringOffsets(offset),
            cut: [0, 0],
            color: rgba(colors.text, 0.3),
        },
        {
            shape: [[0, 0]],
            cut: [offset, offset],
            color: rgba(colors.text, 0.16),
        },
        {
            shape: [[0, 0]],
            cut: [-offset, -offset],
            color: "rgba(0, 0, 0, 0.4)",
        },
    ]
}

export function createRim(
    mask: HTMLCanvasElement,
    colors: Colors,
    dpr: number
): Rim {
    const rim: Rim = {
        canvas: createCanvas(mask.width, mask.height),
        scratch: createCanvas(1, 1),
        offset: Math.max(1, Math.round(dpr)),
        colors,
    }
    refreshRim(rim, mask, fullRect(mask))
    return rim
}

export function refreshRim(rim: Rim, mask: HTMLCanvasElement, area: Rect) {
    const { canvas, scratch, offset } = rim
    const { x, y, width, height } = clampRect(area, mask, offset + 1)
    if (width <= 0 || height <= 0) return

    scratch.width = width
    scratch.height = height
    const ctx = contextOf(scratch)
    const out = contextOf(canvas)
    out.save()
    out.setTransform(1, 0, 0, 1, 0, 0)
    out.clearRect(x, y, width, height)

    for (const pass of rimPasses(rim)) {
        ctx.globalCompositeOperation = "source-over"
        ctx.clearRect(0, 0, width, height)
        for (const [dx, dy] of pass.shape) {
            ctx.drawImage(
                mask,
                x - dx,
                y - dy,
                width,
                height,
                0,
                0,
                width,
                height
            )
        }
        ctx.globalCompositeOperation = "destination-out"
        const [cx, cy] = pass.cut
        ctx.drawImage(mask, x - cx, y - cy, width, height, 0, 0, width, height)
        ctx.globalCompositeOperation = "source-in"
        ctx.fillStyle = pass.color
        ctx.fillRect(0, 0, width, height)
        out.drawImage(scratch, 0, 0, width, height, x, y, width, height)
    }

    out.restore()
}
