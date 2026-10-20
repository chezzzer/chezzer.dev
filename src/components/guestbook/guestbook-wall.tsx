"use client"

import GuestbookCard from "~/components/guestbook/guestbook-card"
import { formatDate } from "~/lib/format"
import { isAccent, isBackground, isFont } from "~/lib/guestbook/styles"
import { api, type RouterOutputs } from "~/trpc/react"

type Page = RouterOutputs["guestbook"]["list"]

const pageSize = 24

export default function GuestbookWall({ initial }: { initial: Page }) {
    const query = api.guestbook.list.useInfiniteQuery(
        { limit: pageSize },
        {
            getNextPageParam: (page) => page.nextCursor,
            initialData: { pages: [initial], pageParams: [undefined] },
        }
    )

    const entries = query.data?.pages.flatMap((page) => page.entries) ?? []

    if (entries.length === 0) {
        return (
            <p className="border-y border-line py-10 text-center label">
                nothing here yet. be the first.
            </p>
        )
    }

    return (
        <div>
            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
                {entries.map((entry) => (
                    <div key={entry.id} className="mb-4 break-inside-avoid">
                        <GuestbookCard
                            id={entry.id}
                            background={
                                isBackground(entry.background)
                                    ? entry.background
                                    : "plain"
                            }
                            accent={
                                isAccent(entry.accent) ? entry.accent : "moss"
                            }
                            font={isFont(entry.font) ? entry.font : "mono"}
                            message={entry.message}
                            footer={
                                <>
                                    {entry.url ? (
                                        <a
                                            href={entry.url}
                                            target="_blank"
                                            rel="nofollow noreferrer"
                                            className="text-text underline decoration-line underline-offset-4 hover:decoration-text"
                                        >
                                            {entry.name}
                                        </a>
                                    ) : (
                                        <span className="text-text">
                                            {entry.name}
                                        </span>
                                    )}
                                    <time
                                        dateTime={entry.createdAt.toISOString()}
                                    >
                                        {formatDate(
                                            entry.createdAt.toISOString()
                                        )}
                                    </time>
                                </>
                            }
                        />
                    </div>
                ))}
            </div>
            {query.hasNextPage && (
                <div className="mt-6 text-center">
                    <button
                        type="button"
                        onClick={() => query.fetchNextPage()}
                        disabled={query.isFetchingNextPage}
                        className="rounded-full bg-surface-1 px-5 py-2 font-mono text-sm text-text-muted embossed hover:text-text"
                    >
                        {query.isFetchingNextPage ? "loading" : "more"}
                    </button>
                </div>
            )}
        </div>
    )
}
