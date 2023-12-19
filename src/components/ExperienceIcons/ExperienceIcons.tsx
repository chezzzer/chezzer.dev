import styles from "./ExperienceIcons.module.css";
import {
    siAmazonaws,
    siDiscord,
    siDocker,
    siFigma,
    siGit,
    siGithub,
    siGitlab,
    siJavascript,
    siKubernetes,
    siMysql,
    siNextdotjs,
    siNodedotjs,
    siPhp,
    siPocketbase,
    siReact,
    siSpotify,
    siSupabase,
    siTailwindcss,
    siTypescript,
    siVisualstudiocode,
    siYarn,
} from "simple-icons";

export default function ExperienceIcons() {
    const experience = [
        siTypescript,
        siJavascript,
        siReact,
        siNextdotjs,
        siNodedotjs,
        siDocker,
        siKubernetes,
        siYarn,
        siGit,
        siGithub,
        siGitlab,
        siVisualstudiocode,
        siDiscord,
        siSpotify,
        siTailwindcss,
        siAmazonaws,
        siPhp,
        siFigma,
        siMysql,
        siSupabase,
        siPocketbase,
    ];

    return (
        <div className="bg-light p-7 rounded-3xl shadow-lg">
            <div className="grid grid-cols-7 gap-5">
                {experience.map((item, i) => (
                    <div
                        className={styles.icon}
                        style={{ ["--color" as any]: "#" + item.hex }}
                        key={i}
                        dangerouslySetInnerHTML={{ __html: item.svg }}
                    ></div>
                ))}
            </div>
        </div>
    );
}
