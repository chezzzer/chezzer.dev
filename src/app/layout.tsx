import type { Metadata, Viewport } from "next"
import { Caveat, Geist, Geist_Mono } from "next/font/google"
import localFont from "next/font/local"
import Footer from "~/components/layout/footer"
import Grain from "~/components/layout/grain"
import MobileTabs from "~/components/layout/mobile-tabs"
import Nav from "~/components/layout/nav"
import LanyardProvider from "~/components/status/lanyard-provider"
import { TRPCReactProvider } from "~/trpc/react"
import { site } from "~/lib/site"
import "~/styles/globals.css"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
})

const caveat = Caveat({
    variable: "--font-caveat",
    subsets: ["latin"],
})

const digitalDisco = localFont({
    variable: "--font-digital-disco",
    src: [
        { path: "../fonts/DigitalDisco.ttf", weight: "400" },
        { path: "../fonts/DigitalDisco-Thin.ttf", weight: "200" },
    ],
})

const pixelta = localFont({
    variable: "--font-pixelta",
    src: "../fonts/Pixelta.ttf",
    weight: "400",
})

export const metadata: Metadata = {
    metadataBase: new URL(site.url),
    title: {
        default: `${site.fullName} | ${site.name}`,
        template: `%s | ${site.name}`,
    },
    description: site.description,
    applicationName: site.name,
    authors: [{ name: site.fullName, url: site.url }],
    creator: site.fullName,
    openGraph: {
        type: "website",
        siteName: site.name,
        locale: "en_NZ",
        url: site.url,
        title: `${site.fullName} | ${site.name}`,
        description: site.description,
    },
    twitter: {
        card: "summary_large_image",
        title: `${site.fullName} | ${site.name}`,
        description: site.description,
    },
    robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    alternates: {
        canonical: "/",
        types: { "application/rss+xml": "/writing/feed.xml" },
    },
}

export const viewport: Viewport = {
    themeColor: "#0e0d0b",
    colorScheme: "dark",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} ${digitalDisco.variable} ${pixelta.variable} ${caveat.variable} h-full`}
        >
            <body className="flex min-h-full flex-col">
                <TRPCReactProvider>
                    <LanyardProvider>
                        <a
                            href="#main"
                            className="sr-only z-50 rounded-full bg-surface-1 px-4 py-2 font-mono text-sm text-text embossed focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
                        >
                            skip to content
                        </a>
                        <Grain />
                        <Nav />
                        <main id="main" className="flex-1">
                            {children}
                        </main>
                        <Footer />
                        <MobileTabs />
                    </LanyardProvider>
                </TRPCReactProvider>
            </body>
        </html>
    )
}
