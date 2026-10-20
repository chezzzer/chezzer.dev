"use client"

import {
    ArrowDownIcon,
    ArrowDownRightIcon,
    ArrowRightIcon,
    ArrowUpIcon,
    ArrowUpRightIcon,
    DropIcon,
    type Icon,
} from "@phosphor-icons/react"
import { useSocket } from "~/components/status/use-socket"
import { site } from "~/lib/site"

type Reading = {
    mmol: number
    mgdl: number
    trend: string
    timestamp: number
}

const trendIcons: Record<string, Icon> = {
    doubledown: ArrowDownIcon,
    singledown: ArrowDownIcon,
    fortyfivedown: ArrowDownRightIcon,
    flat: ArrowRightIcon,
    fortyfiveup: ArrowUpRightIcon,
    singleup: ArrowUpIcon,
    doubleup: ArrowUpIcon,
}

export default function Glucose() {
    const reading = useSocket<Reading>(site.glucoseSocket)
    if (!reading) return null

    const Trend = trendIcons[reading.trend]

    return (
        <div className="flex items-center gap-2">
            <DropIcon size={16} weight="fill" className="text-text-muted" />
            <span className="font-mono text-sm text-text tabular-nums">
                {reading.mmol.toFixed(1)}
            </span>
            <span className="label">mmol/L</span>
            {Trend && (
                <Trend size={14} weight="bold" className="text-text-muted" />
            )}
        </div>
    )
}
