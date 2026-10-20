# chezzer.dev

The personal site of Ryan Cherry (chezzer): work, writing, DJ mixes and a guestbook.

Built with Next 16, Tailwind v4, MDX, tRPC and Prisma on Neon Postgres. Hosted on Vercel.

## Running it

```bash
bun install
cp .env.example .env
bun dev
```

`bun run db:dev` starts a local Postgres in Docker on port 5433, which matches the default `DATABASE_URL` in `.env.example`. Add Cloudflare Turnstile keys to run the guestbook. Everything else works without a database.

## Content

Work, writing and mixes are MDX files in `src/content`. Each file's frontmatter is validated at build time, so a typo fails the build rather than the page.

## Licence

Code is MIT. Content, writing, images and mixes are © Ryan Cherry and not licensed for reuse.
