"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useLanyard, type Types } from "use-lanyard"
import { site } from "~/lib/site"

const LanyardContext = createContext<Types.Presence | undefined>(undefined)

export default function LanyardProvider({ children }: { children: ReactNode }) {
    const presence = useLanyard(site.discordId)
    return (
        <LanyardContext.Provider value={presence}>
            {children}
        </LanyardContext.Provider>
    )
}

export type Availability = "online" | "away" | "busy" | "offline"

export function usePresence() {
    const presence = useContext(LanyardContext)

    const availability: Availability = !presence
        ? "offline"
        : presence.discord_status === "online"
          ? "online"
          : presence.discord_status === "idle"
            ? "away"
            : presence.discord_status === "dnd"
              ? "busy"
              : "offline"

    const onPhone =
        !!presence?.active_on_discord_mobile &&
        !presence.active_on_discord_desktop

    const spotify = presence?.listening_to_spotify ? presence.spotify : null

    return { presence, availability, onPhone, spotify }
}
