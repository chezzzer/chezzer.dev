import Image from "next/image"
import Link from "next/link"
import CoverLogo from "~/components/work/cover-logo"
import { orgs, type Work } from "~/lib/content"
import { yearOf } from "~/lib/format"
import { cn } from "~/lib/utils"

export default function WorkCard({ work }: { work: Work }) {
    return (
        <Link
            href={`/work/${work.slug}`}
            className="group flex h-full flex-col bg-ink p-5 transition-colors hover:bg-surface-1"
        >
            <div className="relative aspect-[4/3] overflow-hidden border border-line bg-surface-1">
                {work.cover ? (
                    <>
                        <Image
                            src={work.cover.src}
                            alt={work.cover.alt}
                            quality={90}
                            fill
                            sizes="(min-width: 1024px) 340px, (min-width: 640px) 50vw, 100vw"
                            className={cn(
                                "object-cover opacity-90 transition-opacity group-hover:opacity-100",
                                work.logo && "scale-110 blur-sm"
                            )}
                        />
                        {work.logo && (
                            <>
                                <div
                                    aria-hidden
                                    className="absolute inset-0 bg-ink/55"
                                />
                                <CoverLogo
                                    logo={work.logo}
                                    sizes="(min-width: 1024px) 200px, (min-width: 640px) 30vw, 60vw"
                                    className="h-1/2 w-3/5"
                                />
                            </>
                        )}
                    </>
                ) : (
                    <div
                        aria-hidden
                        className="absolute inset-0 dot-field opacity-70"
                    />
                )}
            </div>
            <div className="mt-4 flex items-center gap-3 label">
                <span>{orgs[work.org].toLowerCase()}</span>
                <span aria-hidden className="h-px flex-1 bg-line" />
                <span>{yearOf(work.date)}</span>
            </div>
            <p className="mt-2 font-mono text-lg text-text">{work.title}</p>
            <p className="mt-1 text-sm leading-6 text-text-muted">
                {work.summary}
            </p>
        </Link>
    )
}
