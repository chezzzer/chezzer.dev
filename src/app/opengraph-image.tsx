import { ogContentType, ogImage, ogSize } from "~/lib/og"
import { site } from "~/lib/site"

export const alt = `${site.fullName}, ${site.name}`
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
    return ogImage({
        label: site.url.replace("https://", ""),
        title: "ryan cherry, chezzer online",
    })
}
