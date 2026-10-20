import Link from "next/link"
import type { Writing } from "~/lib/content"

function NavLink({
    article,
    direction,
}: {
    article: Writing | null
    direction: "previous" | "next"
}) {
    if (!article) return <div className="bg-ink p-5" />

    return (
        <Link
            href={`/writing/${article.slug}`}
            className={`group flex flex-col gap-1 bg-ink p-5 transition-colors hover:bg-surface-1 ${
                direction === "next" ? "text-right" : ""
            }`}
        >
            <span className="label">{direction}</span>
            <span className="font-mono text-text group-hover:text-ember">
                {article.title}
            </span>
        </Link>
    )
}

export default function ArticleNav({
    previous,
    next,
}: {
    previous: Writing | null
    next: Writing | null
}) {
    return (
        <div className="grid grid-cols-2 gap-px border border-line bg-line">
            <NavLink article={previous} direction="previous" />
            <NavLink article={next} direction="next" />
        </div>
    )
}
