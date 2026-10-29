import { cellAt, type Field, type Pointer } from "~/components/hero/field"
import {
    mix,
    rgba,
    type Colors,
    type TextLayer,
} from "~/components/hero/render"

export type Ball = {
    x: number
    y: number
    vx: number
    vy: number
    radius: number
    trail: Pointer[]
    head: number
}

export type Paddle = {
    x: number
    y: number
    width: number
    heat: number
    presence: number
}

export type LooseDot = {
    x: number
    y: number
    vx: number
    vy: number
    life: number
}

export type Game = {
    width: number
    height: number
    dpr: number
    speed: number
    bricks: Uint8Array
    bricksTotal: number
    bricksAlive: number
    mask: HTMLCanvasElement
    rim: HTMLCanvasElement
    pristineMask: HTMLCanvasElement
    pristineRim: HTMLCanvasElement
    restoredAt: number
    ball: Ball
    paddle: Paddle
    playing: boolean
    loose: LooseDot[]
    looseCount: number
    looseColors: string[]
}

export type GameOptions = {
    field: Field
    mask: TextLayer
    rim: TextLayer
    colors: Colors
    width: number
    height: number
    dpr: number
    small: boolean
}

export type GameInput = {
    input: number | null
    time: number
    dt: number
}

const trailLength = 10
const looseLimit = 256
const looseShades = 6
const looseLife = 1.4
const gravity = 480
const contactScale = 0.78
const biteSize = 2
const biteExtras = 2
const remainder = 0.02
const revealTime = 0.8
const paddleHeight = 3
const paddleGap = 16
const maxBounce = Math.PI * 0.36
const minLaunch = Math.PI * 0.2
const stepLength = 5

function random(min: number, max: number) {
    return min + Math.random() * (max - min)
}

function clone(source: HTMLCanvasElement) {
    const canvas = document.createElement("canvas")
    canvas.width = source.width
    canvas.height = source.height
    canvas.getContext("2d")!.drawImage(source, 0, 0)
    return canvas
}

function seedBricks(field: Field, mask: TextLayer, dpr: number) {
    const canvas = mask.canvas
    const data = canvas
        .getContext("2d")!
        .getImageData(0, 0, canvas.width, canvas.height).data
    const bricks = new Uint8Array(field.points.length)

    field.points.forEach((point, i) => {
        const x = Math.min(canvas.width - 1, Math.round(point.x * dpr))
        const y = Math.min(canvas.height - 1, Math.round(point.y * dpr))
        bricks[i] = data[(y * canvas.width + x) * 4 + 3]! > 127 ? 1 : 0
    })

    return bricks
}

function restingY(paddle: Paddle, radius: number) {
    return paddle.y - paddleHeight / 2 - radius - 1
}

function resetTrail(ball: Ball) {
    for (const point of ball.trail) {
        point.x = ball.x
        point.y = ball.y
    }
}

export function createGame(options: GameOptions): Game {
    const { field, mask, rim, colors, width, height, dpr, small } = options
    const radius = small ? 4 : 4.5
    const paddle: Paddle = {
        x: mask.centerX,
        y: height - paddleGap,
        width: small ? 72 : 96,
        heat: 0,
        presence: 0,
    }
    const ball: Ball = {
        x: paddle.x,
        y: restingY(paddle, radius),
        vx: 0,
        vy: 0,
        radius,
        trail: Array.from({ length: trailLength }, () => ({ x: 0, y: 0 })),
        head: 0,
    }
    resetTrail(ball)

    const bricks = seedBricks(field, mask, dpr)
    const bricksTotal = bricks.reduce((sum, brick) => sum + brick, 0)

    return {
        width,
        height,
        dpr,
        speed: small ? 260 : 320,
        bricks,
        bricksTotal,
        bricksAlive: bricksTotal,
        mask: mask.canvas,
        rim: rim.canvas,
        pristineMask: clone(mask.canvas),
        pristineRim: clone(rim.canvas),
        restoredAt: -Infinity,
        ball,
        paddle,
        playing: false,
        loose: Array.from({ length: looseLimit }, () => ({
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            life: 0,
        })),
        looseCount: 0,
        looseColors: Array.from({ length: looseShades }, (_, i) =>
            rgba(mix(colors.ember, colors.faint, i / (looseShades - 1)))
        ),
    }
}

export function startGame(game: Game, x: number, y: number) {
    const { ball, paddle } = game
    ball.x = paddle.x
    ball.y = restingY(paddle, ball.radius)

    const aim = Math.atan2(y - ball.y, x - ball.x)
    const angle = Math.min(-minLaunch, Math.max(-Math.PI + minLaunch, aim))
    ball.vx = Math.cos(angle) * game.speed
    ball.vy = Math.sin(angle) * game.speed
    resetTrail(ball)
    game.playing = true
}

export function endGame(game: Game) {
    game.playing = false
}

export function revealAt(game: Game, time: number) {
    return Math.min(1, (time - game.restoredAt) / revealTime)
}

