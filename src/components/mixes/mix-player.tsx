"use client"

import { PlayIcon } from "@phosphor-icons/react"
import { useState } from "react"
import { platformNames } from "~/components/mixes/embed"
import type { ReleasedMix } from "~/lib/content"

export default function MixPlayer({
    mix,
    embedUrl,
}: {
    mix: ReleasedMix
    embedUrl: string
}) {
    const [loaded, setLoaded] = useState(false)
    const platform = platformNames[mix.platform]

    if (loaded) {
        return (
            <div className="border border-line bg-surface-2 debossed">
                <iframe
                    title={`${mix.title} on ${platform}`}
                    src={embedUrl}
                    width="100%"
                    height={mix.platform === "mixcloud" ? 120 : 166}
                    allow="autoplay; encrypted-media"
                    loading="lazy"
                    className="block"
                />
            </div>
        )
    }

    return (
        <button
            type="button"
            onClick={() => setLoaded(true)}
            className="group flex w-full items-center gap-5 bg-surface-1 p-5 text-left embossed transition-colors hover:bg-surface-2"
        >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-ink text-ember debossed">
                <PlayIcon size={22} weight="fill" />
            </span>
            <span className="flex flex-col gap-1">
                <span className="font-mono text-lg text-text">
                    play on {platform.toLowerCase()}
                </span>
                <span className="label">
                    loads the {platform} player, {mix.duration} long
                </span>
            </span>
        </button>
    )
}
