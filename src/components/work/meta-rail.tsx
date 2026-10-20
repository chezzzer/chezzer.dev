import { orgs, type Work } from "~/lib/content"
import { formatMonth } from "~/lib/format"

function Row({
    label,
    children,
}: {
    label: string
    children: React.ReactNode
}) {
    return (
        <div className="grid grid-cols-[6rem_1fr] gap-3 border-t border-line py-3 text-sm first:border-t-0">
            <dt className="label">{label}</dt>
            <dd className="text-text">{children}</dd>
        </div>
    )
}

export default function MetaRail({ work }: { work: Work }) {
    return (
        <dl className="border-y border-line lg:sticky lg:top-24">
            <Row label="for">{orgs[work.org]}</Row>
            <Row label="role">{work.role}</Row>
            <Row label="when">{formatMonth(work.date)}</Row>
            <Row label="status">{work.status}</Row>
            {work.tags.length > 0 && (
                <Row label="stack">{work.tags.join(", ")}</Row>
            )}
            {work.links.length > 0 && (
                <Row label="links">
                    <ul className="flex flex-col gap-1">
                        {work.links.map((link) => (
                            <li key={link.href}>
                                <a
                                    href={link.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-ember underline decoration-ember/50 underline-offset-4 hover:decoration-ember"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </Row>
            )}
        </dl>
    )
}
