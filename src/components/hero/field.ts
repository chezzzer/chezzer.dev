export type Pointer = { x: number; y: number }

export type FieldPoint = {
    x: number
    y: number
    dx: number
    dy: number
    vx: number
    vy: number
    heat: number
}

export type Field = {
    cell: number
    cols: number
    rows: number
    points: FieldPoint[]
}

export function createField(
    width: number,
    height: number,
    cell: number
): Field {
    const cols = Math.ceil(width / cell) + 1
    const rows = Math.ceil(height / cell) + 1
    const points: FieldPoint[] = []

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            points.push({
                x: col * cell + cell / 2,
                y: row * cell + cell / 2,
                dx: 0,
                dy: 0,
                vx: 0,
                vy: 0,
                heat: 0,
            })
        }
    }

    return { cell, cols, rows, points }
}

function hash(x: number, y: number, z: number) {
    let n = (x * 1619 + y * 31337 + z * 6971) | 0
    n = (n << 13) ^ n
    const m = Math.imul(n, Math.imul(Math.imul(n, n), 15731) + 789221)
    return 1 - ((m + 1376312589) & 0x7fffffff) / 1073741824
}

function smooth(t: number) {
    return t * t * (3 - 2 * t)
}

function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t
}

export function noise(x: number, y: number, z: number) {
    const x0 = Math.floor(x)
    const y0 = Math.floor(y)
    const z0 = Math.floor(z)
    const tx = smooth(x - x0)
    const ty = smooth(y - y0)
    const tz = smooth(z - z0)

    const front = lerp(
        lerp(hash(x0, y0, z0), hash(x0 + 1, y0, z0), tx),
        lerp(hash(x0, y0 + 1, z0), hash(x0 + 1, y0 + 1, z0), tx),
        ty
    )
    const back = lerp(
        lerp(hash(x0, y0, z0 + 1), hash(x0 + 1, y0, z0 + 1), tx),
        lerp(hash(x0, y0 + 1, z0 + 1), hash(x0 + 1, y0 + 1, z0 + 1), tx),
        ty
    )

    return (lerp(front, back, tz) + 1) / 2
}

export type StepOptions = {
    pointer: Pointer
    radius: number
    push: number
    dt: number
}

const stiffness = 60
const damping = 9

export function stepField(field: Field, options: StepOptions) {
    const { pointer, radius, push } = options
    const step = Math.min(options.dt, 0.05)

    for (const point of field.points) {
        let targetX = 0
        let targetY = 0
        let heat = 0

        const offsetX = point.x - pointer.x
        const offsetY = point.y - pointer.y
        const distance = Math.hypot(offsetX, offsetY)

        if (distance < radius) {
            heat = (1 - distance / radius) ** 2
            const scale = (heat * push) / Math.max(distance, 1)
            targetX = offsetX * scale
            targetY = offsetY * scale
        }

        point.heat = heat
        point.vx +=
            (targetX - point.dx) * stiffness * step - point.vx * damping * step
        point.vy +=
            (targetY - point.dy) * stiffness * step - point.vy * damping * step
        point.dx += point.vx * step
        point.dy += point.vy * step
    }
}
