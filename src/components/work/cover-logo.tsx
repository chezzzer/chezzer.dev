import Image from "next/image"
import { type WorkImage } from "~/lib/content"
import { cn } from "~/lib/utils"

export default function CoverLogo({
    logo,
    sizes,
    priority,
    className,
}: {
    logo: WorkImage
    sizes: string
    priority?: boolean
    className?: string
}) {
    return (
        <div
            className={cn(
                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                className
            )}
        >
            <Image
                src={logo.src}
                alt={logo.alt}
                fill
                priority={priority}
                sizes={sizes}
                className="object-contain"
            />
        </div>
    )
}
