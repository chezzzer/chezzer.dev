export type Position = {
    title: string
    org: string
    href?: string
    start: string
    end?: string
    note?: string
}

export const careerStart = 2019

export const positions: Position[] = [
    {
        title: "Developer",
        org: "Timbers Studios",
        start: "2025-01",
        note: "websites and stream overlays for Minecraft events",
    },
    {
        title: "Software Developer",
        org: "Rocketspark",
        href: "https://www.rocketspark.com",
        start: "2024-03",
        note: "working on the website builder",
    },
    {
        title: "Summer Intern",
        org: "Rocketspark",
        href: "https://www.rocketspark.com",
        start: "2023-11",
        end: "2024-03",
        note: "worked on design controls for clients and partners",
    },
    {
        title: "Director",
        org: "Bundle Group",
        href: "https://bundlegroup.gg",
        start: "2022-10",
        note: "the studio behind The Atlas, CoasterCon and C&C LIVE",
    },
    {
        title: "Student Intern",
        org: "Rocketspark",
        href: "https://www.rocketspark.com",
        start: "2020-10",
        end: "2022-12",
    },
    {
        title: "Chief Technology Officer",
        org: "Coasters & Crafters",
        start: "2020-04",
        end: "2025-12",
        note: "a server list and community site for Minecraft servers",
    },
    {
        title: "Web Developer",
        org: "EVNT Games",
        start: "2020-04",
        end: "2022-11",
    },
    {
        title: "Web Developer",
        org: "UpBeat Radio",
        start: "2019-05",
        end: "2021-01",
    },
]
