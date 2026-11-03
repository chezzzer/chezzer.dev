export type Rect = {
    x: number
    y: number
    width: number
    height: number
}

export type Bounds = {
    width: number
    height: number
}

export function fullRect(bounds: Bounds): Rect {
    return { x: 0, y: 0, width: bounds.width, height: bounds.height }
}

export function clampRect(rect: Rect, bounds: Bounds, margin = 0): Rect {
    const x = Math.max(0, rect.x - margin)
    const y = Math.max(0, rect.y - margin)
    const right = Math.min(bounds.width, rect.x + rect.width + margin)
    const bottom = Math.min(bounds.height, rect.y + rect.height + margin)
    return { x, y, width: right - x, height: bottom - y }
}

export function unionRect(a: Rect, b: Rect): Rect {
    const x = Math.min(a.x, b.x)
    const y = Math.min(a.y, b.y)
    return {
        x,
        y,
        width: Math.max(a.x + a.width, b.x + b.width) - x,
        height: Math.max(a.y + a.height, b.y + b.height) - y,
    }
}
