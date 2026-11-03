import { type Field } from "~/components/hero/field"
import { type Game } from "~/components/hero/game"
import { unionRect, type Rect } from "~/components/hero/rect"
import { refreshRim } from "~/components/hero/rim"
import { punchWord, restoreWord, type Word } from "~/components/hero/word"

const biteSize = 2
const biteExtras = 2
const remainder = 0.02

function random(min: number, max: number) {
    return min + Math.random() * (max - min)
}

function knock(game: Game, field: Field, index: number) {
    field.alive[index] = 0
    game.bricksAlive--
    if (game.looseCount >= game.loose.length) return

    const point = field.points[index]!
    const dot = game.loose[game.looseCount++]!
    dot.x = point.x + point.dx
    dot.y = point.y + point.dy
    dot.vx = game.ball.vx * 0.35 + random(-90, 90)
    dot.vy = game.ball.vy * 0.35 + random(-140, 20)
    dot.life = 1
}

function cellRect(word: Word, field: Field, col: number, row: number): Rect {
    const { cell } = field
    const x = Math.round(col * cell * word.dpr)
    const y = Math.round(row * cell * word.dpr)
    return {
        x,
        y,
        width: Math.round((col + 1) * cell * word.dpr) - x,
        height: Math.round((row + 1) * cell * word.dpr) - y,
    }
}

function biteCells(field: Field, x: number, y: number) {
    const { cell } = field
    const col = Math.floor(x / cell)
    const row = Math.floor(y / cell)
    const left = x / cell - col < 0.5 ? col - 1 : col
    const top = y / cell - row < 0.5 ? row - 1 : row
    const cells: [number, number][] = []

    for (let dr = 0; dr < biteSize; dr++) {
        for (let dc = 0; dc < biteSize; dc++) {
            cells.push([left + dc, top + dr])
        }
    }

    for (let extra = 0; extra < biteExtras; extra++) {
        const side = Math.random() < 0.5 ? -1 : biteSize
        const along = Math.floor(random(0, biteSize))
        if (Math.random() < 0.5) {
            cells.push([left + side, top + along])
        } else {
            cells.push([left + along, top + side])
        }
    }

    return cells
}

function clearWord(game: Game, field: Field, word: Word, time: number) {
    restoreWord(word)
    field.alive.fill(1)
    game.bricksAlive = game.bricksTotal
    game.restoredAt = time
    game.playing = false
}

export function bite(
    game: Game,
    field: Field,
    word: Word,
    x: number,
    y: number,
    time: number
) {
    let dirty: Rect | null = null

    for (const [col, row] of biteCells(field, x, y)) {
        if (col < 0 || row < 0 || col >= field.cols || row >= field.rows) {
            continue
        }
        const rect = cellRect(word, field, col, row)
        punchWord(word, rect)
        dirty = dirty ? unionRect(dirty, rect) : rect

        const index = row * field.cols + col
        if (game.bricks[index] && field.alive[index]) knock(game, field, index)
    }

    if (dirty) refreshRim(word.rim, word.mask, dirty)

    if (game.bricksAlive <= game.bricksTotal * remainder) {
        clearWord(game, field, word, time)
    }
}
