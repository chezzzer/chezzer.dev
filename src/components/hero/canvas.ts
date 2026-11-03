export function createCanvas(width: number, height: number) {
    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    return canvas
}

export function contextOf(canvas: HTMLCanvasElement) {
    return canvas.getContext("2d")!
}

export function cloneCanvas(source: HTMLCanvasElement) {
    const canvas = createCanvas(source.width, source.height)
    contextOf(canvas).drawImage(source, 0, 0)
    return canvas
}
