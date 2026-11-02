import Section from "~/components/layout/section"
import SectionHeader from "~/components/layout/section-header"
import StackedHeading from "~/components/layout/stacked-heading"
import WorkGrid from "~/components/work/work-grid"
import { listWork } from "~/lib/content"
import { pageMetadata } from "~/lib/seo"

export const metadata = pageMetadata({
    title: "Work",
    description:
        "my master log of work I've done over the years, mostly websites and broadcasts for Minecraft events.",
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
                my master log of work that I’ve done over the years. I try to
                document all the work I have completed, but a lot of it is lost
                to time.
            </p>
            <WorkGrid items={work} className="mt-12" />
        </Section>
    )
}
