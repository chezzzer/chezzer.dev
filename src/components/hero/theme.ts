import { parseHex, type Colors } from "~/components/hero/colors"

export type Font = {
    font: string
    letterSpacing: string
}

export function readColors(): Colors {
    const style = getComputedStyle(document.documentElement)
    const read = (name: string) => parseHex(style.getPropertyValue(name))
    return {
        faint: read("--color-text-faint"),
        muted: read("--color-text-muted"),
        text: read("--color-text"),
        ember: read("--color-ember"),
        base: read("--color-surface-2"),
        line: read("--color-line"),
    }
}

export function readFont(element: Element): Font {
    const style = getComputedStyle(element)
    return {
        font: `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`,
        letterSpacing: style.letterSpacing,
    }
}
