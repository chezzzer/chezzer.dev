import { type ElementType } from "react"
import { cn } from "~/lib/utils"

export default function StackedHeading({
    lines,
    as: Tag = "h2",
    className,
}: {
    lines: [string, string]
    as?: ElementType
    className?: string
}) {
    const [first, second] = lines

    return (
        <Tag
            className={cn(
                "text-4xl leading-[1.05] font-medium sm:text-5xl lg:text-6xl",
                className
            )}
        >
            <span className="block">{first}</span>
            <span className="block text-ember">{second}</span>
        </Tag>
    )
}
