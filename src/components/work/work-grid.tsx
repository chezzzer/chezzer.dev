import { PanelGrid } from "~/components/layout/panel-grid"
import WorkCard from "~/components/work/work-card"
import type { Work } from "~/lib/content"

export default function WorkGrid({
    items,
    className,
}: {
    items: Work[]
    className?: string
}) {
    return (
        <PanelGrid columns={3} className={className}>
            {items.map((work) => (
                <WorkCard key={work.slug} work={work} />
            ))}
        </PanelGrid>
    )
}
