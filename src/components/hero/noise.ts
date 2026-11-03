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
