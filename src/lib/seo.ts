import type { Metadata } from "next"
import { orgs, type ReleasedMix, type Work, type Writing } from "~/lib/content"
import { site, socials } from "~/lib/site"

export function pageMetadata({
    title,
    description,
    path,
    type = "website",
    publishedTime,
}: {
    title?: string
    description: string
    path: string
    type?: "website" | "article"
    publishedTime?: string
}): Metadata {
    const fullTitle = title
        ? `${title} | ${site.name}`
        : `${site.fullName} | ${site.name}`
    return {
        title,
        description,
        alternates: { canonical: path },
        openGraph: {
            title: fullTitle,
            description,
            url: `${site.url}${path}`,
            siteName: site.name,
            locale: "en_NZ",
            type,
            ...(publishedTime ? { publishedTime } : {}),
        },
        twitter: {
            card: "summary_large_image",
            title: fullTitle,
            description,
        },
    }
}

export type JsonLd = Record<string, unknown>

export function personJsonLd(): JsonLd {
    return {
        "@context": "https://schema.org",
        "@type": "Person",
        name: site.fullName,
        alternateName: site.name,
        url: site.url,
        jobTitle: "Software developer",
        worksFor: { "@type": "Organization", name: "Rocketspark" },
        address: {
            "@type": "PostalAddress",
            addressLocality: "Hamilton",
            addressCountry: "NZ",
        },
        sameAs: socials
            .filter((social) => !social.href.startsWith("mailto:"))
            .map((social) => social.href),
    }
}

export function articleJsonLd(article: Writing): JsonLd {
    return {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: article.summary,
        datePublished: article.date,
        url: `${site.url}/writing/${article.slug}`,
        keywords: article.tags.join(", "),
        author: { "@type": "Person", name: site.fullName, url: site.url },
    }
}

export function workJsonLd(work: Work): JsonLd {
    return {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: work.title,
        description: work.summary,
        dateCreated: work.date,
        url: `${site.url}/work/${work.slug}`,
        keywords: work.tags.join(", "),
        creator: { "@type": "Person", name: site.fullName, url: site.url },
        publisher: { "@type": "Organization", name: orgs[work.org] },
    }
}

function isoDuration(duration: string) {
    const parts = duration.split(":").map(Number).reverse()
    const [seconds = 0, minutes = 0, hours = 0] = parts
    return `PT${hours ? `${hours}H` : ""}${minutes ? `${minutes}M` : ""}${seconds}S`
}

export function mixJsonLd(mix: ReleasedMix): JsonLd {
    return {
        "@context": "https://schema.org",
        "@type": "MusicRecording",
        name: mix.title,
        datePublished: mix.date,
        duration: isoDuration(mix.duration),
        genre: mix.genres,
        url: `${site.url}/mixes/${mix.slug}`,
        sameAs: mix.url,
        byArtist: { "@type": "Person", name: site.name, url: site.url },
    }
}

export function breadcrumbJsonLd(
    items: { name: string; path: string }[]
): JsonLd {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: `${site.url}${item.path}`,
        })),
    }
}
