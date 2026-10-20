"use client"

import {
    usePresence,
    type Availability,
} from "~/components/status/lanyard-provider"
import { cn } from "~/lib/utils"

const dotClasses: Record<Availability, string> = {
    online: "bg-moss shadow-[0_0_8px] shadow-moss/60",
    away: "bg-text-muted",
    busy: "bg-ember shadow-[0_0_8px] shadow-ember/50",
    offline: "bg-text-faint",
}

export default function StatusDot({ className }: { className?: string }) {
    const { availability } = usePresence()

    return (
        <span
            role="img"
            aria-label={availability}
            className={cn(
                "inline-block h-2 w-2 shrink-0 rounded-full transition-colors",
                dotClasses[availability],
                className
            )}
        />
    )
}
