import { envsafe, str, url } from "envsafe";

export const env = envsafe({
    DISCORD_WEBHOOK: url(),
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: str(),
    TURNSTILE_SECRET_KEY: str(),
});
