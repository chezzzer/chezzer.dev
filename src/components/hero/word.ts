import { cloneCanvas, contextOf, createCanvas } from "~/components/hero/canvas"
import { type Colors } from "~/components/hero/colors"
import { clampRect, fullRect, type Rect } from "~/components/hero/rect"
import { createRim, refreshRim, type Rim } from "~/components/hero/rim"

export type Word = {
    width: number
    height: number
    dpr: number
    centerX: number
    centerY: number
    wordWidth: number
    mask: HTMLCanvasElement
    solid: Uint8Array
    pristineMask: HTMLCanvasElement
    pristineSolid: Uint8Array
    rim: Rim
}

export type WordOptions = {
    text: string
    font: string
    letterSpacing: string
    width: number
    height: number
    dpr: number
    colors: Colors
}

function readSolid(mask: HTMLCanvasElement) {
    const { data } = contextOf(mask).getImageData(0, 0, mask.width, mask.height)
    const solid = new Uint8Array(mask.width * mask.height)
    for (let i = 0; i < solid.length; i++) {
        solid[i] = data[i * 4 + 3]! > 127 ? 1 : 0
    }
    return solid
}

export function createWord(options: WordOptions): Word {
    const { text, font, letterSpacing, width, height, dpr, colors } = options
    const mask = createCanvas(Math.round(width * dpr), Math.round(height * dpr))
    const ctx = contextOf(mask)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.font = font
    if ("letterSpacing" in ctx) {
        ctx.letterSpacing = letterSpacing
    }
    ctx.textAlign = "center"
    ctx.textBaseline = "alphabetic"
    const metrics = ctx.measureText(text)
    const centerX = width / 2
    const centerY =
        height / 2 +
        (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2
    ctx.fillStyle = "#000"
    ctx.fillText(text, centerX, centerY)

    const solid = readSolid(mask)
    return {
        width,
        height,
        dpr,
        centerX,
        centerY,
        wordWidth: metrics.width,
        mask,
        solid,
        pristineMask: cloneCanvas(mask),
        pristineSolid: solid.slice(),
        rim: createRim(mask, colors, dpr),
    }
}

export function solidAt(word: Word, px: number, py: number) {
    const { width, height } = word.mask
    if (px < 0 || py < 0 || px >= width || py >= height) return false
    return word.solid[py * width + px] === 1
}

export function punchWord(word: Word, area: Rect) {
    const rect = clampRect(area, word.mask)
    if (rect.width <= 0 || rect.height <= 0) return

    const ctx = contextOf(word.mask)
    ctx.save()
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(rect.x, rect.y, rect.width, rect.height)
    ctx.restore()

    const stride = word.mask.width
    for (let y = rect.y; y < rect.y + rect.height; y++) {
        word.solid.fill(
            0,
            y * stride + rect.x,
            y * stride + rect.x + rect.width
        )
    }
}

export function restoreWord(word: Word) {
    const ctx = contextOf(word.mask)
    ctx.save()
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, word.mask.width, word.mask.height)
    ctx.drawImage(word.pristineMask, 0, 0)
    ctx.restore()
    word.solid.set(word.pristineSolid)
    refreshRim(word.rim, word.mask, fullRect(word.mask))
}
