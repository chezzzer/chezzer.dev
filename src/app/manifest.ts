import type { MetadataRoute } from "next"
import { site } from "~/lib/site"

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: `${site.fullName}, ${site.name}`,
        short_name: site.name,
        description: site.description,
        start_url: "/",
        display: "standalone",
        background_color: "#0e0d0b",
        theme_color: "#0e0d0b",
        icons: [
            { src: "/icon", sizes: "32x32", type: "image/png" },
            { src: "/apple-icon", sizes: "180x180", type: "image/png" },
        ],
    }
}
