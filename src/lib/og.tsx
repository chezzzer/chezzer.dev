import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import path from "node:path"
import { site } from "~/lib/site"

export const ogSize = { width: 1200, height: 630 }

export const ogContentType = "image/png"

const colors = {
    ink: "#0e0d0b",
    line: "#27241f",
    text: "#ede8de",
    muted: "#9a9387",
    ember: "#ff6a1f",
}

const step = 48

function discoFont() {
    return readFile(
        path.join(process.cwd(), "src", "fonts", "DigitalDisco.ttf")
    )
}

export async function ogImage({
    label,
    title,
}: {
    label: string
    title: string
}) {
    const font = await discoFont()
    const columns = Array.from(
        { length: Math.ceil(ogSize.width / step) },
        (_, i) => i
    )
    const rows = Array.from(
        { length: Math.ceil(ogSize.height / step) },
        (_, i) => i
    )
    const titleSize = title.length > 40 ? 56 : title.length > 24 ? 72 : 92

    return new ImageResponse(
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: 64,
                background: colors.ink,
                color: colors.text,
                fontFamily: "Disco",
                position: "relative",
            }}
        >
            {columns.map((column) => (
                <div
                    key={`c${column}`}
                    style={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: column * step,
                        width: 1,
                        background: colors.line,
                    }}
                />
            ))}
            {rows.map((row) => (
                <div
                    key={`r${row}`}
                    style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: row * step,
                        height: 1,
                        background: colors.line,
                    }}
                />
            ))}
            <div style={{ display: "flex", fontSize: 26, color: colors.muted }}>
                {label}
            </div>
            <div
                style={{
                    display: "flex",
                    fontSize: titleSize,
                    lineHeight: 1.1,
                    maxWidth: 1000,
                }}
            >
                {title}
            </div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: 26,
                }}
            >
                <div style={{ display: "flex", color: colors.text }}>
                    {site.name}
                </div>
                <div style={{ display: "flex", color: colors.muted }}>
                    {site.url.replace("https://", "")}
                </div>
            </div>
            <div
                style={{
                    position: "absolute",
                    left: 64,
                    right: 64,
                    bottom: 52,
                    height: 2,
                    background: colors.ember,
                }}
            />
        </div>,
        {
            ...ogSize,
            fonts: [
                { name: "Disco", data: font, weight: 400, style: "normal" },
            ],
        }
    )
}
