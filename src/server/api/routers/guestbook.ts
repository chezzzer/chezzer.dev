import { TRPCError } from "@trpc/server"
import { createHash } from "node:crypto"
import {
    englishDataset,
    englishRecommendedTransformers,
    RegExpMatcher,
} from "obscenity"
import { z } from "zod"
import { env } from "~/lib/env"
import { accentIds, backgroundIds, fontIds } from "~/lib/guestbook/styles"
import { verifyTurnstile } from "~/lib/turnstile"
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"

const matcher = new RegExpMatcher({
    ...englishDataset.build(),
    ...englishRecommendedTransformers,
})

const rateWindowMs = 10 * 60 * 1000
const rateLimit = 3

const entrySelect = {
    id: true,
    name: true,
    message: true,
    url: true,
    background: true,
    accent: true,
    font: true,
    createdAt: true,
} as const

function hashIp(ip: string) {
    return createHash("sha256")
        .update(env.IP_HASH_SALT + ip)
        .digest("hex")
}

export const guestbookRouter = createTRPCRouter({
    list: publicProcedure
        .input(
            z.object({
                cursor: z.string().optional(),
                limit: z.number().int().min(1).max(48).default(24),
            })
        )
        .query(async ({ ctx, input }) => {
            const rows = await ctx.db.guestbookEntry.findMany({
                where: { hidden: false },
                orderBy: { createdAt: "desc" },
                take: input.limit + 1,
                cursor: input.cursor ? { id: input.cursor } : undefined,
                skip: input.cursor ? 1 : 0,
                select: entrySelect,
            })
            const hasMore = rows.length > input.limit
            const entries = hasMore ? rows.slice(0, input.limit) : rows
            return {
                entries,
                nextCursor: hasMore ? entries.at(-1)?.id : undefined,
            }
        }),

    create: publicProcedure
        .input(
            z.object({
                name: z.string().trim().min(1, "Add a name").max(40),
                message: z.string().trim().min(1, "Write something").max(280),
                url: z
                    .string()
                    .trim()
                    .max(200)
                    .refine(
                        (value) => value === "" || /^https?:\/\//.test(value),
                        "Links need to start with http"
                    )
                    .optional(),
                background: z.enum(backgroundIds),
                accent: z.enum(accentIds),
                font: z.enum(fontIds),
                turnstileToken: z.string().min(1),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const human = await verifyTurnstile(input.turnstileToken, ctx.ip)
            if (!human) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "The human check did not pass. Try again.",
                })
            }

            if (
                matcher.hasMatch(input.name) ||
                matcher.hasMatch(input.message)
            ) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Keep it clean.",
                })
            }

            const ipHash = hashIp(ctx.ip)
            const recent = await ctx.db.guestbookEntry.count({
                where: {
                    ipHash,
                    createdAt: { gte: new Date(Date.now() - rateWindowMs) },
                },
            })
            if (recent >= rateLimit) {
                throw new TRPCError({
                    code: "TOO_MANY_REQUESTS",
                    message: "That is plenty for now. Come back in a bit.",
                })
            }

            return ctx.db.guestbookEntry.create({
                data: {
                    name: input.name,
                    message: input.message,
                    url:
                        input.url === undefined || input.url === ""
                            ? null
                            : input.url,
                    background: input.background,
                    accent: input.accent,
                    font: input.font,
                    ipHash,
                },
                select: entrySelect,
            })
        }),
})
