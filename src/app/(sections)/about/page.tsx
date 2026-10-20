import Timeline from "~/components/about/timeline"
import JsonLd from "~/components/layout/json-ld"
import { pageMetadata, personJsonLd } from "~/lib/seo"
import DotBand from "~/components/layout/dot-band"
import { Panel, PanelGrid } from "~/components/layout/panel-grid"
import Section from "~/components/layout/section"
import SectionHeader from "~/components/layout/section-header"
import StackedHeading from "~/components/layout/stacked-heading"
import StatTiles from "~/components/layout/stat-tiles"
import StatusStrip from "~/components/status/status-strip"
import { site, socials } from "~/lib/site"
import { siteStats } from "~/lib/stats"

export const metadata = pageMetadata({
    title: "About",
    description:
        "A bit about Ryan Cherry (chezzer): the website builder at Rocketspark, websites and stream tools for Minecraft events, and a bit of music.",
    path: "/about",
})

export default async function AboutPage() {
    const stats = await siteStats()

    return (
        <>
            <JsonLd data={personJsonLd()} />
            <Section className="mt-6">
                <SectionHeader label="about" meta="hamilton, nz" />
                <StackedHeading
                    as="h1"
                    className="mt-8"
                    lines={["about", "me"]}
                />
                <div className="mt-6 max-w-[58ch] text-lg leading-8 text-text-muted">
                    <p>
                        I’m Chezzer, aka Ryan. I work on the website builder at
                        Rocketspark, which I’ve been doing since 2020, and I’m
                        doing a computer science degree at Waikato alongside it.
                    </p>
                    <p className="mt-4">
                        Outside of work it’s mostly Minecraft events. I do the
                        stream side of Midoffs and PVP Champs for Tubbo’s
                        studio, Timbers, and I worked on The Last Stand with
                        them. I also did the website and broadcast for Gridlock.
                        And I’m director of Bundle Group, the studio behind The
                        Atlas, CoasterCon, C&amp;C LIVE and a bunch of other
                        things.
                    </p>
                    <p className="mt-4">
                        I’ve been making websites since 2019, when I started
                        building them for an online radio station, and I never
                        really stopped. I’m based in Hamilton, New Zealand. Most
                        of the time I’ve got drum and bass or jungle on, and
                        every now and then I record a mix of my own.
                    </p>
                </div>
                <div className="mt-8">
                    <StatusStrip />
                </div>
                <StatTiles stats={stats} className="mt-12" />
            </Section>
            <DotBand />
            <Section>
                <SectionHeader
                    label="positions"
                    meta={`since ${site.careerStartLabel}`}
                />
                <div className="mt-10">
                    <Timeline />
                </div>
            </Section>
            <DotBand />
            <Section>
                <SectionHeader label="elsewhere" />
                <PanelGrid columns={3} className="mt-10">
                    {socials.map((social) => (
                        <a
                            key={social.href}
                            href={social.href}
                            target="_blank"
                            rel="me noreferrer"
                            className="group bg-ink p-5 transition-colors hover:bg-surface-1"
                        >
                            <p className="font-mono text-text group-hover:text-ember">
                                {social.label}
                            </p>
                            <p className="mt-1 truncate label text-text-faint">
                                {social.href.replace(
                                    /^(https:\/\/|mailto:)/,
                                    ""
                                )}
                            </p>
                        </a>
                    ))}
                    <Panel>
                        <p className="font-mono text-text">say hi</p>
                        <p className="mt-1 label text-text-faint">
                            the guestbook is coming
                        </p>
                    </Panel>
                </PanelGrid>
            </Section>
        </>
    )
}
