import Image from "next/image"
import Link from "next/link"
import { platformNames } from "~/components/mixes/embed"
import type { Mix } from "~/lib/content"
import { formatMonth } from "~/lib/format"

export default function MixCard({ mix }: { mix: Mix }) {
    return (
        <Link
            href={`/mixes/${mix.slug}`}
            className="group flex gap-5 bg-ink p-5 transition-colors hover:bg-surface-1"
        >
            <div className="relative h-24 w-24 shrink-0 overflow-hidden border border-line bg-surface-1">
                {mix.cover ? (
                    <Image
                        src={mix.cover.src}
                        alt={mix.cover.alt}
                        fill
                        sizes="96px"
                        className="object-cover"
                    />
                ) : (
                    <div
                        aria-hidden
                        className="absolute inset-0 dot-field opacity-70"
                    />
                )}
            </div>
            <div className="flex min-w-0 flex-col">
                <p className="label">
                    {formatMonth(mix.date)} / {mix.duration}
                </p>
                <p className="mt-2 font-mono text-lg text-text group-hover:text-ember">
                    {mix.title}
                </p>
                <p className="mt-auto pt-3 label text-text-faint">
                    {[
                        ...mix.genres,
                        platformNames[mix.platform].toLowerCase(),
                    ].join("  /  ")}
                </p>
            </div>
        </Link>
    )
}
