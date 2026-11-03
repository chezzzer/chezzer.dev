export type Rgb = [number, number, number]

export type Colors = {
    faint: Rgb
    muted: Rgb
    text: Rgb
    ember: Rgb
    base: Rgb
    line: Rgb
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
