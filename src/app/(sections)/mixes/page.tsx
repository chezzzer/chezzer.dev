import { PanelGrid } from "~/components/layout/panel-grid"
import Section from "~/components/layout/section"
import SectionHeader from "~/components/layout/section-header"
import StackedHeading from "~/components/layout/stacked-heading"
import MixCard from "~/components/mixes/mix-card"
import { listMixes } from "~/lib/content"
import { pageMetadata } from "~/lib/seo"

export const metadata = pageMetadata({
    title: "Mixes",
    description:
        "drum & bass, jungle and breaks sets I've recorded over the years.",
    path: "/mixes",
})

export default async function MixesPage() {
    const mixes = await listMixes()
    const recorded = mixes.filter((mix) => !mix.comingSoon)

    return (
        <Section className="mt-6">
            <SectionHeader label="mixes" meta={`${recorded.length} recorded`} />
            <StackedHeading
                as="h1"
                className="mt-8"
                lines={["mixtapes", "for locking in"]}
            />
            <p className="mt-6 max-w-[58ch] text-lg leading-8 text-text-muted">
                i have always been interested in electronic dance music,
                particularly drum & bass, jungle and break music. i have a bunch
                of sets I’ve recorded over the years, and I publish them here.
                these are perfect for just fucking drownding out the noise and
                locking in. fair warning - some of them are intense and also
                full of mistakes
            </p>
            <PanelGrid columns={2} className="mt-12">
                {mixes.map((mix) => (
                    <MixCard key={mix.slug} mix={mix} />
                ))}
            </PanelGrid>
        </Section>
    )
}
