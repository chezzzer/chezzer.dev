import type { Metadata } from "next"
import BackLink from "~/components/layout/back-link"
import JsonLd from "~/components/layout/json-ld"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import Gallery from "~/components/work/gallery"
import MetaRail from "~/components/work/meta-rail"
import WorkCover from "~/components/work/work-cover"
import { getWork, listWork } from "~/lib/content"
import { breadcrumbJsonLd, pageMetadata, workJsonLd } from "~/lib/seo"

export async function generateStaticParams() {
    const work = await listWork()
    return work.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
    params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
    const { slug } = await params
    const item = await getWork(slug)
    if (!item) return { title: "Not found" }
    return pageMetadata({
        title: item.title,
        description: item.summary,
        path: `/work/${slug}`,
        type: "article",
        publishedTime: item.date,
    })
}

export default function WorkDetailPage({ params }: PageProps<"/work/[slug]">) {
    return (
        <article className="site-container mt-6">
            <BackLink href="/work" label="all work" />
            <Suspense fallback={<DetailSkeleton />}>
                <WorkDetail params={params} />
            </Suspense>
        </article>
    )
}

async function WorkDetail({
    params,
}: Pick<PageProps<"/work/[slug]">, "params">) {
    const { slug } = await params
    const work = await getWork(slug)
    if (!work) notFound()

    const { default: Content } = await import(`~/content/work/${slug}.mdx`)

    return (
        <>
            <JsonLd
                data={[
                    workJsonLd(work),
                    breadcrumbJsonLd([
                        { name: "work", path: "/work" },
                        { name: work.title, path: `/work/${slug}` },
                    ]),
                ]}
            />
            <WorkCover work={work} />
            <div className="grid gap-12 py-12 lg:grid-cols-[1fr_18rem] lg:gap-16">
                <div className="prose-chezzer prose">
                    <Content />
                </div>
                <aside>
                    <MetaRail work={work} />
                </aside>
            </div>
            <Gallery images={work.images} />
        </>
    )
}

function DetailSkeleton() {
    return (
        <div aria-hidden className="border-y border-line bg-surface-1">
            <div className="aspect-[16/9] hairline-grid opacity-60 sm:aspect-[21/9]" />
        </div>
    )
}
