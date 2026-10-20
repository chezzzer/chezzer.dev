import Section from "~/components/layout/section"
import { pageMetadata } from "~/lib/seo"
import SectionHeader from "~/components/layout/section-header"
import StackedHeading from "~/components/layout/stacked-heading"
import WorkGrid from "~/components/work/work-grid"
import { listWork } from "~/lib/content"

export const metadata = pageMetadata({
    title: "Work",
    description:
        "Features and projects Ryan Cherry has shipped, written up with images.",
    path: "/work",
})

export default async function WorkPage() {
    const work = await listWork()

    return (
        <Section className="mt-6">
            <SectionHeader label="work" meta={`${work.length} pieces`} />
            <StackedHeading
                as="h1"
                className="mt-8"
                lines={["things", "i’ve made"]}
            />
            <p className="mt-6 max-w-[58ch] text-lg leading-8 text-text-muted">
                Features and projects, written up. Some are public, most are
                not, so the write-ups do the showing.
            </p>
            <WorkGrid items={work} className="mt-12" />
        </Section>
    )
}
