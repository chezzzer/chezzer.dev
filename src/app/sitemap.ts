import type { MetadataRoute } from "next"
import { listMixes, listWork, listWriting } from "~/lib/content"
import { site } from "~/lib/site"

function latest(dates: string[]) {
    return new Date(dates.sort().at(-1) ?? "2026-01-01")
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [work, writing, mixes] = await Promise.all([
        listWork(),
        listWriting(),
        listMixes(),
    ])
    const published = writing.filter((article) => !article.draft)
    const everything = latest([
        ...work.map((item) => item.date),
        ...published.map((item) => item.date),
        ...mixes.map((item) => item.date),
    ])

    return [
        {
            url: site.url,
            lastModified: everything,
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${site.url}/work`,
            lastModified: latest(work.map((item) => item.date)),
            changeFrequency: "monthly",
            priority: 0.9,
        },
        {
            url: `${site.url}/writing`,
            lastModified: latest(published.map((item) => item.date)),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${site.url}/mixes`,
            lastModified: latest(mixes.map((item) => item.date)),
            changeFrequency: "monthly",
            priority: 0.6,
        },
        {
            url: `${site.url}/guestbook`,
            changeFrequency: "daily",
            priority: 0.5,
        },
        {
            url: `${site.url}/about`,
            lastModified: everything,
            changeFrequency: "monthly",
            priority: 0.7,
        },
        ...work.map((item) => ({
            url: `${site.url}/work/${item.slug}`,
            lastModified: new Date(item.date),
            changeFrequency: "yearly" as const,
            priority: 0.8,
        })),
        ...published.map((item) => ({
            url: `${site.url}/writing/${item.slug}`,
            lastModified: new Date(item.date),
            changeFrequency: "yearly" as const,
            priority: 0.7,
        })),
        ...mixes.map((item) => ({
            url: `${site.url}/mixes/${item.slug}`,
            lastModified: new Date(item.date),
            changeFrequency: "yearly" as const,
            priority: 0.5,
        })),
    ]
}
