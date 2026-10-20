import { ogContentType, ogImage, ogSize } from "~/lib/og"

export const alt = "Work"
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
    return ogImage({ label: "/// work", title: "things i’ve made" })
}
