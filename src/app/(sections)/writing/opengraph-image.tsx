import { ogContentType, ogImage, ogSize } from "~/lib/og"

export const alt = "Writing"
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
    return ogImage({ label: "/// writing", title: "writeups and other things" })
}
