"use client"

import { useEffect, useState } from "react"
import { site } from "~/lib/site"

const format = new Intl.DateTimeFormat("en-NZ", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: site.timeZone,
})

export default function LocalTime() {
    const [time, setTime] = useState<string>()

    useEffect(() => {
        const tick = () => setTime(format.format(new Date()))
        tick()
        const timer = setInterval(tick, 15_000)
        return () => clearInterval(timer)
    }, [])

    return <span className="label tabular-nums">{time ?? "--:--"} nzt</span>
}
