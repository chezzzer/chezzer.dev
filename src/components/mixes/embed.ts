import type { Mix } from "~/lib/content"

export function embedUrlFor(mix: Mix) {
    if (mix.platform === "mixcloud") {
        const feed = new URL(mix.url).pathname
        return `https://www.mixcloud.com/widget/iframe/?hide_cover=1&light=0&feed=${encodeURIComponent(feed)}`
    }

    const params = new URLSearchParams({
        url: mix.url,
        color: "#ff6a1f",
        auto_play: "false",
        hide_related: "true",
        show_comments: "false",
        show_user: "true",
        visual: "false",
    })
    return `https://w.soundcloud.com/player/?${params.toString()}`
}

export const platformNames = {
    mixcloud: "Mixcloud",
    soundcloud: "SoundCloud",
} as const
