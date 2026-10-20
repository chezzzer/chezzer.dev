import { cacheLife } from "next/cache"
import Link from "next/link"
import LocalTime from "~/components/layout/local-time"
import { Panel, PanelGrid } from "~/components/layout/panel-grid"
import { navItems, site, socials } from "~/lib/site"

async function CopyrightYear() {
    "use cache"
    cacheLife("days")
    return new Date().getFullYear()
}

export default function Footer() {
    return (
        <footer className="site-container pt-16 pb-24 md:pb-12">
            <PanelGrid columns={3}>
                <Panel>
                    <p className="font-mono text-base text-text">{site.name}</p>
                    <p className="mt-2 max-w-[28ch] text-sm text-text-muted">
                        Designed and developed by chezzer in New Zealand.
                    </p>
                    <p className="mt-6">
                        <LocalTime />
                    </p>
                </Panel>
                <Panel>
                    <p className="mb-3 label">pages</p>
                    <ul className="flex flex-col gap-1.5">
                        {navItems.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className="inline-block py-1 text-sm text-text-muted transition-colors hover:text-text"
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </Panel>
                <Panel>
                    <p className="mb-3 label">elsewhere</p>
                    <ul className="flex flex-col gap-1.5">
                        {socials.map((social) => (
                            <li key={social.href}>
                                <a
                                    href={social.href}
                                    rel="me noreferrer"
                                    target="_blank"
                                    className="inline-block py-1 text-sm text-text-muted transition-colors hover:text-text"
                                >
                                    {social.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </Panel>
            </PanelGrid>
            <p className="mt-4 label text-text-faint">
                © <CopyrightYear /> {site.fullName}. Digital Disco typeface by
                jeti, CC BY 4.0.
            </p>
        </footer>
    )
}
