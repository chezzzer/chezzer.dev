"use client"

import { SpotifyLogoIcon } from "@phosphor-icons/react"
import LocalTime from "~/components/layout/local-time"
import Glucose from "~/components/status/glucose"
import { usePresence } from "~/components/status/lanyard-provider"
import StatusDot from "~/components/status/status-dot"

export default function StatusStrip() {
    const { availability, onPhone, spotify } = usePresence()

    return (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-2">
                <StatusDot />
                <span className="font-mono text-sm text-text">
                    {availability}
                    {onPhone && availability !== "offline" && ", on phone"}
                </span>
                <LocalTime />
            </div>
            {spotify && (
                <a
                    href={
                        spotify.track_id
                            ? `https://open.spotify.com/track/${spotify.track_id}`
                            : undefined
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="flex min-w-0 items-center gap-2 text-sm hover:text-text"
                >
                    <SpotifyLogoIcon size={16} className="shrink-0 text-moss" />
                    <span className="truncate text-text">{spotify.song}</span>
                    {spotify.artist && (
                        <span className="truncate text-text-muted">
                            {spotify.artist}
                        </span>
                    )}
                </a>
            )}
            <Glucose />
        </div>
    )
}
