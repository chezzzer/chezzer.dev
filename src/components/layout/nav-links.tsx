"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { navItems } from "~/lib/site"
import { cn } from "~/lib/utils"

export default function NavLinks() {
    const pathname = usePathname()

    return (
        <ul className="flex items-center gap-1">
            {navItems.map((item) => {
                const active = pathname.startsWith(item.href)
                return (
                    <li key={item.href}>
                        <Link
                            href={item.href}
                            aria-current={active ? "page" : undefined}
                            className={cn(
                                "block rounded-full px-3 py-2 font-mono text-sm transition-colors",
                                active
                                    ? "bg-ink text-text debossed"
                                    : "text-text-muted hover:text-text"
                            )}
                        >
                            {item.label}
                        </Link>
                    </li>
                )
            })}
        </ul>
    )
}
