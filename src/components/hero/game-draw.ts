import { mix, rgba, type Colors } from "~/components/hero/colors"
import { type Game } from "~/components/hero/game"

function drawLoose(ctx: CanvasRenderingContext2D, game: Game) {
    const shades = game.looseColors.length
    for (let shade = 0; shade < shades; shade++) {
        ctx.fillStyle = game.looseColors[shade]!
        ctx.globalAlpha = 1 - shade / shades
        ctx.beginPath()
        for (let i = 0; i < game.looseCount; i++) {
            const dot = game.loose[i]!
            const level = Math.round((1 - dot.life) * (shades - 1))
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
    const top = paddle.y - paddle.height / 2

    ctx.globalAlpha = paddle.presence
    ctx.fillStyle = rgba(colors.text, 0.08)
    ctx.fillRect(paddle.x - half + 1, top - 1, paddle.width - 2, 1)
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
    ctx.fillRect(paddle.x - half + 1, top + paddle.height, paddle.width - 2, 1)

    ctx.fillStyle = rgba(mix(colors.muted, colors.text, paddle.heat))
    ctx.beginPath()
    ctx.roundRect(paddle.x - half, top, paddle.width, paddle.height, 2)
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
