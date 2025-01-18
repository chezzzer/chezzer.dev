import {
    ArrowDown,
    ArrowDownRight,
    ArrowRight,
    ArrowUp,
    ArrowUpRight,
    Icon,
    Drop,
} from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";

type GlucoseResponse = {
    mmol: number;
    mgdl: number;
    trend: string;
    timestamp: number;
};

export default function Glucose() {
    const [reconnect, setReconnect] = useState(0);
    const [data, setData] = useState<GlucoseResponse | null>(null);

    let socket: WebSocket | null = useMemo(
        () =>
            typeof window != "undefined"
                ? new WebSocket(
                      `wss://dexcom.chezzer.dev/socket`,
                      reconnect.toString()
                  )
                : null,
        [reconnect]
    );

    useEffect(() => {
        if (!socket) return;

        socket.addEventListener("message", (event) => {
            setData(JSON.parse(event.data));
        });

        socket.addEventListener("close", () => {
            setTimeout(() => {
                setReconnect(reconnect + 1);
            }, reconnect * 100);
        });
    }, [socket]);

    if (!data) return <></>;

    const GlucoseIcon = getIcon(data?.trend);

    return (
        <div className="flex items-center gap-2 mt-1">
            <Drop weight="fill" size={20}/>
            <div className="flex items-center gap-1">
                {data.mmol.toFixed(1)}
                <span className="opacity-50">mmol/L</span>
                {GlucoseIcon !== undefined && <GlucoseIcon className="opacity-50" weight="bold" size={20} />}
            </div>
        </div>
    );
}

function getIcon(trend: string): Icon | undefined {
    switch (trend) {
        case "doubledown":
        case "singledown":
            return ArrowDown;
        case "fortyfivedown":
            return ArrowDownRight;
        case "flat":
            return ArrowRight;
        case "fortyfiveup":
            return ArrowUpRight;
        case "doubleup":
        case "singleup":
            return ArrowUp;
    }
}
