import Image from "next/image"
import { PanelGrid } from "~/components/layout/panel-grid"
import type { WorkImage } from "~/lib/content"

export default function Gallery({ images }: { images: WorkImage[] }) {
    if (images.length === 0) return null

    return (
        <PanelGrid columns={2}>
            {images.map((image) => (
                <figure key={image.src} className="bg-ink p-4">
                    <Image
                        src={image.src}
                        alt={image.alt}
                        width={image.width}
                        height={image.height}
                        sizes="(min-width: 1024px) 540px, 100vw"
                        className="h-auto w-full border border-line"
                    />
                    {image.caption && (
                        <figcaption className="mt-3 label">
                            {image.caption}
                        </figcaption>
                    )}
                </figure>
            ))}
        </PanelGrid>
    )
}
