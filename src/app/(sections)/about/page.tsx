import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr"
import Link from "next/link"
import Timeline from "~/components/about/timeline"
import DotBand from "~/components/layout/dot-band"
import JsonLd from "~/components/layout/json-ld"
import { PanelGrid } from "~/components/layout/panel-grid"
import Section from "~/components/layout/section"
import SectionHeader from "~/components/layout/section-header"
import StackedHeading from "~/components/layout/stacked-heading"
import StatTiles from "~/components/layout/stat-tiles"
import StatusStrip from "~/components/status/status-strip"
import { pageMetadata, personJsonLd } from "~/lib/seo"
import { site, socials } from "~/lib/site"
import { siteStats } from "~/lib/stats"

export const metadata = pageMetadata({
    title: "About",
    description:
        "a bit about me, Ryan Cherry (chezzer). web and broadcast developer living in Waikato, New Zealand.",
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
                <div className="prose-chezzer prose mt-6 max-w-[58ch] text-lg leading-8 text-text-muted">
                    <p>
                        hey, I’m Chezzer (or Ryan, depending who you are). I am
                        a web and broadcast developer living in Waikato, New
                        Zealand. I currently work at Rocketspark, building a
                        website builder. I also do side projects inside the game
                        Minecraft for the likes of Mojang, Tubbo, MoneySMP,
                        Gridlock and Bundle Group, just to name a few.
                    </p>
                    <p>
                        I’ve been in the craft for over 6 years, developing
                        systems, websites, minecraft servers, passion projects
                        and broadcasts. It all started with PHP and a volunteer
                        job working at an online radio station, from there I
                        found a few connections and started building out my
                        portfolio and learning more about what it means to
                        program.
                    </p>
                    <p>
                        Growing up in New Zealand, it’s given me a -let’s say-
                        unique perspective on life. I take frequent trips to the
                        USA and UK and am always baffled about how different we
                        are. I am originally from the UK, but moved here when I
                        was 2, so for the most part I am a kiwi, but I feel
                        having family all over the world makes me some sort of
                        global traveler.
                    </p>
                    <p>
                        Also, never move to New Zealand, the timezone is awful.
                    </p>
                    <Link href="/writing" className="flex items-center gap-1">
                        read more about me <ArrowUpRightIcon weight="bold" />
                    </Link>
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
                    <Link
                        href="/guestbook"
                        className="group bg-ink p-5 transition-colors hover:bg-surface-1"
                    >
                        <p className="font-mono text-text group-hover:text-ember">
                            say hi
                        </p>
                        <p className="mt-1 truncate label text-text-faint">
                            leave a note in the guestbook
                        </p>
                    </Link>
                </PanelGrid>
            </Section>
        </>
    )
}
