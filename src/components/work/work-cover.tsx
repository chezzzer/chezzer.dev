import Image from "next/image"
import CoverLogo from "~/components/work/cover-logo"
import { orgs, type Work } from "~/lib/content"
import { formatMonth } from "~/lib/format"
import { cn } from "~/lib/utils"

export default function WorkCover({ work }: { work: Work }) {
    return (
        <div className="relative overflow-hidden border-y border-line bg-surface-1">
            <div className="relative aspect-[16/9] overflow-hidden sm:aspect-[21/9]">
                {work.cover ? (
                    <>
                        <Image
                            src={work.cover.src}
                            alt={work.cover.alt}
                            fill
                            priority
                            sizes="(min-width: 1120px) 1120px, 100vw"
                            className={cn(
                                "object-cover",
                                work.logo && "scale-110 blur-md"
                            )}
                        />
                        <div
                            aria-hidden
                            className="absolute inset-0 bg-ink/55"
                        />
                        {work.logo && (
                            <CoverLogo
                                logo={work.logo}
                                priority
                                sizes="(min-width: 1120px) 560px, 50vw"
                                className="h-1/2 w-1/2"
                            />
                        )}
                    </>
                ) : (
                    <div
                        aria-hidden
                        className="absolute inset-0 hairline-grid opacity-60"
                    />
                )}
            </div>
            <div className="p-6 sm:absolute sm:inset-x-0 sm:bottom-0 sm:p-10">
                <p className="label">
                    {orgs[work.org].toLowerCase()} / {formatMonth(work.date)}
                </p>
                <h1 className="mt-3 max-w-[20ch] text-3xl leading-tight sm:text-5xl">
                    {work.title}
                </h1>
            </div>
        </div>
    )
}
