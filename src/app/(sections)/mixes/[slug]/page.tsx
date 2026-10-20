import type { Metadata } from "next"
import JsonLd from "~/components/layout/json-ld"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { embedUrlFor, platformNames } from "~/components/mixes/embed"
import MixPlayer from "~/components/mixes/mix-player"
import { getMix, listMixes } from "~/lib/content"
import { breadcrumbJsonLd, pageMetadata, mixJsonLd } from "~/lib/seo"
import { formatDate } from "~/lib/format"

export async function generateStaticParams() {
    const mixes = await listMixes()
    return mixes.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
    params,
}: PageProps<"/mixes/[slug]">): Promise<Metadata> {
    const { slug } = await params
    const item = await getMix(slug)
    if (!item) return { title: "Not found" }
    return pageMetadata({
        title: item.title,
        description: `A ${item.duration} mix. ${item.genres.join(", ")}.`,
        path: `/mixes/${slug}`,
        type: "website",
    })
}

export default function MixDetailPage({ params }: PageProps<"/mixes/[slug]">) {
    return (
        <article className="site-container mt-6">
            <Suspense fallback={<MixSkeleton />}>
                <MixDetail params={params} />
            </Suspense>
        </article>
    )
}

async function MixDetail({
    params,
}: Pick<PageProps<"/mixes/[slug]">, "params">) {
    const { slug } = await params
    const mix = await getMix(slug)
    if (!mix) notFound()

    const { default: Content } = await import(`~/content/mixes/${slug}.mdx`)

    return (
        <>
            <JsonLd
                data={[
                    mixJsonLd(mix),
                    breadcrumbJsonLd([
                        { name: "mixes", path: "/mixes" },
                        { name: mix.title, path: `/mixes/${slug}` },
                    ]),
                ]}
            />
            <header className="border-y border-line py-10 sm:py-14">
                <p className="flex flex-wrap items-center gap-x-3 label">
                    <time dateTime={mix.date}>{formatDate(mix.date)}</time>
                    <span className="text-text-faint">{mix.duration}</span>
                </p>
                <h1 className="mt-4 max-w-[24ch] text-3xl leading-tight sm:text-5xl">
                    {mix.title}
                </h1>
                {mix.genres.length > 0 && (
                    <p className="mt-4 label text-text-faint">
                        {mix.genres.join("  /  ")}
                    </p>
                )}
            </header>
            <div className="py-10">
                <MixPlayer mix={mix} embedUrl={embedUrlFor(mix)} />
                <p className="mt-3 label">
                    <a
                        href={mix.url}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-text"
                    >
                        open on {platformNames[mix.platform].toLowerCase()}
                    </a>
                </p>
            </div>
            <div className="prose-chezzer prose pb-12">
                <Content />
            </div>
        </>
    )
}

function MixSkeleton() {
    return (
        <div aria-hidden className="border-y border-line py-14">
            <div className="h-3 w-40 bg-surface-2" />
            <div className="mt-6 h-10 w-1/2 bg-surface-2" />
        </div>
    )
}
