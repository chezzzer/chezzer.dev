import "server-only"

import GithubSlugger from "github-slugger"
import { cacheLife } from "next/cache"
import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import { z } from "zod"

const contentRoot = path.join(process.cwd(), "src", "content")

export const orgs = {
    rocketspark: "Rocketspark",
    timbers: "Timbers Studios",
    bumpy: "Bumpy Events",
    bundle: "Bundle Group",
    personal: "Personal",
    timebound: "Timebound",
    university: "University",
    eg: "Evil Geniuses",
} as const

export type Org = keyof typeof orgs

const imageSchema = z.object({
    src: z.string(),
    alt: z.string(),
    caption: z.string().optional(),
    width: z.number().int().positive().optional(),
    height: z.number().int().positive().optional(),
})

const workSchema = z.object({
    title: z.string(),
    summary: z.string(),
    date: z.iso.date(),
    org: z.enum(Object.keys(orgs) as [Org, ...Org[]]),
    role: z.string(),
    tags: z.array(z.string()).default([]),
    cover: imageSchema.optional(),
    logo: imageSchema.optional(),
    images: z.array(imageSchema).default([]),
    featured: z.boolean().default(false),
    links: z.array(z.object({ label: z.string(), href: z.url() })).default([]),
    status: z.enum(["shipped", "ongoing", "archived"]).default("shipped"),
    draft: z.boolean().default(false),
})

const writingSchema = z.object({
    title: z.string(),
    summary: z.string(),
    date: z.iso.date(),
    tags: z.array(z.string()).default([]),
    cover: imageSchema.optional(),
    draft: z.boolean().default(false),
})

const mixBaseSchema = z.object({
    title: z.string(),
    date: z.iso.date(),
    genres: z.array(z.string()).default([]),
    cover: imageSchema.optional(),
})

const mixSchema = z.union([
    mixBaseSchema.extend({
        comingSoon: z.literal(true),
    }),
    mixBaseSchema.extend({
        comingSoon: z.literal(false).default(false),
        platform: z.enum(["mixcloud", "soundcloud"]),
        url: z.url(),
        duration: z.string(),
    }),
])

export type WorkImage = z.infer<typeof imageSchema>
export type Work = z.infer<typeof workSchema> & { slug: string }
export type Writing = z.infer<typeof writingSchema> & {
    slug: string
    readingMinutes: number
}
export type Mix = z.infer<typeof mixSchema> & { slug: string }
export type ReleasedMix = Extract<Mix, { comingSoon: false }>

export type TocItem = { depth: number; title: string; url: string }

type Section = "work" | "writing" | "mixes"

async function slugsIn(section: Section) {
    const files = await readdir(path.join(contentRoot, section))
    return files
        .filter((file) => file.endsWith(".mdx"))
        .map((file) => file.replace(/\.mdx$/, ""))
}

async function frontmatterOf(section: Section, slug: string) {
    switch (section) {
        case "work":
            return (await import(`~/content/work/${slug}.mdx`)).frontmatter
        case "writing":
            return (await import(`~/content/writing/${slug}.mdx`)).frontmatter
        case "mixes":
            return (await import(`~/content/mixes/${slug}.mdx`)).frontmatter
    }
}

async function rawOf(section: Section, slug: string) {
    return readFile(path.join(contentRoot, section, `${slug}.mdx`), "utf8")
}

function byDateDesc<T extends { date: string }>(a: T, b: T) {
    return b.date.localeCompare(a.date)
}

export async function listWork(): Promise<Work[]> {
    "use cache"
    cacheLife("hours")
    const slugs = await slugsIn("work")
    const items = await Promise.all(
        slugs.map(async (slug) => ({
            slug,
            ...workSchema.parse(await frontmatterOf("work", slug)),
        }))
    )
    return items.filter((item) => !item.draft).sort(byDateDesc)
}

export async function getWork(slug: string) {
    const items = await listWork()
    return items.find((item) => item.slug === slug) ?? null
}

function wordsIn(raw: string) {
    const body = raw.replace(/^---[\s\S]*?---/, "")
    return body.split(/\s+/).filter(Boolean).length
}

export async function listWriting(): Promise<Writing[]> {
    "use cache"
    cacheLife("hours")
    const slugs = await slugsIn("writing")
    const items = await Promise.all(
        slugs.map(async (slug) => {
            const meta = writingSchema.parse(
                await frontmatterOf("writing", slug)
            )
            const raw = await rawOf("writing", slug)
            return {
                slug,
                ...meta,
                readingMinutes: Math.max(1, Math.round(wordsIn(raw) / 200)),
            }
        })
    )
    return items
        .filter((item) => !item.draft || process.env.NODE_ENV !== "production")
        .sort(byDateDesc)
}

export async function getWriting(slug: string) {
    const items = await listWriting()
    return items.find((item) => item.slug === slug) ?? null
}

export async function listMixes(): Promise<Mix[]> {
    "use cache"
    cacheLife("hours")
    const slugs = await slugsIn("mixes")
    const items = await Promise.all(
        slugs.map(async (slug) => ({
            slug,
            ...mixSchema.parse(await frontmatterOf("mixes", slug)),
        }))
    )
    return items.sort(byDateDesc)
}

export async function getMix(slug: string) {
    const items = await listMixes()
    return items.find((item) => item.slug === slug) ?? null
}

export async function tocOf(
    section: Section,
    slug: string
): Promise<TocItem[]> {
    "use cache"
    cacheLife("hours")
    const raw = await rawOf(section, slug)
    const body = raw
        .replace(/^---[\s\S]*?---/, "")
        .replace(/```[\s\S]*?```/g, "")
    const slugger = new GithubSlugger()
    const items: TocItem[] = []
    for (const match of body.matchAll(/^(#{2,3})\s+(.+?)\s*$/gm)) {
        const title = match[2]!.replace(/[*_`]/g, "")
        items.push({
            depth: match[1]!.length,
            title,
            url: `#${slugger.slug(title)}`,
        })
    }
    return items
}
