import { getMix, listMixes } from "~/lib/content"
import { ogContentType, ogImage, ogSize } from "~/lib/og"

export const size = ogSize
export const contentType = ogContentType

export async function generateStaticParams() {
    const items = await listMixes()
    return items.map(({ slug }) => ({ slug }))
}

export default async function Image({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const item = await getMix(slug)
    return ogImage({
        label: item ? "/// mixes" : "/// mixes",
        title: item?.title ?? "mixes",
    })
}
