import Link from "next/link"
import type { Writing } from "~/lib/content"
import { formatDate } from "~/lib/format"

export default function ArticleCard({ article }: { article: Writing }) {
    return (
        <Link
            href={`/writing/${article.slug}`}
            className="group grid gap-3 border-t border-line py-6 transition-colors hover:bg-surface-1 sm:grid-cols-[10rem_1fr] sm:gap-8 sm:px-4"
        >
            <div className="flex flex-col gap-1 label">
                <time dateTime={article.date}>{formatDate(article.date)}</time>
                <span className="text-text-faint">
                    {article.readingMinutes} min read
                </span>
            </div>
            <div>
                <p className="font-mono text-xl text-text">
                    {article.title}
                    {article.draft && (
                        <span className="ml-3 label text-ember">draft</span>
                    )}
                </p>
                <p className="mt-2 max-w-[60ch] text-sm leading-6 text-text-muted">
                    {article.summary}
                </p>
                {article.tags.length > 0 && (
                    <p className="mt-3 label text-text-faint">
                        {article.tags.join("  /  ")}
                    </p>
                )}
            </div>
        </Link>
    )
}
