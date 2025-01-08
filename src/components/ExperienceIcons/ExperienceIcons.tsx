import styles from "./ExperienceIcons.module.css";
import {
    siAmazonaws,
    siBun,
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
    siPrisma,
    siReact,
    siRedis,
    siSpotify,
    siSupabase,
    siTailwindcss,
    siTrpc,
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
        siTrpc,
        siYarn,
        siBun,
        siGithub,
        siGitlab,
        siVisualstudiocode,
        siPrisma,
        siFigma,
        siTailwindcss,
        siAmazonaws,
        siPhp,
        siRedis,
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
