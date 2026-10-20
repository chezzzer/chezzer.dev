import { ogContentType, ogImage, ogSize } from "~/lib/og"

export const alt = "About"
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
    return ogImage({ label: "/// about", title: "about me" })
}
