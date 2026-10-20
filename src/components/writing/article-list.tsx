"use client"

import { useMemo, useState } from "react"
import ArticleCard from "~/components/writing/article-card"
import type { Writing } from "~/lib/content"
import { cn } from "~/lib/utils"

export default function ArticleList({ articles }: { articles: Writing[] }) {
    const [tag, setTag] = useState<string | null>(null)

    const tags = useMemo(() => {
        const counts = new Map<string, number>()
        for (const article of articles) {
            for (const name of article.tags) {
                counts.set(name, (counts.get(name) ?? 0) + 1)
            }
        }
        return [...counts.entries()].sort((a, b) => b[1] - a[1])
    }, [articles])

    const shown = tag
        ? articles.filter((article) => article.tags.includes(tag))
        : articles

    return (
        <div>
            {tags.length > 1 && (
                <div className="flex flex-wrap gap-1.5">
                    <FilterButton
                        active={tag === null}
                        onClick={() => setTag(null)}
                    >
                        all
                    </FilterButton>
                    {tags.map(([name, count]) => (
                        <FilterButton
                            key={name}
                            active={tag === name}
                            onClick={() => setTag(tag === name ? null : name)}
                        >
                            {name}{" "}
                            <span className="text-text-faint">{count}</span>
                        </FilterButton>
                    ))}
                </div>
            )}
            <div className="mt-8 border-b border-line">
                {shown.map((article) => (
                    <ArticleCard key={article.slug} article={article} />
                ))}
            </div>
        </div>
    )
}

function FilterButton({
    active,
    onClick,
    children,
}: {
    active: boolean
    onClick: () => void
    children: React.ReactNode
}) {
    return (
        <button
            type="button"
            aria-pressed={active}
            onClick={onClick}
            className={cn(
                "rounded-full px-3 py-2 font-mono text-xs transition-colors",
                active
                    ? "bg-ink text-text debossed"
                    : "bg-surface-1 text-text-muted embossed hover:text-text"
            )}
        >
            {children}
        </button>
    )
}
