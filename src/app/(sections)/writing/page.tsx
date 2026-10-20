import Section from "~/components/layout/section"
import { pageMetadata } from "~/lib/seo"
import SectionHeader from "~/components/layout/section-header"
import StackedHeading from "~/components/layout/stacked-heading"
import ArticleList from "~/components/writing/article-list"
import { listWriting } from "~/lib/content"

export const metadata = {
    ...pageMetadata({
        title: "Writing",
        description: "Notes from Ryan Cherry on building things.",
        path: "/writing",
    }),
    alternates: {
        canonical: "/writing",
        types: { "application/rss+xml": "/writing/feed.xml" },
    },
}

export default async function WritingPage() {
    const articles = await listWriting()

    return (
        <Section className="mt-6">
            <SectionHeader
                label="writing"
                meta={
                    <a href="/writing/feed.xml" className="hover:text-text">
                        rss
                    </a>
                }
            />
            <StackedHeading
                as="h1"
                className="mt-8"
                lines={["notes", "and such"]}
            />
            <p className="mt-6 max-w-[58ch] text-lg leading-8 text-text-muted">
                Longer things I wanted to write down. Not on a schedule.
            </p>
            <div className="mt-12">
                <ArticleList articles={articles} />
            </div>
        </Section>
    )
}
