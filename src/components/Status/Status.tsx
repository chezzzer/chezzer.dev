"use client";

import { useEffect, useState } from "react";
import { Data, useLanyardWS } from "use-lanyard";
import LocalTime from "./LocalTime";
import {
    Circle,
    Equalizer,
    MusicNote,
    SpotifyLogo,
} from "@phosphor-icons/react/dist/ssr";
import { MusicNoteSimple } from "@phosphor-icons/react";
import Glucose from "./Glucose";

const discordID = "195979856733929472";

type SpotifyStatus = {
    song?: string;
    artist?: string;
    track_id?: string;
};

type Status = {
    status: "Online" | "Mobile" | "Offline";
    spotify?: SpotifyStatus;
};

const colorMap = {
    Online: "text-green-500",
    Mobile: "text-yellow-500",
    Offline: "text-red-500",
};

function getStatus(data: Data): Status {
    const spotify: SpotifyStatus | undefined = data.spotify
        ? {
              song: data.spotify.song,
              artist: data.spotify.artist,
              track_id: data.spotify.track_id!,
          }
        : undefined;

    if (data.active_on_discord_desktop) {
        return {
            status: "Online",
            spotify,
        };
    }

    if (data.active_on_discord_mobile) {
        return {
            status: "Mobile",
            spotify,
        };
    }

    return {
        status: "Offline",
        spotify,
    };
}

export default function Status() {
    const data = useLanyardWS(discordID);

    if (!data) return <></>;

    const status = getStatus(data);

    return (
        <>
            <div className="flex items-center gap-2">
                <Circle
                    className={colorMap[status.status]}
                    weight="fill"
                    size={20}
                />
                {status.status}
                <Circle weight="fill" size={8} className="opacity-75" />
                <LocalTime />
            </div>
            {status.spotify && (
                <div className="flex items-center mt-1">
                    <Equalizer weight="fill" size={20} />
                    <a
                        className="ml-2 max-w-[300px]"
                        href={`https://open.spotify.com/track/${status.spotify.track_id}`}
                        target="_blank"
                    >
                        {status.spotify.song}
                        <span className="opacity-50">
                            {" "}
                            {status.spotify.artist}
                        </span>
                    </a>
                </div>
            )}
            <Glucose />
        </>
    );
}
