import type { Metadata } from "next"
import JsonLd from "~/components/layout/json-ld"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import ArticleNav from "~/components/writing/article-nav"
import Toc from "~/components/writing/toc"
import { getWriting, listWriting, tocOf } from "~/lib/content"
import { breadcrumbJsonLd, pageMetadata, articleJsonLd } from "~/lib/seo"
import { formatDate } from "~/lib/format"

export async function generateStaticParams() {
    const articles = await listWriting()
    return articles.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
    params,
}: PageProps<"/writing/[slug]">): Promise<Metadata> {
    const { slug } = await params
    const item = await getWriting(slug)
    if (!item) return { title: "Not found" }
    return pageMetadata({
        title: item.title,
        description: item.summary,
        path: `/writing/${slug}`,
        type: "article",
        publishedTime: item.date,
    })
}

export default function WritingDetailPage({
    params,
}: PageProps<"/writing/[slug]">) {
    return (
        <article className="site-container mt-6">
            <Suspense fallback={<ArticleSkeleton />}>
                <Article params={params} />
            </Suspense>
        </article>
    )
}

async function Article({
    params,
}: Pick<PageProps<"/writing/[slug]">, "params">) {
    const { slug } = await params
    const articles = await listWriting()
    const index = articles.findIndex((item) => item.slug === slug)
    const article = articles[index]
    if (!article) notFound()

    const [toc, { default: Content }] = await Promise.all([
        tocOf("writing", slug),
        import(`~/content/writing/${slug}.mdx`),
    ])

    const newer = articles[index - 1] ?? null
    const older = articles[index + 1] ?? null

    return (
        <>
            <JsonLd
                data={[
                    articleJsonLd(article),
                    breadcrumbJsonLd([
                        { name: "writing", path: "/writing" },
                        { name: article.title, path: `/writing/${slug}` },
                    ]),
                ]}
            />
            <header className="border-y border-line py-10 sm:py-14">
                <p className="flex flex-wrap items-center gap-x-3 label">
                    <time dateTime={article.date}>
                        {formatDate(article.date)}
                    </time>
                    <span className="text-text-faint">
                        {article.readingMinutes} min read
                    </span>
                    {article.draft && <span className="text-ember">draft</span>}
                </p>
                <h1 className="mt-4 max-w-[24ch] text-3xl leading-tight sm:text-5xl">
                    {article.title}
                </h1>
                <p className="mt-4 max-w-[58ch] text-lg leading-8 text-text-muted">
                    {article.summary}
                </p>
            </header>
            <div className="grid gap-12 py-12 lg:grid-cols-[1fr_14rem] lg:gap-16">
                <div className="prose-chezzer prose">
                    <Content />
                </div>
                <aside>
                    <Toc items={toc} />
                </aside>
            </div>
            <ArticleNav previous={older} next={newer} />
        </>
    )
}

function ArticleSkeleton() {
    return (
        <div aria-hidden className="border-y border-line py-14">
            <div className="h-3 w-40 bg-surface-2" />
            <div className="mt-6 h-10 w-2/3 bg-surface-2" />
        </div>
    )
}
