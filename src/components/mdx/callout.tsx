import { type ReactNode } from "react"

export default function Callout({
    title,
    children,
}: {
    title?: string
    children: ReactNode
}) {
    return (
        <aside className="not-prose my-8 border-l-2 border-ember bg-surface-1 px-5 py-4 text-[15px] leading-7 text-text-muted">
            {title && <p className="mb-1 label text-text">{title}</p>}
            {children}
        </aside>
    )
}