function stepPaddle(game: Game, frame: GameInput) {
    const { paddle } = game
    const { input, dt } = frame

    if (input !== null) {
        paddle.x += (input - paddle.x) * (1 - Math.exp(-dt * 20))
    }
    const half = paddle.width / 2
    paddle.x = Math.min(game.width - half, Math.max(half, paddle.x))
    paddle.heat = Math.max(0, paddle.heat - dt / 0.15)

    const presence = game.playing ? 1 : 0
    paddle.presence += (presence - paddle.presence) * (1 - Math.exp(-dt * 6))
}

function knock(game: Game, field: Field, index: number) {
    field.alive[index] = 0
    game.bricksAlive--
    if (game.looseCount >= looseLimit) return

    const point = field.points[index]!
    const dot = game.loose[game.looseCount++]!
    dot.x = point.x + point.dx
    dot.y = point.y + point.dy
    dot.vx = game.ball.vx * 0.35 + random(-90, 90)
    dot.vy = game.ball.vy * 0.35 + random(-140, 20)
    dot.life = 1
}

function punch(canvas: HTMLCanvasElement, dpr: number, rect: number[]) {
    const ctx = canvas.getContext("2d")!
    ctx.save()
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.globalCompositeOperation = "destination-out"
    ctx.fillStyle = "#000"
    ctx.fillRect(rect[0]!, rect[1]!, rect[2]!, rect[3]!)
    ctx.restore()
}

function punchCell(game: Game, field: Field, col: number, row: number) {
    if (col < 0 || row < 0 || col >= field.cols || row >= field.rows) return
    const { cell } = field
    const rect = [col * cell, row * cell, cell, cell]
    punch(game.mask, game.dpr, rect)
    punch(game.rim, game.dpr, rect)

    const index = row * field.cols + col
    if (game.bricks[index] && field.alive[index]) knock(game, field, index)
}

function restore(game: Game, field: Field, time: number) {
    for (const [canvas, pristine] of [
        [game.mask, game.pristineMask],
        [game.rim, game.pristineRim],
    ] as const) {
        const ctx = canvas.getContext("2d")!
        ctx.save()
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.globalCompositeOperation = "source-over"
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(pristine, 0, 0)
        ctx.restore()
    }
    field.alive.fill(1)
    game.bricksAlive = game.bricksTotal
    game.restoredAt = time
}

function bite(game: Game, field: Field, x: number, y: number, time: number) {
    const { cell } = field
    const col = Math.floor(x / cell)
    const row = Math.floor(y / cell)
    const left = x / cell - col < 0.5 ? col - 1 : col
    const top = y / cell - row < 0.5 ? row - 1 : row

    for (let dr = 0; dr < biteSize; dr++) {
        for (let dc = 0; dc < biteSize; dc++) {
            punchCell(game, field, left + dc, top + dr)
        }
    }

    for (let extra = 0; extra < biteExtras; extra++) {
        const side = Math.random() < 0.5 ? -1 : biteSize
        const along = Math.floor(random(0, biteSize))
        if (Math.random() < 0.5) {
            punchCell(game, field, left + side, top + along)
        } else {
            punchCell(game, field, left + along, top + side)
        }
    }

    if (game.bricksAlive <= game.bricksTotal * remainder) {
        restore(game, field, time)
    }
}

function collideBricks(game: Game, field: Field, time: number) {
    const { ball } = game
    const center = cellAt(field, ball.x, ball.y)
    if (center < 0) return

    const contact = field.cell * contactScale
    const reach = Math.ceil(contact / field.cell) + 1
    const col = center % field.cols
    const row = (center - col) / field.cols
    let nx = 0
    let ny = 0
    let touching = false

    for (let dr = -reach; dr <= reach; dr++) {
        const r = row + dr
        if (r < 0 || r >= field.rows) continue
        for (let dc = -reach; dc <= reach; dc++) {
            const c = col + dc
            if (c < 0 || c >= field.cols) continue
            const i = r * field.cols + c
            if (!game.bricks[i] || !field.alive[i]) continue

            const point = field.points[i]!
            const ox = ball.x - point.x
            const oy = ball.y - point.y
            const d = Math.hypot(ox, oy)
            if (d >= contact) continue
            touching = true
            nx += ox / Math.max(d, 0.001)
            ny += oy / Math.max(d, 0.001)
        }
    }

    if (!touching) return

    const length = Math.hypot(nx, ny)
    if (length < 0.001) {
        nx = 0
        ny = ball.vy > 0 ? -1 : 1
    } else {
        nx /= length
        ny /= length
    }

    const along = ball.vx * nx + ball.vy * ny
    if (along < 0) {
        ball.vx -= 2 * along * nx
        ball.vy -= 2 * along * ny
    }
    ball.x += nx * 2
    ball.y += ny * 2

    bite(
        game,
        field,
        ball.x - nx * ball.radius,
        ball.y - ny * ball.radius,
        time
    )
}

