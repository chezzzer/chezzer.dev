import type { JsonLd as JsonLdData } from "~/lib/seo"

export default function JsonLd({ data }: { data: JsonLdData | JsonLdData[] }) {
    const json = JSON.stringify(data).replaceAll("<", "\\u003c")
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: json }}
        />
    )
}
