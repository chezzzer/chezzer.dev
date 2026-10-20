import Link from "next/link"
import LocalTime from "~/components/layout/local-time"
import NavLinks from "~/components/layout/nav-links"
import StatusDot from "~/components/status/status-dot"
import { site } from "~/lib/site"

export default function Nav() {
    return (
        <header className="sticky top-0 z-40 pt-4">
            <div className="site-container">
                <div className="flex h-12 items-center justify-between rounded-full bg-surface-1 pr-4 pl-5 embossed">
                    <Link
                        href="/"
                        className="py-2 font-mono text-base font-medium tracking-tight text-text"
                    >
                        {site.name}
                    </Link>
                    <nav aria-label="Primary" className="hidden md:block">
                        <NavLinks />
                    </nav>
                    <div className="flex items-center gap-2">
                        <StatusDot />
                        <LocalTime />
                    </div>
                </div>
            </div>
        </header>
    )
}
