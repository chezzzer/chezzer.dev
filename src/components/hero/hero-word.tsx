import { type Ref } from "react"
import { site } from "~/lib/site"
import { cn } from "~/lib/utils"

export default function HeroWord({
    ref,
    className,
}: {
    ref?: Ref<HTMLParagraphElement>
    className?: string
}) {
    return (
        <p
            ref={ref}
            aria-hidden
            className={cn(
                "absolute inset-0 flex items-center justify-center font-hero text-[clamp(84px,26vw,340px)] leading-none font-normal tracking-[0.02em] text-surface-2 select-none text-shadow-deboss",
                className
            )}
        >
            {site.name}
        </p>
    )
}
