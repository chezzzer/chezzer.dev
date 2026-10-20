import type { Metadata } from "next"
import Link from "next/link"
import Section from "~/components/layout/section"
import SectionHeader from "~/components/layout/section-header"
import StackedHeading from "~/components/layout/stacked-heading"

export const metadata: Metadata = {
    title: "Not found",
    robots: { index: false },
}

export default function NotFound() {
    return (
        <Section className="mt-6">
            <SectionHeader label="404" />
            <StackedHeading
                as="h1"
                className="mt-8"
                lines={["nothing", "here"]}
            />
            <p className="mt-6 max-w-[58ch] text-lg leading-8 text-text-muted">
                That page does not exist, or it moved. The home page is a safe
                bet.
            </p>
            <p className="mt-8">
                <Link
                    href="/"
                    className="inline-block rounded-full bg-surface-1 px-5 py-2 font-mono text-sm text-text embossed hover:bg-surface-2"
                >
                    back home
                </Link>
            </p>
        </Section>
    )
}
