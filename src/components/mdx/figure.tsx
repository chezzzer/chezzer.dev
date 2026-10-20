import Image from "next/image"

export default function Figure({
    src,
    alt,
    caption,
    width,
    height,
}: {
    src: string
    alt: string
    caption?: string
    width: number
    height: number
}) {
    return (
        <figure className="not-prose my-10">
            <div className="border border-line bg-surface-1 p-1">
                <Image
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    sizes="(min-width: 1024px) 720px, 100vw"
                    className="h-auto w-full"
                />
            </div>
            {caption && (
                <figcaption className="mt-3 label">{caption}</figcaption>
            )}
        </figure>
    )
}
