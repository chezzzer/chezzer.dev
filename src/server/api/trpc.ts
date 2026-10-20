import { initTRPC } from "@trpc/server"
import superjson from "superjson"
import { flattenError, ZodError } from "zod"
import { db } from "~/server/db"

function ipFrom(headers: Headers) {
    const forwarded = headers.get("x-forwarded-for")
    return (
        forwarded?.split(",")[0]?.trim() ??
        headers.get("x-real-ip") ??
        "unknown"
    )
}

export const createTRPCContext = async (opts: { headers: Headers }) => {
    return {
        db,
        headers: opts.headers,
        ip: ipFrom(opts.headers),
    }
}

const t = initTRPC.context<typeof createTRPCContext>().create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
        const zodError = error.cause instanceof ZodError ? error.cause : null
        return {
            ...shape,
            message: zodError
                ? (zodError.issues[0]?.message ?? "Invalid input")
                : shape.message,
            data: {
                ...shape.data,
                zodError: zodError ? flattenError(zodError) : null,
            },
        }
    },
})

export const createCallerFactory = t.createCallerFactory
export const createTRPCRouter = t.router
export const publicProcedure = t.procedure
