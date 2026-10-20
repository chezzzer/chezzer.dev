import { guestbookRouter } from "~/server/api/routers/guestbook"
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc"

export const appRouter = createTRPCRouter({
    guestbook: guestbookRouter,
})

export type AppRouter = typeof appRouter

export const createCaller = createCallerFactory(appRouter)
