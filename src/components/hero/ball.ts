import { bite } from "~/components/hero/bite"
import { type Field } from "~/components/hero/field"
import { type Ball, type Game } from "~/components/hero/game"
import { type Word } from "~/components/hero/word"

type Contact = {
    nx: number
    ny: number
    depth: number
}

const maxBounce = Math.PI * 0.36
const minClimb = 0.2
const speedGain = 1.04
const speedLimit = 1.3

function probeWord(word: Word, ball: Ball): Contact | null {
    const { dpr, mask, solid } = word
    const r = ball.radius
    const x0 = Math.max(0, Math.floor((ball.x - r) * dpr))
    const y0 = Math.max(0, Math.floor((ball.y - r) * dpr))
    const x1 = Math.min(mask.width - 1, Math.ceil((ball.x + r) * dpr))
    const y1 = Math.min(mask.height - 1, Math.ceil((ball.y + r) * dpr))
    let nx = 0
    let ny = 0
    let depth = 0
    let hits = 0

    for (let py = y0; py <= y1; py++) {
        for (let px = x0; px <= x1; px++) {
            if (!solid[py * mask.width + px]) continue
            const ox = ball.x - (px + 0.5) / dpr
            const oy = ball.y - (py + 0.5) / dpr
            const d = Math.hypot(ox, oy)
            if (d >= r) continue
            hits++
            depth = Math.max(depth, r - d)
            nx += ox / Math.max(d, 0.01)
            ny += oy / Math.max(d, 0.01)
        }
    }

    if (!hits) return null

    const length = Math.hypot(nx, ny)
    if (length < 0.001) {
        const speed = Math.hypot(ball.vx, ball.vy) || 1
        return { nx: -ball.vx / speed, ny: -ball.vy / speed, depth }
    }
    return { nx: nx / length, ny: ny / length, depth }
}

function keepClimbing(game: Game) {
    const { ball, speed } = game
    const floor = speed * minClimb
    if (Math.abs(ball.vy) >= floor) return

    const up = ball.vy <= 0 ? -1 : 1
    const side = ball.vx < 0 ? -1 : 1
    ball.vy = up * floor
    ball.vx = side * Math.sqrt(speed * speed - floor * floor)
}

function collideWord(game: Game, field: Field, word: Word, time: number) {
    const { ball } = game
    const contact = probeWord(word, ball)
    if (!contact) return

    const { nx, ny, depth } = contact
    ball.x += nx * (depth + 0.5)
    ball.y += ny * (depth + 0.5)

    const along = ball.vx * nx + ball.vy * ny
    if (along >= 0) return

    ball.vx -= 2 * along * nx
    ball.vy -= 2 * along * ny
    keepClimbing(game)
    bite(
        game,
        field,
        word,
        ball.x - nx * ball.radius,
        ball.y - ny * ball.radius,
        time
    )
}

function bounceWalls(game: Game) {
    const { ball } = game
    const r = ball.radius

    if (ball.x < r) {
        ball.x = r
        ball.vx = Math.abs(ball.vx)
    }
    if (ball.x > game.width - r) {
        ball.x = game.width - r
        ball.vx = -Math.abs(ball.vx)
    }
    if (ball.y < r) {
        ball.y = r
        ball.vy = Math.abs(ball.vy)
    }
}

function bouncePaddle(game: Game) {
    const { ball, paddle } = game
    const r = ball.radius
    const half = paddle.width / 2
    const top = paddle.y - paddle.height / 2
    const onPaddle =
        ball.vy > 0 &&
        ball.y + r >= top &&
        ball.y - r <= paddle.y + paddle.height &&
        Math.abs(ball.x - paddle.x) <= half + r
    if (!onPaddle) return

    const offset = Math.max(-1, Math.min(1, (ball.x - paddle.x) / half))
    const angle = -Math.PI / 2 + offset * maxBounce
    game.speed = Math.min(game.baseSpeed * speedLimit, game.speed * speedGain)
    ball.vx = Math.cos(angle) * game.speed
    ball.vy = Math.sin(angle) * game.speed
    ball.y = top - r
    paddle.heat = 1
}

export function stepBall(
    game: Game,
    field: Field,
    word: Word,
    time: number,
    dt: number
) {
    const { ball } = game
    ball.x += ball.vx * dt
    ball.y += ball.vy * dt

    bounceWalls(game)
    bouncePaddle(game)

    if (ball.y - ball.radius > game.height) {
        game.playing = false
        return
    }

    collideWord(game, field, word, time)
}
