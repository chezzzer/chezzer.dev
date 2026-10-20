import { positions } from "~/lib/positions"
import { cn } from "~/lib/utils"

const monthFormat = new Intl.DateTimeFormat("en-NZ", {
    month: "short",
    year: "numeric",
})

function formatRange(start: string, end?: string) {
    const from = monthFormat.format(new Date(`${start}-01`))
    return end
        ? `${from} to ${monthFormat.format(new Date(`${end}-01`))}`
        : `${from} to now`
}

export default function Timeline() {
    return (
        <ol className="relative border-l border-line">
            {positions.map((position) => {
                const current = !position.end
                return (
                    <li
                        key={`${position.org}-${position.start}`}
                        className="relative grid gap-1 py-5 pl-8 sm:grid-cols-[11rem_1fr] sm:gap-6"
                    >
                        <span
                            aria-hidden
                            className={cn(
                                "absolute top-7 -left-[5px] h-[9px] w-[9px] rounded-full border border-line bg-ink",
                                current &&
                                    "border-moss bg-moss shadow-[0_0_8px] shadow-moss/60"
                            )}
                        />
                        <p className="pt-1 label">
                            {formatRange(position.start, position.end)}
                        </p>
                        <div>
                            <p className="font-mono text-lg text-text">
                                {position.title}
                            </p>
                            <p className="text-sm text-text-muted">
                                {position.href ? (
                                    <a
                                        href={position.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="hover:text-text"
                                    >
                                        {position.org}
                                    </a>
                                ) : (
                                    position.org
                                )}
                            </p>
                            {position.note && (
                                <p className="mt-2 max-w-[52ch] text-sm leading-6 text-text-muted">
                                    {position.note}
                                </p>
                            )}
                        </div>
                    </li>
                )
            })}
        </ol>
    )
}
