"use client"

import { CheckIcon, CopyIcon } from "@phosphor-icons/react"
import { useRef, useState, type ComponentProps } from "react"

export default function Pre(props: ComponentProps<"pre">) {
    const ref = useRef<HTMLPreElement>(null)
    const [copied, setCopied] = useState(false)

    const copy = async () => {
        const text = ref.current?.textContent ?? ""
        try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
        } catch {}
    }

    return (
        <div className="group relative">
            <pre ref={ref} {...props} />
            <button
                type="button"
                onClick={copy}
                aria-label="Copy code"
                className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-ink/80 px-2 py-1 label opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
            >
                {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
                {copied ? "copied" : "copy"}
            </button>
        </div>
    )
}
