/** @type {import("prettier").Config & import("prettier-plugin-tailwindcss").PluginOptions} */
const config = {
    tabWidth: 4,
    useTabs: false,
    endOfLine: "crlf",
    semi: false,
    trailingComma: "es5",
    bracketSpacing: true,
    plugins: ["prettier-plugin-tailwindcss"],
    tailwindStylesheet: "./src/styles/globals.css",
}

export default config
