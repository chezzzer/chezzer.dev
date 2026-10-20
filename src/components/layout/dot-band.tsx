const fade =
    "linear-gradient(90deg, transparent, black 20%, black 80%, transparent)"

export default function DotBand() {
    return (
        <div aria-hidden className="site-container">
            <div
                className="h-10 dot-field opacity-60"
                style={{ maskImage: fade }}
            />
        </div>
    )
}