function stepBall(game: Game, field: Field, time: number, dt: number) {
    const { ball, paddle, speed } = game
    const r = ball.radius
    ball.x += ball.vx * dt
    ball.y += ball.vy * dt

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

    const half = paddle.width / 2
    const top = paddle.y - paddleHeight / 2
    const onPaddle =
        ball.vy > 0 &&
        ball.y + r >= top &&
        ball.y - r <= paddle.y + paddleHeight &&
        Math.abs(ball.x - paddle.x) <= half + r
    if (onPaddle) {
        const offset = Math.max(-1, Math.min(1, (ball.x - paddle.x) / half))
        const angle = -Math.PI / 2 + offset * maxBounce
        ball.vx = Math.cos(angle) * speed
        ball.vy = Math.sin(angle) * speed
        ball.y = top - r
        paddle.heat = 1
    }

    if (ball.y - r > game.height) {
        endGame(game)
        return
    }

    collideBricks(game, field, time)
}

function pushTrail(ball: Ball) {
    const point = ball.trail[ball.head]!
    point.x = ball.x
    point.y = ball.y
    ball.head = (ball.head + 1) % ball.trail.length
}

function stepLoose(game: Game, dt: number) {
    for (let i = 0; i < game.looseCount; i++) {
        const dot = game.loose[i]!
        dot.vy += gravity * dt
        dot.x += dot.vx * dt
        dot.y += dot.vy * dt
        dot.life -= dt / looseLife
        if (dot.life <= 0 || dot.y > game.height + 8) {
            const last = --game.looseCount
            game.loose[i] = game.loose[last]!
            game.loose[last] = dot
            i--
        }
    }
}

export function stepGame(game: Game, field: Field, frame: GameInput) {
    const { time, dt } = frame
    stepPaddle(game, frame)

    if (game.playing) {
        const steps = Math.max(1, Math.ceil((game.speed * dt) / stepLength))
        for (let i = 0; i < steps && game.playing; i++) {
            stepBall(game, field, time, dt / steps)
        }
        pushTrail(game.ball)
    }

    stepLoose(game, dt)
}

function drawLoose(ctx: CanvasRenderingContext2D, game: Game) {
    for (let shade = 0; shade < looseShades; shade++) {
        ctx.fillStyle = game.looseColors[shade]!
        ctx.globalAlpha = 1 - shade / looseShades
        ctx.beginPath()
        for (let i = 0; i < game.looseCount; i++) {
            const dot = game.loose[i]!
            const level = Math.round((1 - dot.life) * (looseShades - 1))
            if (level !== shade) continue
            ctx.moveTo(dot.x + 1.5, dot.y)
            ctx.arc(dot.x, dot.y, 1.5, 0, Math.PI * 2)
        }
        ctx.fill()
    }
    ctx.globalAlpha = 1
}

function drawPaddle(ctx: CanvasRenderingContext2D, game: Game, colors: Colors) {
    const { paddle } = game
    if (paddle.presence < 0.01) return
    const half = paddle.width / 2
    const top = paddle.y - paddleHeight / 2

    ctx.globalAlpha = paddle.presence
    ctx.fillStyle = rgba(colors.text, 0.08)
    ctx.fillRect(paddle.x - half + 1, top - 1, paddle.width - 2, 1)
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
    ctx.fillRect(paddle.x - half + 1, top + paddleHeight, paddle.width - 2, 1)

    ctx.fillStyle = rgba(mix(colors.muted, colors.text, paddle.heat))
    ctx.beginPath()
    ctx.roundRect(paddle.x - half, top, paddle.width, paddleHeight, 2)
    ctx.fill()
    ctx.globalAlpha = 1
}

function drawBall(ctx: CanvasRenderingContext2D, game: Game, colors: Colors) {
    const { ball } = game
    const r = ball.radius
    const count = ball.trail.length

    for (let k = 0; k < count; k++) {
        const point = ball.trail[(ball.head + k) % count]!
        const t = (k + 1) / count
        ctx.fillStyle = rgba(colors.ember, t * 0.45)
        ctx.beginPath()
        ctx.arc(point.x, point.y, r * (0.25 + 0.65 * t), 0, Math.PI * 2)
        ctx.fill()
    }

    const halo = ctx.createRadialGradient(
        ball.x,
        ball.y,
        0,
        ball.x,
        ball.y,
        r * 6
    )
    halo.addColorStop(0, rgba(colors.ember, 0.35))
    halo.addColorStop(1, rgba(colors.ember, 0))
    ctx.fillStyle = halo
    ctx.beginPath()
    ctx.arc(ball.x, ball.y, r * 6, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = rgba(colors.ember)
    ctx.beginPath()
    ctx.arc(ball.x, ball.y, r, 0, Math.PI * 2)
    ctx.fill()
}

export function drawGame(
    ctx: CanvasRenderingContext2D,
    game: Game,
    colors: Colors
) {
    ctx.globalCompositeOperation = "source-over"
    drawLoose(ctx, game)
    drawPaddle(ctx, game, colors)
    if (game.playing) drawBall(ctx, game, colors)
}
