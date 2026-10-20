import { listWriting } from "~/lib/content"
import { site } from "~/lib/site"

function escape(value: string) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
}

export async function GET() {
    const articles = await listWriting()
    const published = articles.filter((article) => !article.draft)

    const items = published
        .map(
            (article) => `
        <item>
            <title>${escape(article.title)}</title>
            <link>${site.url}/writing/${article.slug}</link>
            <guid isPermaLink="true">${site.url}/writing/${article.slug}</guid>
            <pubDate>${new Date(article.date).toUTCString()}</pubDate>
            <description>${escape(article.summary)}</description>
            ${article.tags.map((tag) => `<category>${escape(tag)}</category>`).join("")}
        </item>`
        )
        .join("")

    const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>${escape(site.name)} writing</title>
        <link>${site.url}/writing</link>
        <atom:link href="${site.url}/writing/feed.xml" rel="self" type="application/rss+xml" />
        <description>${escape(site.description)}</description>
        <language>en-nz</language>${items}
    </channel>
</rss>`

    return new Response(feed, {
        headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
        },
    })
}
