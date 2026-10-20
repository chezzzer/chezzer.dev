const dayFormat = new Intl.DateTimeFormat("en-NZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
})

const monthFormat = new Intl.DateTimeFormat("en-NZ", {
    month: "short",
    year: "numeric",
})

export function formatDate(iso: string) {
    return dayFormat.format(new Date(iso))
}

export function formatMonth(iso: string) {
    return monthFormat.format(new Date(iso))
}

export function yearOf(iso: string) {
    return iso.slice(0, 4)
}
