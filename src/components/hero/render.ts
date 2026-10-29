import { noise, type Field, type Pointer } from "~/components/hero/field"

export type Rgb = [number, number, number]

export type Colors = {
    faint: Rgb
    muted: Rgb
    text: Rgb
    ember: Rgb
    base: Rgb
    line: Rgb
}

export type Palette = {
    colors: string[]
    steps: number
    tints: number
}

export function parseHex(value: string): Rgb {
    const hex = value.trim().replace("#", "")
    const full =
        hex.length === 3
            ? hex
                  .split("")
                  .map((char) => char + char)
                  .join("")
            : hex
    const number = parseInt(full, 16)
    return [(number >> 16) & 255, (number >> 8) & 255, number & 255]
}

export function mix(a: Rgb, b: Rgb, t: number): Rgb {
    return [
        Math.round(a[0] + (b[0] - a[0]) * t),
        Math.round(a[1] + (b[1] - a[1]) * t),
        Math.round(a[2] + (b[2] - a[2]) * t),
    ]
}

export function rgba([r, g, b]: Rgb, alpha = 1) {
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function createPalette(colors: Colors, steps = 32, tints = 5): Palette {
    const list: string[] = []

    for (let tint = 0; tint < tints; tint++) {
        for (let step = 0; step < steps; step++) {
            const grey = mix(colors.faint, colors.text, step / (steps - 1))
            list.push(rgba(mix(grey, colors.ember, tint / (tints - 1))))
        }
    }

    return { colors: list, steps, tints }
}

const buckets: number[][] = []

const brightnessCache = { time: -1, values: new Float32Array(0) }

function brightnessBuffer(count: number, time: number) {
    const stale =
        brightnessCache.time !== time || brightnessCache.values.length !== count
    if (brightnessCache.values.length !== count) {
        brightnessCache.values = new Float32Array(count)
    }
    brightnessCache.time = time
    return { values: brightnessCache.values, stale }
}

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

const clusterLevels = 4

function clusterFor(x: number, y: number, time: number) {
    const broad = noise(x * 0.0025 + time * 0.012, y * 0.0025, time * 0.018)
    const detail = noise(x * 0.007, y * 0.007 + time * 0.02, time * 0.03)
    const cluster = broad * 0.65 + detail * 0.35
    const edge = Math.min(1, Math.max(0, (cluster - 0.46) / 0.3))
    return Math.ceil(edge * clusterLevels) / clusterLevels
}

export type PointsState = {
    field: Field
    palette: Palette
    time: number
    dim: number
    sparse: boolean
}

export function drawPoints(ctx: CanvasRenderingContext2D, state: PointsState) {
    const { field, palette, time, dim, sparse } = state
    const used = new Set<number>()
    const cache = brightnessBuffer(field.points.length, time)

    for (let i = 0; i < field.points.length; i++) {
        const point = field.points[i]!
        if (cache.stale) {
            cache.values[i] = brightnessFor(point.x, point.y, point.heat, time)
        }
        if (!sparse && field.alive[i] === 0) continue
        let brightness = cache.values[i]!

        if (sparse) {
            const visible = Math.max(
                clusterFor(point.x, point.y, time),
                point.heat
            )
            if (visible <= 0) continue
            brightness *= visible
        }

        const step = Math.min(
            palette.steps - 1,
            Math.round(brightness * dim * (palette.steps - 1))
        )
        const tint = Math.min(
            palette.tints - 1,
            Math.round(point.heat * (palette.tints - 1))
        )
        const index = tint * palette.steps + step

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

export type FrameState = {
    field: Field
    pointer: Pointer
    time: number
    radius: number
    palette: Palette
    colors: Colors
    mask: HTMLCanvasElement
    rim: HTMLCanvasElement
    alpha: number
    width: number
    height: number
}

export function drawFrame(ctx: CanvasRenderingContext2D, state: FrameState) {
    const { pointer, time, radius, colors, mask, rim, alpha, width, height } =
        state

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

    drawPoints(ctx, {
        field: state.field,
        palette: state.palette,
        time,
        dim: 1,
        sparse: false,
    })

    ctx.globalCompositeOperation = "destination-in"
    ctx.drawImage(mask, 0, 0, width, height)
    ctx.globalCompositeOperation = "source-over"
    ctx.drawImage(rim, 0, 0, width, height)
    ctx.globalAlpha = 1
}

export type TextLayer = {
    canvas: HTMLCanvasElement
    wordWidth: number
    centerX: number
    centerY: number
}

export type TextOptions = {
    text: string
    font: string
    width: number
    height: number
    dpr: number
}

function prepareText(options: TextOptions) {
    const canvas = document.createElement("canvas")
    canvas.width = Math.round(options.width * options.dpr)
    canvas.height = Math.round(options.height * options.dpr)
    const ctx = canvas.getContext("2d")!
    ctx.setTransform(options.dpr, 0, 0, options.dpr, 0, 0)
    ctx.font = options.font
    if ("letterSpacing" in ctx) {
        ctx.letterSpacing = "0.02em"
    }
    ctx.textAlign = "center"
    ctx.textBaseline = "alphabetic"
    const metrics = ctx.measureText(options.text)
    const centerX = options.width / 2
    const centerY =
        options.height / 2 +
        (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2
    return { canvas, ctx, centerX, centerY, wordWidth: metrics.width }
}

export function createMask(options: TextOptions): TextLayer {
    const { canvas, ctx, centerX, centerY, wordWidth } = prepareText(options)
    ctx.fillStyle = "#000"
    ctx.fillText(options.text, centerX, centerY)
    return { canvas, wordWidth, centerX, centerY }
}

export function createRim(options: TextOptions): TextLayer {
    const rim = prepareText(options)

    const outline = prepareText(options)
    outline.ctx.lineWidth = 2
    outline.ctx.lineJoin = "round"
    outline.ctx.strokeStyle = "rgba(237, 232, 222, 0.3)"
    outline.ctx.strokeText(options.text, rim.centerX, rim.centerY)
    outline.ctx.globalCompositeOperation = "destination-out"
    outline.ctx.fillText(options.text, rim.centerX, rim.centerY)
    rim.ctx.drawImage(outline.canvas, 0, 0, options.width, options.height)

    const highlight = prepareText(options)
    highlight.ctx.fillStyle = "rgba(237, 232, 222, 0.16)"
    highlight.ctx.fillText(options.text, rim.centerX, rim.centerY)
    highlight.ctx.globalCompositeOperation = "destination-out"
    highlight.ctx.fillText(options.text, rim.centerX + 1, rim.centerY + 1)
    rim.ctx.drawImage(highlight.canvas, 0, 0, options.width, options.height)

    const shade = prepareText(options)
    shade.ctx.fillStyle = "rgba(0, 0, 0, 0.4)"
    shade.ctx.fillText(options.text, rim.centerX, rim.centerY)
    shade.ctx.globalCompositeOperation = "destination-out"
    shade.ctx.fillText(options.text, rim.centerX - 1, rim.centerY - 1)
    rim.ctx.drawImage(shade.canvas, 0, 0, options.width, options.height)

    return {
        canvas: rim.canvas,
        wordWidth: rim.wordWidth,
        centerX: rim.centerX,
        centerY: rim.centerY,
    }
}
