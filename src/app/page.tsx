import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr"
import Link from "next/link"
import Hero from "~/components/hero/hero"
import DotBand from "~/components/layout/dot-band"
import Heading from "~/components/layout/heading"
import JsonLd from "~/components/layout/json-ld"
import { PanelGrid } from "~/components/layout/panel-grid"
import Section from "~/components/layout/section"
import SectionHeader from "~/components/layout/section-header"
import MixCard from "~/components/mixes/mix-card"
import StatusStrip from "~/components/status/status-strip"
import WorkGrid from "~/components/work/work-grid"
import ArticleCard from "~/components/writing/article-card"
import { listMixes, listWork, listWriting } from "~/lib/content"
import { pageMetadata, personJsonLd } from "~/lib/seo"
import { site } from "~/lib/site"

function MoreLink({ href, children }: { href: string; children: string }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-1 label hover:text-text"
        >
            {children}
            <ArrowUpRightIcon weight="bold" />
        </Link>
    )
}

export const metadata = pageMetadata({
    description: site.description,
    path: "/",
})

export default async function HomePage() {
    const [work, writing, mixes] = await Promise.all([
        listWork(),
        listWriting(),
        listMixes(),
    ])
    const featured = work.filter((item) => item.featured).slice(0, 3)
    const latestWriting = writing.filter((item) => !item.draft).slice(0, 3)
    const latestMix = mixes[0]

    return (
        <>
            <JsonLd data={personJsonLd()} />
            <h1 className="sr-only">
                {site.name}, {site.fullName}
            </h1>
            <div className="site-container">
                <Hero />
            </div>
            <Section>
                <SectionHeader label="hello" meta="hamilton, new zealand" />
                <Heading className="mt-8">
                    hey, i&apos;m <span className="text-ember">chezzer</span>
                </Heading>
                <div className="prose-chezzer prose mt-6 max-w-[58ch] text-lg leading-8 text-text-muted">
                    <p>
                        I&apos;m Ryan. I work on the website builder at{" "}
                        <a href="https://www.rocketspark.com" target="_blank">
                            Rocketspark
                        </a>
                        , and outside of that I mostly build websites and
                        broadcast tools for Minecraft events like Midoffs, The
                        Last Stand and Gridlock. I&apos;m also doing a computer
                        science degree at{" "}
                        <a href="https://waikato.ac.nz" target="_blank">
                            Waikato
                        </a>
                        . Say hi in the <Link href="/guestbook">guestbook</Link>{" "}
                        if you want, or{" "}
                        <Link href="/about">learn more about me</Link>.
                    </p>
                </div>

                <div className="mt-8">
                    <StatusStrip />
                </div>
            </Section>
            <DotBand />
            <Section>
                <SectionHeader
                    label="work"
                    meta={<MoreLink href="/work">all work</MoreLink>}
                />
                <WorkGrid items={featured} className="mt-8" />
            </Section>
            <DotBand />
            <Section>
                <SectionHeader
                    label="writing"
                    meta={<MoreLink href="/writing">all writing</MoreLink>}
                />
                <div className="mt-8 border-b border-line">
                    {latestWriting.map((article) => (
                        <ArticleCard key={article.slug} article={article} />
                    ))}
                </div>
            </Section>
            {latestMix && (
                <>
                    <DotBand />
                    <Section>
                        <SectionHeader
                            label="mixes"
                            meta={<MoreLink href="/mixes">all mixes</MoreLink>}
                        />
                        <PanelGrid columns={2} className="mt-8">
                            <MixCard mix={latestMix} />
                        </PanelGrid>
                    </Section>
                </>
            )}
        </>
    )
}
