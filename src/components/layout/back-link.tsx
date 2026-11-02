import Link from "next/link"

export default function BackLink({
    href,
    label,
}: {
    href: string
    label: string
}) {
    return (
        <Link
            href={href}
            className="mb-4 inline-flex items-center gap-2 label transition-colors hover:text-text"
        >
            <span aria-hidden>←</span>
            {label}
        </Link>
    )
}
