import {
    Envelope,
    LinkedinLogo,
    DiscordLogo,
    InstagramLogo,
    GithubLogo,
    SpotifyLogo,
} from "@phosphor-icons/react/dist/ssr";
import styles from "./Socials.module.css";

export default function Socials() {
    return (
        <div className={styles.socials}>
            <a
                className={styles.social}
                href="https://www.linkedin.com/in/ryan-cherry-/"
                target="_blank"
            >
                <LinkedinLogo size={32} weight="fill" /> <span>LinkedIn</span>
            </a>
            <a
                className={styles.social}
                href="https://github.com/chezzzer"
                target="_blank"
            >
                <GithubLogo size={32} weight="fill" /> <span>GitHub</span>
            </a>
            <a className={styles.social} href="mailto:hello@chezzer.dev">
                <Envelope size={32} weight="fill" />{" "}
                <span>hello@chezzer.dev</span>
            </a>
            <a className={styles.social}>
                <DiscordLogo size={32} weight="fill" /> <span>chezzer</span>
            </a>
            <a
                className={styles.social}
                href="https://instagram.com/ryancherry.nz"
                target="_blank"
            >
                <InstagramLogo size={32} weight="fill" /> <span>Instagram</span>
            </a>
            <a
                className={styles.social}
                href="https://open.spotify.com/user/chezzercherry"
                target="_blank"
            >
                <SpotifyLogo size={32} weight="fill" /> <span>Spotify</span>
            </a>
        </div>
    );
}
