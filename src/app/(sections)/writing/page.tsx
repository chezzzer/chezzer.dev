import Section from "~/components/layout/section"
import SectionHeader from "~/components/layout/section-header"
import StackedHeading from "~/components/layout/stacked-heading"
import ArticleList from "~/components/writing/article-list"
import { listWriting } from "~/lib/content"
import { pageMetadata } from "~/lib/seo"

export const metadata = {
    ...pageMetadata({
        title: "Writing",
        description:
            "writeups on things I find interesting, and stories from my real life.",
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
                lines={["writeups", "and other things"]}
            />
            <p className="mt-6 max-w-[58ch] text-lg leading-8 text-text-muted">
                here I have a few articles and about things I find interesting,
                or things I want to share from my real life.
            </p>
            <div className="mt-12">
                <ArticleList articles={articles} />
            </div>
        </Section>
    )
}
