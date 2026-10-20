import { type ReactNode } from "react"

export function Steps({ children }: { children: ReactNode }) {
    return (
        <ol className="not-prose my-10 grid gap-px border border-line bg-line">
            {children}
        </ol>
    )
}

export function Step({
    n,
    title,
    children,
}: {
    n: string
    title: string
    children: ReactNode
}) {
    return (
        <li className="grid gap-4 bg-ink p-6 sm:grid-cols-[6rem_1fr]">
            <p className="label text-text">
                {n} <span className="text-ember">{"▶"}</span>
            </p>
            <div>
                <p className="font-mono text-lg text-text">{title}</p>
                <div className="mt-2 text-[15px] leading-7 text-text-muted">
                    {children}
                </div>
            </div>
        </li>
    )
}
