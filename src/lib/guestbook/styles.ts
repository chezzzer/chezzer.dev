import {
    bubbles,
    endlessClouds,
    eyes,
    fallingTriangles,
    floatingCogs,
    iLikeFood,
    jigsaw,
    kiwi,
    melt,
    pianoMan,
    skulls,
    topography,
} from "hero-patterns"

export const accents = {
    ember: "#ff6a1f",
    moss: "#8fa68b",
    sky: "#7aa2c9",
    violet: "#9b8ad4",
    rose: "#d48a9b",
    sand: "#d2b57a",
} as const

export type Accent = keyof typeof accents

export const accentIds = Object.keys(accents) as [Accent, ...Accent[]]

export function isAccent(value: string): value is Accent {
    return value in accents
}

export const fontIds = ["mono", "sans", "hand"] as const

export type Font = (typeof fontIds)[number]

export function isFont(value: string): value is Font {
    return (fontIds as readonly string[]).includes(value)
}

export const fontClasses: Record<Font, string> = {
    mono: "font-mono text-base leading-7",
    sans: "font-sans text-base leading-7",
    hand: "font-hand text-2xl leading-8",
}

const patterns = {
    plain: null,
    kiwi,
    jigsaw,
    bubbles,
    cogs: floatingCogs,
    skulls,
    food: iLikeFood,
    piano: pianoMan,
    melt,
    eyes,
    clouds: endlessClouds,
    triangles: fallingTriangles,
    topography,
} as const

export type Background = keyof typeof patterns

export const backgroundIds = Object.keys(patterns) as [
    Background,
    ...Background[],
]

export function isBackground(value: string): value is Background {
    return value in patterns
}

export function backgroundFor(background: Background, accent: Accent) {
    const pattern = patterns[background]
    return pattern ? pattern(accents[accent], 0.12) : undefined
}

export function tiltFor(id: string) {
    let hash = 0
    for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) | 0
    return ((hash % 300) / 100) * (hash % 2 === 0 ? 1 : -1)
}
