import { type ReactNode } from "react"
import CornerMarks from "~/components/layout/corner-marks"
import { cn } from "~/lib/utils"

export default function Section({
    children,
    className,
}: {
    children: ReactNode
    className?: string
}) {
    return (
        <section className="site-container">
            <div
                className={cn(
                    "relative border-y border-line py-12 sm:py-16",
                    className
                )}
            >
                <CornerMarks />
                {children}
            </div>
        </section>
    )
}
