import "server-only"

import { cacheLife } from "next/cache"
import type { Stat } from "~/components/layout/stat-tiles"
import { careerStart } from "~/lib/positions"

async function currentYear() {
    "use cache"
    cacheLife("days")
    return new Date().getFullYear()
}

export async function siteStats(): Promise<Stat[]> {
    const year = await currentYear()

    return [
        {
            value: year - careerStart,
            label: "years making websites",
            accent: true,
        },
        { value: "490k+", label: "lines of code pushed" },
        { value: 7, label: "events worked on" },
        { value: "75k", label: "peak live viewers" },
    ]
}
