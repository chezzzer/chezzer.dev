import { mix, rgba, type Colors } from "~/components/hero/colors"

export type Palette = {
    colors: string[]
    steps: number
    tints: number
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

export function paletteIndex(
    palette: Palette,
    brightness: number,
    heat: number
) {
    const step = Math.min(
        palette.steps - 1,
        Math.round(brightness * (palette.steps - 1))
    )
    const tint = Math.min(
        palette.tints - 1,
        Math.round(heat * (palette.tints - 1))
    )
    return tint * palette.steps + step
}
