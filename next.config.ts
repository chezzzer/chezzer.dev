import createMDX from "@next/mdx"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    pageExtensions: ["ts", "tsx", "md", "mdx"],
    cacheComponents: true,
    outputFileTracingIncludes: {
        "/**": ["./src/fonts/DigitalDisco.ttf"],
    },
    partialPrefetching: true,
    turbopack: {
        rules: {
            "*.css": {
                loaders: ["@tailwindcss/turbopack"],
                as: "*.css",
            },
        },
    },
    images: {
        qualities: [90, 75],
    },
}

const withMDX = createMDX({
    options: {
        remarkPlugins: [
            "remark-frontmatter",
            ["remark-mdx-frontmatter", { name: "frontmatter" }],
            "remark-gfm",
        ],
        rehypePlugins: [
            "rehype-slug",
            ["rehype-autolink-headings", { behavior: "wrap" }],
            ["rehype-pretty-code", { theme: "vesper", keepBackground: false }],
        ],
    },
})

export default withMDX(nextConfig)
