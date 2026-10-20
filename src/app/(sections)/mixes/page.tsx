import { PanelGrid } from "~/components/layout/panel-grid"
import { pageMetadata } from "~/lib/seo"
import Section from "~/components/layout/section"
import SectionHeader from "~/components/layout/section-header"
import StackedHeading from "~/components/layout/stacked-heading"
import MixCard from "~/components/mixes/mix-card"
import { listMixes } from "~/lib/content"

export const metadata = pageMetadata({
    title: "Mixes",
    description: "DJ mixes recorded by chezzer.",
    path: "/mixes",
})

export default async function MixesPage() {
    const mixes = await listMixes()

    return (
        <Section className="mt-6">
            <SectionHeader label="mixes" meta={`${mixes.length} recorded`} />
            <StackedHeading
                as="h1"
                className="mt-8"
                lines={["mixes", "for whenever"]}
            />
            <p className="mt-6 max-w-[58ch] text-lg leading-8 text-text-muted">
                Sets I record for myself. Shared here in case they suit your
                night too.
            </p>
            <PanelGrid columns={2} className="mt-12">
                {mixes.map((mix) => (
                    <MixCard key={mix.slug} mix={mix} />
                ))}
            </PanelGrid>
        </Section>
    )
}
