import { ogContentType, ogImage, ogSize } from "~/lib/og"

export const alt = "Guestbook"
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
    return ogImage({ label: "/// guestbook", title: "leave a note" })
}
