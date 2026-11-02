import Image from "next/image"
import { orgs, type Work } from "~/lib/content"
import { formatMonth } from "~/lib/format"

export default function WorkCover({ work }: { work: Work }) {
    return (
        <div className="relative overflow-hidden border-y border-line bg-surface-1">
            <div className="relative aspect-[16/9] sm:aspect-[21/9]">
                {work.cover ? (
                    <>
                        <Image
                            src={work.cover.src}
                            alt={work.cover.alt}
                            fill
                            priority
                            sizes="(min-width: 1120px) 1120px, 100vw"
                            className="object-cover"
                        />
                        <div
                            aria-hidden
                            className="absolute inset-0 bg-ink/55"
                        />
                    </>
                ) : (
                    <div
                        aria-hidden
                        className="absolute inset-0 hairline-grid opacity-60"
                    />
                )}
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
                    <p className="label">
                        {orgs[work.org].toLowerCase()} /{" "}
                        {formatMonth(work.date)}
                    </p>
                    <h1 className="mt-3 max-w-[20ch] text-3xl leading-tight sm:text-5xl">
                        {work.title}
                    </h1>
                </div>
            </div>
        </div>
    )
}
