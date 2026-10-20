import { useEffect, useState } from "react"

const maxDelay = 30_000

export function useSocket<T>(url: string) {
    const [message, setMessage] = useState<T | null>(null)

    useEffect(() => {
        let socket: WebSocket | null = null
        let timer: ReturnType<typeof setTimeout> | null = null
        let attempts = 0
        let closed = false

        const connect = () => {
            if (closed) return
            socket = new WebSocket(url)

            socket.addEventListener("open", () => {
                attempts = 0
            })

            socket.addEventListener(
                "message",
                (event: MessageEvent<string>) => {
                    try {
                        setMessage(JSON.parse(event.data) as T)
                    } catch {}
                }
            )

            socket.addEventListener("close", () => {
                if (closed) return
                attempts += 1
                const delay = Math.min(maxDelay, 1000 * 2 ** attempts)
                timer = setTimeout(connect, delay)
            })
        }

        connect()

        return () => {
            closed = true
            if (timer) clearTimeout(timer)
            socket?.close()
        }
    }, [url])

    return message
}
