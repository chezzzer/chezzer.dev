import type { TocItem } from "~/lib/content"

export default function Toc({ items }: { items: TocItem[] }) {
    if (items.length === 0) return null

    return (
        <nav aria-label="Contents" className="lg:sticky lg:top-24">
            <p className="mb-3 label">contents</p>
            <ol className="flex flex-col gap-1.5 border-l border-line">
                {items.map((item) => (
                    <li key={item.url}>
                        <a
                            href={item.url}
                            className="block border-l border-transparent py-0.5 text-sm text-text-muted transition-colors hover:border-ember hover:text-text"
                            style={{
                                paddingLeft: `${(item.depth - 1) * 0.75}rem`,
                            }}
                        >
                            {item.title}
                        </a>
                    </li>
                ))}
            </ol>
        </nav>
    )
}
