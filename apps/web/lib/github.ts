const REPO = "DipakMandlik/AI-TEMPLATE";
const DEFAULT_BRANCH = "main";

/** Link to a template's source file on GitHub, for the "Open in GitHub" action. */
export function templateGithubUrl(provider: string, category: string, slug: string): string {
  return `https://github.com/${REPO}/blob/${DEFAULT_BRANCH}/content/templates/${provider}/${category}/${slug}.mdx`;
}
