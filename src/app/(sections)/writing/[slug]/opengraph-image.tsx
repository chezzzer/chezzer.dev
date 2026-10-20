import { getWriting, listWriting } from "~/lib/content"
import { ogContentType, ogImage, ogSize } from "~/lib/og"

export const size = ogSize
export const contentType = ogContentType

export async function generateStaticParams() {
    const items = await listWriting()
    return items.map(({ slug }) => ({ slug }))
}

export default async function Image({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const item = await getWriting(slug)
    return ogImage({
        label: item ? "/// writing" : "/// writing",
        title: item?.title ?? "writing",
    })
}
