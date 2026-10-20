import type { MDXComponents } from "mdx/types"
import Callout from "~/components/mdx/callout"
import Figure from "~/components/mdx/figure"
import Pre from "~/components/mdx/pre"
import { Step, Steps } from "~/components/mdx/steps"

const components: MDXComponents = {
    Callout,
    Figure,
    Steps,
    Step,
    pre: Pre,
}

export function useMDXComponents(): MDXComponents {
    return components
}
