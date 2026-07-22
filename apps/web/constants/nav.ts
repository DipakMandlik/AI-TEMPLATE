export interface NavLink {
  label: string;
  href: string;
  description: string;
}

/**
 * Static site navigation. Templates/categories/providers get their own
 * dynamically-derived entries once the content pipeline lands (Phase 5) —
 * the command palette upgrades to search real content in Phase 6.
 */
export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/", description: "Back to the landing page" },
  { label: "Templates", href: "/templates", description: "Browse the template library" },
  { label: "Categories", href: "/categories", description: "Browse by category" },
  { label: "Docs", href: "/docs", description: "Guides and API reference" },
];
