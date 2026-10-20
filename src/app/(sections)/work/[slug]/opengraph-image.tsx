import { getWork, listWork, orgs } from "~/lib/content"
import { ogContentType, ogImage, ogSize } from "~/lib/og"

export const size = ogSize
export const contentType = ogContentType

export async function generateStaticParams() {
    const items = await listWork()
    return items.map(({ slug }) => ({ slug }))
}

export default async function Image({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const item = await getWork(slug)
    return ogImage({
        label: item ? `/// work / ${orgs[item.org].toLowerCase()}` : "/// work",
        title: item?.title ?? "work",
    })
}
