import { ogContentType, ogImage, ogSize } from "~/lib/og"

export const alt = "Mixes"
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
    return ogImage({ label: "/// mixes", title: "mixtapes for locking in" })
}
