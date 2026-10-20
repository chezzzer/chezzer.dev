const corners = [
    { across: "-top-px -left-[5px]", down: "-top-[6px] left-0" },
    { across: "-top-px -right-[5px]", down: "-top-[6px] right-0" },
    { across: "-bottom-px -left-[5px]", down: "-bottom-[6px] left-0" },
    { across: "-bottom-px -right-[5px]", down: "-bottom-[6px] right-0" },
]

export default function CornerMarks() {
    return (
        <>
            {corners.map((corner) => (
                <span key={corner.across} aria-hidden>
                    <span
                        className={`absolute h-px w-[11px] bg-text-faint ${corner.across}`}
                    />
                    <span
                        className={`absolute h-[11px] w-px bg-text-faint ${corner.down}`}
                    />
                </span>
            ))}
        </>
    )
}
