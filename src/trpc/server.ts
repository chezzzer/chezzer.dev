import "server-only"

import { headers } from "next/headers"
import { cache } from "react"
import { createCaller } from "~/server/api/root"
import { createTRPCContext } from "~/server/api/trpc"

const createContext = cache(async () => {
    const requestHeaders = new Headers(await headers())
    return createTRPCContext({ headers: requestHeaders })
})

export const api = createCaller(createContext)
