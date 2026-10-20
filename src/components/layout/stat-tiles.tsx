import { PanelGrid } from "~/components/layout/panel-grid"
import { cn } from "~/lib/utils"

export type Stat = {
    value: string | number
    label: string
    accent?: boolean
}

export default function StatTiles({
    stats,
    className,
}: {
    stats: Stat[]
    className?: string
}) {
    return (
        <PanelGrid columns={4} className={className}>
            {stats.map((stat) => (
                <div key={stat.label} className="bg-ink p-5 sm:p-6">
                    <p
                        className={cn(
                            "font-mono text-4xl leading-none text-text tabular-nums sm:text-5xl",
                            stat.accent && "text-ember"
                        )}
                    >
                        {stat.value}
                    </p>
                    <p className="mt-3 label">{stat.label}</p>
                </div>
            ))}
        </PanelGrid>
    )
}
