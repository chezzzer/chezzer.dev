import { type ReactNode } from "react"

export default function SectionHeader({
    label,
    meta,
}: {
    label: string
    meta?: ReactNode
}) {
    return (
        <div className="flex items-center gap-4 label">
            <span className="shrink-0">
                <span className="text-text-faint">{"///"}</span> {label}
            </span>
            <span aria-hidden className="h-px flex-1 bg-line" />
            {meta && <span className="shrink-0">{meta}</span>}
        </div>
    )
}
