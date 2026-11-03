import { type Field } from "~/components/hero/field"
import { noise } from "~/components/hero/noise"
import { paletteIndex, type Palette } from "~/components/hero/palette"

const clusterLevels = 4

const buckets: number[][] = []

function bucketFor(index: number) {
    const bucket = buckets[index] ?? (buckets[index] = [])
    bucket.length = 0
    return bucket
}

function brightnessFor(x: number, y: number, heat: number, time: number) {
    const ripple = noise(x * 0.004 + time * 0.02, y * 0.004, time * 0.03)
    const drift = noise(x * 0.012, y * 0.012, time * 0.1)
    return 0.2 + ripple * 0.25 + drift * 0.3 + heat * 0.6
}

function clusterFor(x: number, y: number, time: number) {
    const broad = noise(x * 0.0025 + time * 0.012, y * 0.0025, time * 0.018)
    const detail = noise(x * 0.007, y * 0.007 + time * 0.02, time * 0.03)
    const cluster = broad * 0.65 + detail * 0.35
    const edge = Math.min(1, Math.max(0, (cluster - 0.46) / 0.3))
    return Math.ceil(edge * clusterLevels) / clusterLevels
}

export function lightField(field: Field, time: number) {
    for (const point of field.points) {
        point.light = brightnessFor(point.x, point.y, point.heat, time)
    }
}

export type DotsState = {
    field: Field
    palette: Palette
    time: number
    dim: number
    sparse: boolean
}

export function drawDots(ctx: CanvasRenderingContext2D, state: DotsState) {
    const { field, palette, time, dim, sparse } = state
    const used = new Set<number>()

    for (let i = 0; i < field.points.length; i++) {
        const point = field.points[i]!
        if (!sparse && field.alive[i] === 0) continue
        let brightness = point.light

        if (sparse) {
            const visible = Math.max(
                clusterFor(point.x, point.y, time),
                point.heat
            )
            if (visible <= 0) continue
            brightness *= visible
        }

        const index = paletteIndex(palette, brightness * dim, point.heat)
        if (!used.has(index)) {
            used.add(index)
            bucketFor(index)
        }
        buckets[index]!.push(i)
    }

    for (const index of used) {
        ctx.fillStyle = palette.colors[index]!
        ctx.beginPath()
        for (const i of buckets[index]!) {
            const point = field.points[i]!
            const r = 1 + point.heat * 1.2
            const x = point.x + point.dx
            const y = point.y + point.dy
            ctx.moveTo(x + r, y)
            ctx.arc(x, y, r, 0, Math.PI * 2)
        }
        ctx.fill()
    }
}
