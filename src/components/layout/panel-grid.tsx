import { type ReactNode } from "react"
import { cn } from "~/lib/utils"

const columnClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 lg:grid-cols-4",
}

export function PanelGrid({
    columns = 3,
    children,
    className,
}: {
    columns?: keyof typeof columnClasses
    children: ReactNode
    className?: string
}) {
    return (
        <div
            className={cn(
                "grid gap-px border border-line bg-line",
                columnClasses[columns],
                className
            )}
        >
            {children}
        </div>
    )
}

export function Panel({
    children,
    className,
    raised = false,
}: {
    children: ReactNode
    className?: string
    raised?: boolean
}) {
    return (
        <div
            className={cn(
                "p-6",
                raised ? "bg-surface-1 embossed" : "bg-ink",
                className
            )}
        >
            {children}
        </div>
    )
}
