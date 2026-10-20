import { Suspense } from "react"
import { pageMetadata } from "~/lib/seo"
import GuestbookForm from "~/components/guestbook/guestbook-form"
import GuestbookWall from "~/components/guestbook/guestbook-wall"
import Section from "~/components/layout/section"
import SectionHeader from "~/components/layout/section-header"
import StackedHeading from "~/components/layout/stacked-heading"
import { api } from "~/trpc/server"

export const metadata = pageMetadata({
    title: "Guestbook",
    description:
        "Leave a note on chezzer.dev. Pick a background and a colour, and it goes on the wall.",
    path: "/guestbook",
})

export default function GuestbookPage() {
    return (
        <Section className="mt-6">
            <SectionHeader label="guestbook" />
            <StackedHeading as="h1" className="mt-8" lines={["say", "hi"]} />
            <p className="mt-6 max-w-[58ch] text-lg leading-8 text-text-muted">
                Leave a note. Pick a background and a colour, and it goes on the
                wall.
            </p>
            <div className="mt-10 max-w-xl">
                <GuestbookForm />
            </div>
            <div className="mt-16">
                <Suspense fallback={<WallSkeleton />}>
                    <Wall />
                </Suspense>
            </div>
        </Section>
    )
}

async function Wall() {
    const initial = await api.guestbook.list({ limit: 24 })
    return <GuestbookWall initial={initial} />
}

function WallSkeleton() {
    return (
        <div aria-hidden className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {Array.from({ length: 6 }, (_, index) => (
                <div
                    key={index}
                    className="mb-4 h-40 break-inside-avoid bg-surface-1 opacity-60"
                />
            ))}
        </div>
    )
}
