export const site = {
    name: "chezzer",
    fullName: "Ryan Cherry",
    url: "https://chezzer.dev",
    description:
        "hey, I'm chezzer (Ryan Cherry). I work on the website builder at Rocketspark and make websites and stream tools for Minecraft events.",
    timeZone: "Pacific/Auckland",
    discordId: "195979856733929472" as const,
    glucoseSocket: "wss://dexcom.chezzer.dev/socket",
    careerStartLabel: "2019",
}

export const navItems = [
    { href: "/work", label: "work" },
    { href: "/writing", label: "writing" },
    { href: "/guestbook", label: "guestbook" },
    { href: "/about", label: "about" },
    { href: "/mixes", label: "mixes" },
] as const

export const socials = [
    { label: "github", href: "https://github.com/chezzzer" },
    { label: "linkedin", href: "https://www.linkedin.com/in/ryancherry" },
    { label: "instagram", href: "https://www.instagram.com/chezzer" },
    { label: "spotify", href: "https://open.spotify.com/user/chezzer" },
    { label: "email", href: "mailto:hello@chezzer.dev" },
] as const
