"use client"

import {
    BookOpenIcon,
    CubeIcon,
    PenNibIcon,
    UserIcon,
    WaveformIcon,
    type Icon,
} from "@phosphor-icons/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { navItems } from "~/lib/site"
import { cn } from "~/lib/utils"

const icons: Record<(typeof navItems)[number]["href"], Icon> = {
    "/work": CubeIcon,
    "/writing": PenNibIcon,
    "/mixes": WaveformIcon,
    "/guestbook": BookOpenIcon,
    "/about": UserIcon,
}

export default function MobileTabs() {
    const pathname = usePathname()

    return (
        <nav
            aria-label="Primary"
            className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink pb-[env(safe-area-inset-bottom)] md:hidden"
        >
            <ul className="grid grid-cols-5">
                {navItems.map((item) => {
                    const Icon = icons[item.href]
                    const active = pathname.startsWith(item.href)
                    return (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                aria-current={active ? "page" : undefined}
                                className={cn(
                                    "flex h-14 flex-col items-center justify-center gap-1 font-mono text-[11px]",
                                    active ? "text-ember" : "text-text-muted"
                                )}
                            >
                                <Icon
                                    size={20}
                                    weight={active ? "fill" : "regular"}
                                />
                                {item.label}
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}
