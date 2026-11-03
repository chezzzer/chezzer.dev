import { type Pointer } from "~/components/hero/field"

export type CompositeInput = {
    face: HTMLCanvasElement
    back: HTMLCanvasElement
    front: HTMLCanvasElement | null
    pointer: Pointer
    radius: number
    strength: number
    dpr: number
}

export type Compositor = {
    resize: () => void
    draw: (input: CompositeInput) => void
}

const vertexSource = `#version 300 es
in vec2 position;
out vec2 uv;
void main() {
    uv = vec2(position.x, -position.y) * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
}`

const fragmentSource = `#version 300 es
precision highp float;
uniform sampler2D face;
uniform sampler2D back;
uniform sampler2D front;
uniform vec2 size;
uniform vec2 pointer;
uniform float radius;
uniform float strength;
in vec2 uv;
out vec4 color;
void main() {
    vec2 pixel = uv * size;
    vec2 offset = pixel - pointer;
    float edge = max(0.0, 1.0 - length(offset) / radius);
    vec2 source = pointer + offset / (1.0 + strength * edge * edge);
    vec4 word = texture(face, source / size);
    vec4 ground = texture(back, uv);
    vec4 top = texture(front, uv);
    vec3 rgb = word.rgb * word.a + ground.rgb * ground.a * (1.0 - word.a);
    float alpha = word.a + ground.a * (1.0 - word.a);
    color = vec4(top.rgb * top.a + rgb * (1.0 - top.a), top.a + alpha * (1.0 - top.a));
}`

const blankPixel = new Uint8Array(4)

export function createCompositor(canvas: HTMLCanvasElement): Compositor {
    const gl = canvas.getContext("webgl2", {
        antialias: false,
        premultipliedAlpha: true,
    })
    return gl ? createLens(gl) : createFlat(canvas)
}

function createFlat(canvas: HTMLCanvasElement): Compositor {
    const ctx = canvas.getContext("2d")!
    return {
        resize: () => ctx.setTransform(1, 0, 0, 1, 0, 0),
        draw: ({ face, back, front }) => {
            ctx.globalCompositeOperation = "source-over"
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(back, 0, 0)
            ctx.drawImage(face, 0, 0)
            if (front) ctx.drawImage(front, 0, 0)
        },
    }
}

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
    const shader = gl.createShader(type)!
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    return shader
}

function createTexture(gl: WebGL2RenderingContext, unit: number) {
    const texture = gl.createTexture()
    gl.activeTexture(gl.TEXTURE0 + unit)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    return texture
}

function createLens(gl: WebGL2RenderingContext): Compositor {
    const program = gl.createProgram()
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, vertexSource))
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, fragmentSource))
    gl.linkProgram(program)
    gl.useProgram(program)

    const quad = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, quad)
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        gl.STATIC_DRAW
    )
    const position = gl.getAttribLocation(program, "position")
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    gl.uniform1i(gl.getUniformLocation(program, "face"), 0)
    gl.uniform1i(gl.getUniformLocation(program, "back"), 1)
    gl.uniform1i(gl.getUniformLocation(program, "front"), 2)
    const size = gl.getUniformLocation(program, "size")
    const pointer = gl.getUniformLocation(program, "pointer")
    const radius = gl.getUniformLocation(program, "radius")
    const strength = gl.getUniformLocation(program, "strength")

    const faceTexture = createTexture(gl, 0)
    const backTexture = createTexture(gl, 1)
    const frontTexture = createTexture(gl, 2)
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)
    let frontBlank = false

    const upload = (
        unit: number,
        texture: WebGLTexture,
        source: HTMLCanvasElement
    ) => {
        gl.activeTexture(gl.TEXTURE0 + unit)
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            source
        )
    }

    const uploadFront = (source: HTMLCanvasElement | null) => {
        if (source) {
            upload(2, frontTexture, source)
            frontBlank = false
            return
        }
        if (frontBlank) return
        gl.activeTexture(gl.TEXTURE2)
        gl.bindTexture(gl.TEXTURE_2D, frontTexture)
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            1,
            1,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            blankPixel
        )
        frontBlank = true
    }

    return {
        resize: () => {
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
        },
        draw: (input) => {
            upload(0, faceTexture, input.face)
            upload(1, backTexture, input.back)
            uploadFront(input.front)
            gl.uniform2f(size, gl.canvas.width, gl.canvas.height)
            gl.uniform2f(
                pointer,
                input.pointer.x * input.dpr,
                input.pointer.y * input.dpr
            )
            gl.uniform1f(radius, input.radius * input.dpr)
            gl.uniform1f(strength, input.strength)
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
        },
    }
}
