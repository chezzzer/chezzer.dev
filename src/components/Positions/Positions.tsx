import { ArrowSquareOut, Link } from "@phosphor-icons/react/dist/ssr";

type Position = {
    title: string;
    company: PositionCompany;
    description?: string;
    start: string;
    end?: string;
    tags?: PositionTag[];
    links?: PositionLink[];
};

type PositionTag = string;
type PositionLink = {
    name: string;
    url: string;
};
type PositionCompany = {
    name: string;
    url: string;
};

const positions: Position[] = [
    {
        title: "Summer Intern",
        description:
            "Developing high quality design controls & systems for clients and partners using Rocketspark's platform.",
        company: {
            name: "Rocketspark",
            url: "https://rocketspark.com",
        },
        start: "Nov 2023",
        tags: ["PHP", "PhpStorm", "TypeScript", "Web Dev", "MySQL"],
    },
    {
        title: "Director",
        description:
            "Managing a team of developers working on multiple passion projects.",
        company: {
            name: "Bundle Group",
            url: "https://bundlegroup.gg",
        },
        start: "Oct 2022",
        tags: [
            "TypeScript",
            "Web Dev",
            "NextJS",
            "Kubernetes",
            "GitLab CI",
            "Minecraft",
        ],
    },
    {
        title: "Chief Technology Officer",
        description:
            "Leading the development of a new social media platform for gamers, built with NextJS, TypeScript, and Pocketbase.",
        company: {
            name: "Coasters & Crafters",
            url: "https://coastersandcrafters.com",
        },
        start: "Apr 2020",
        tags: [
            "TypeScript",
            "Web Dev",
            "NextJS",
            "Kubernetes",
            "GitLab CI",
            "Pocketbase",
        ],
    },
    {
        title: "Web Developer",
        company: {
            name: "EVNT Games",
            url: "https://evnt.games",
        },
        start: "Apr 2020",
        tags: ["TypeScript", "NextJS"],
    },
    {
        title: "Student Intern",
        company: {
            name: "Rocketspark",
            url: "https://rocketspark.com",
        },
        start: "Oct 2020",
        end: "Dec 2022",
        tags: ["PHP", "PhpStorm"],
        links: [
            {
                name: "Blog Article",
                url: "https://www.rocketspark.com/blog/post/293/meet-the-16-year-old-computer-programmer/",
            },
        ],
    },
    {
        title: "Web Developer",
        company: {
            name: "UpBeat Radio",
            url: "https://upbeatradio.net",
        },
        start: "May 2019",
        end: "Jan 2021",
        tags: ["PHP", "MySQL"],
    },
];

export default function Positions() {
    return positions.map((position, i) => (
        <div className="md:flex gap-5 mb-16" key={i}>
            <div className="md:w-1/4 text-sm uppercase font-bold">
                <div>
                    {position.start} — {position.end ?? "Present"}
                </div>
            </div>
            <div className="md:w-3/4">
                <h2 className="text-xl fields">{position.title}</h2>
                <h2 className="opacity-75">
                    <a href={position.company.url} target="_blank">
                        {position.company.name}{" "}
                        <ArrowSquareOut className="inline" weight="bold" />
                    </a>
                </h2>
                {position.description && (
                    <p className="mt-2 text-sm">{position.description}</p>
                )}

                {position.links && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {position.links.map((link, i) => (
                            <a href={link.url} target="_blank" key={i}>
                                <Link weight="bold" className="inline" />{" "}
                                {link.name}
                            </a>
                        ))}
                    </div>
                )}
                {position.tags && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {position.tags.map((tag, i) => (
                            <span
                                className="bg-primaryLight border border-primary rounded-full px-3 py-1 text-xs text-white"
                                key={i}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    ));
}
