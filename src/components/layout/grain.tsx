const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>'

const noise = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`

export default function Grain() {
    return (
        <div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-50 opacity-[0.06] motion-reduce:hidden"
            style={{ backgroundImage: noise }}
        />
    )
}
