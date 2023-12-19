import ExperienceIcons from "@/components/ExperienceIcons/ExperienceIcons";
import Positions from "@/components/Positions/Positions";

export default function Home() {
    return (
        <>
            <div>
                <p className="text-xl fields mr-10 mb-5">
                    Based in New Zealand, I am a{" "}
                    <a href="https://github.com/chezzzer" target="_blank">
                        developer
                    </a>{" "}
                    and designer with a keen interest in technology and
                    creativity, furthering my academic pursuits at{" "}
                    <a href="https://waikato.ac.nz" target="_blank">
                        Waikato University
                    </a>{" "}
                    with a bachelor&apos;s in Computer Science. Alongside my
                    studies, I am passionate about contributing to community
                    welfare through online volunteering, where I organize events
                    and{" "}
                    <a href="https://coastercon.net" target="_blank">
                        conventions
                    </a>{" "}
                    to support various{" "}
                    <a href="https://gktw.org" target="_blank">
                        charities
                    </a>
                    .
                </p>
                <p className="text-xl fields mr-10 mb-5">
                    My technical expertise is showcased through my proficiency
                    in configuring and optimizing software applications. I am
                    committed to innovation and problem-solving in digital
                    environments. Additionally, I am continuously enhancing my
                    skills in advanced web development, both through my academic
                    studies and self-directed learning.
                </p>
                <p className="text-xl fields mr-10 mb-5">
                    I am excited to connect with professionals in the tech
                    industry and explore opportunities where I can contribute my
                    expertise and grow in my professional journey.
                </p>
            </div>
            <div className="mt-20">
                <ExperienceIcons />
            </div>
            <div className="mt-20">
                <div className="mb-5 font-bold opacity-75 text-sm">
                    POSITIONS
                </div>
                <Positions />
            </div>
        </>
    );
}
