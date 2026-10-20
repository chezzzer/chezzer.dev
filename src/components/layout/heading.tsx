import { type ElementType } from "react"
import { cn } from "~/lib/utils"

export default function Heading({
    children,
    as: Tag = "h2",
    className,
}: {
    children: React.ReactNode
    as?: ElementType
    className?: string
}) {
    return (
        <Tag
            className={cn(
                "text-4xl leading-[1.05] font-medium sm:text-5xl lg:text-6xl",
                className
            )}
        >
            {children}
        </Tag>
    )
}
