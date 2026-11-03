import { stepBall } from "~/components/hero/ball"
import { mix, rgba, type Colors } from "~/components/hero/colors"
import { type Field, type Pointer } from "~/components/hero/field"
import { solidAt, type Word } from "~/components/hero/word"

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
    height: number
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
    baseSpeed: number
    speed: number
    bricks: Uint8Array
    bricksTotal: number
    bricksAlive: number
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
    word: Word
    colors: Colors
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
const revealTime = 0.8
const paddleHeight = 3
const paddleGap = 16
const minLaunch = Math.PI * 0.2
const stepLength = 3

function seedBricks(field: Field, word: Word) {
    const bricks = new Uint8Array(field.points.length)
    field.points.forEach((point, i) => {
        const px = Math.round(point.x * word.dpr)
        const py = Math.round(point.y * word.dpr)
        bricks[i] = solidAt(word, px, py) ? 1 : 0
    })
    return bricks
}

function restingY(paddle: Paddle, radius: number) {
    return paddle.y - paddle.height / 2 - radius - 1
}

function resetTrail(ball: Ball) {
    for (const point of ball.trail) {
        point.x = ball.x
        point.y = ball.y
    }
}

export function createGame(options: GameOptions): Game {
    const { field, word, colors, small } = options
    const radius = small ? 4 : 4.5
    const paddle: Paddle = {
        x: word.centerX,
        y: word.height - paddleGap,
        width: small ? 72 : 96,
        height: paddleHeight,
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

    const bricks = seedBricks(field, word)
    const bricksTotal = bricks.reduce((sum, brick) => sum + brick, 0)
    const baseSpeed = small ? 260 : 320

    return {
        width: word.width,
        height: word.height,
        baseSpeed,
        speed: baseSpeed,
        bricks,
        bricksTotal,
        bricksAlive: bricksTotal,
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

    const aim = y < ball.y ? Math.atan2(y - ball.y, x - ball.x) : -Math.PI / 2
    const angle = Math.min(-minLaunch, Math.max(-Math.PI + minLaunch, aim))
    game.speed = game.baseSpeed
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

export function gameVisible(game: Game) {
    return game.playing || game.looseCount > 0 || game.paddle.presence >= 0.01
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

export function stepGame(
    game: Game,
    field: Field,
    word: Word,
    frame: GameInput
) {
    const { time, dt } = frame
    stepPaddle(game, frame)

    if (game.playing) {
        const steps = Math.max(1, Math.ceil((game.speed * dt) / stepLength))
        for (let i = 0; i < steps && game.playing; i++) {
            stepBall(game, field, word, time, dt / steps)
        }
        pushTrail(game.ball)
    }

    stepLoose(game, dt)
}
