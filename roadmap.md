# AI-TEMPLATE — Roadmap

## 1. Vision

Build the definitive, open-source **AI Prompt & AI Agent Template Library** — the place a
developer goes to find, understand, and ship a production-grade Claude Code agent, Cursor
rule, Copilot config, or any other AI-tool template, with a browsing experience that feels
like **shadcn/ui meets Cursor Rules meets Claude Templates meets an enterprise prompt library.**

Not feature parity with the inspiration project. A flagship: better architecture, better UI,
better docs, better tests, better contributor experience, on day one of the public repo.

## 2. Repository state at project start

`DipakMandlik/AI-TEMPLATE` is currently an **empty repository** (no commits, no files). This
roadmap and its companion documents (`architecture.md`, `implementation-phases.md`) are the
first artifacts committed. Every phase after this one builds real, working code against the
plan below — nothing is scaffolded yet.

## 3. Inspiration project audit — `davila7/claude-code-templates`

Findings below are from direct inspection of the public repository (README, `CLAUDE.md`,
`CONTRIBUTING.md`, `package.json`, and directory structure of `cli-tool/`, `docs/`,
`cli-tool/components/`) on 2026-07-22.

### 3.1 What it is

- An **npm CLI** (`npx claude-code-templates@latest`, alias `cct`) that installs Claude Code
  components into a target project.
- 6–9 component categories: **agents** (30 domain categories, e.g. frontend-developer,
  security-auditor), **commands**, **hooks**, **loops**, **mcps**, **settings**, **skills**,
  plus **templates** (whole-project setups) and a **sandbox**.
- Content is Markdown with YAML frontmatter, stored at
  `cli-tool/components/{type}/{category}/{name}.md`.
- A companion **web dashboard** (Astro 5 + React islands + Tailwind v4) at `aitmpl.com`,
  deployed to Cloudflare Pages, with a split-domain model: `www.aitmpl.com` (public browse)
  vs. `app.aitmpl.com` (authenticated via Clerk, for saved collections).
- 29.8k GitHub stars, 3.19k forks, 209 open issues, MIT-licensed, created July 2025 — proof
  the _idea_ has strong demand, which raises the bar for what "better" needs to mean.

### 3.2 Weaknesses identified

| #   | Weakness                                                                                                                                                                                                                             | Evidence                                                                                                                                                                                                                                                                                                 |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **No real automated test suite.**                                                                                                                                                                                                    | Root `package.json`'s `test` script is a placeholder ("no tests configured"), despite `CLAUDE.md` stating a "70%+ coverage" aspiration. Claimed quality bar isn't enforced by CI.                                                                                                                        |
| 2   | **Mixed-language toolchain.**                                                                                                                                                                                                        | Content indexing (`generate_components_json.py`) is Python inside an otherwise Node.js/JS project — two runtimes, two dependency managers, harder onboarding and CI.                                                                                                                                     |
| 3   | **Validation is agent-mediated, not machine-enforced.**                                                                                                                                                                              | New components are checked by asking a `component-reviewer` _agent_ to review a checklist manually, rather than a schema (e.g. Zod/JSON Schema) that fails CI automatically on bad frontmatter.                                                                                                          |
| 4   | **Hand-maintained static HTML docs/dashboard pages.**                                                                                                                                                                                | `docs/` contains hand-authored `component.html`, `plugin.html`, `workflows.html`, `sitemap.xml` — not generated from a content-collection/type-safe pipeline, so they can silently drift from the actual catalog.                                                                                        |
| 5   | **Heavy, mandatory SaaS coupling for the product to function fully.**                                                                                                                                                                | Clerk (auth), Supabase (analytics), Neon (monitoring), Sentry (3 projects), Resend (newsletter), Cloudflare Workers/Pages are all wired into core operation — a contributor cannot run "the whole product" locally without provisioning ~5 external accounts. Not open-source-friendly for self-hosting. |
| 6   | **No owned design system.**                                                                                                                                                                                                          | No shadcn/ui-style primitive layer; UI is assembled per-page in Astro/React without a documented shared component library, risking visual inconsistency as the surface grows.                                                                                                                            |
| 7   | **Claude-centric taxonomy, not truly multi-provider.**                                                                                                                                                                               | "Agents"/"commands"/"hooks"/"mcps" are Claude Code concepts first; Cursor, Copilot, Windsurf, Codex, Aider, Cline, Roo Code, Continue.dev are not first-class, equally-modeled providers in the metadata schema.                                                                                         |
| 8   | **No keyboard-first UX.**                                                                                                                                                                                                            | No documented command palette, no global `⌘K` search-everywhere pattern.                                                                                                                                                                                                                                 |
| 9   | **No prompt-quality scoring, no template comparison, no version history UI**, despite `version`-like data existing informally in component frontmatter.                                                                              |
| 10  | **Collections/bookmarking require authentication** (Clerk-gated `app.aitmpl.com`) — no lightweight, account-free "save for later" for casual visitors.                                                                               |
| 11  | **Contribution guidance centers on adding Claude-only components**, not on adding a new _provider_ as a taxonomy citizen — makes multi-tool support feel bolted-on rather than designed-in.                                          |
| 12  | **`devDependencies` absent from root `package.json`** — no visible enforced lint/format/pre-commit tooling at the root, so code-style consistency across 600+ community-contributed components is harder to guarantee automatically. |

### 3.3 What it does well (worth learning from, not copying)

- **Component taxonomy breadth** (agents/commands/hooks/mcps/settings/skills/loops) is a
  useful mental model for "what shapes does an AI template come in" — we generalize it across
  providers rather than discard it.
- **Split, per-type JSON payloads** for the dashboard is a sound performance pattern for a
  large catalog — we achieve the same effect through a typed, build-time content pipeline
  instead of a hand-run script.
- **Security scanning as a CI gate** (a static analyzer blocking HIGH/CRITICAL findings on
  PRs) is good practice — we adopt the _principle_ (automated, blocking, PR-scoped security
  scanning) via CodeQL + secret scanning + Dependabot, framework-agnostic.
- **Community engagement loops** (weekly KPI "pulse," a newsletter highlighting trending
  components, a Discord bot for `/search /info /install /popular`) are smart growth features
  worth designing _for_ in our extensibility seams, even though they're out of scope for the
  initial OSS release.

### 3.4 Missing features we will add

- Enterprise-grade **faceted search** (tags, category, framework/provider, LLM, difficulty,
  popularity, recency) with URL-synced, multi-select, saved filters.
- A real **command palette** for search-everywhere and navigation.
- **Template comparison** (side-by-side diff of two templates).
- **Prompt Playground** with live preview and variable substitution.
- **Prompt quality scoring** and automated template validation feedback shown _on the template
  page_, not just in a contributor checklist.
- **Account-free bookmarking** (local storage) with an upgrade path to synced collections once
  auth ships.
- Fully automated, CI-enforced **content validation** (Zod) with clear, actionable error
  output on invalid frontmatter.
- **Dark mode, keyboard shortcuts, and full accessibility** (WCAG 2.1 AA, Lighthouse 100) as
  first-class, tested requirements, not aspirations.

## 4. Comparison summary

| Dimension                          | Inspiration project                                    | AI-TEMPLATE                                                         |
| ---------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------- |
| Runtime/toolchain                  | Node.js CLI + Python indexing script + Astro dashboard | Single TypeScript monorepo (Next.js + pnpm workspaces)              |
| Content validation                 | Manual/agent-reviewed                                  | Zod-schema-enforced, CI-blocking                                    |
| Design system                      | Ad hoc per-page (Astro/React)                          | Owned shadcn/ui-based primitive layer, one design language          |
| Provider model                     | Claude-Code-centric                                    | Provider-agnostic taxonomy (11+ tools as equal citizens)            |
| Core function needs external SaaS? | Yes (Clerk/Supabase/Neon/Sentry/Cloudflare)            | No — core browse/search/read works with zero accounts               |
| Testing                            | Placeholder test script                                | Vitest + Playwright + axe-core, CI-gated                            |
| Docs                               | Hand-written static HTML                               | MDX + content collections, type-safe, can't drift from data         |
| Search UX                          | Dashboard search box                                   | Command palette, faceted sidebar, URL-synced, instant client search |
| Accessibility/perf targets         | Not documented                                         | Lighthouse 100 / WCAG 2.1 AA, CI-enforced budget                    |

## 5. Feature roadmap (post-foundation)

Ordered roughly by dependency, not necessarily by calendar phase (see
`implementation-phases.md` for the phased execution plan this maps onto):

1. Landing page (hero, animated background, feature cards, showcase, stats, CTA, footer).
2. Template library browse view with faceted sidebar filters and instant search.
3. Template detail page (header, preview, copy/download, GitHub link, examples, related
   templates, MDX-rendered prompt with syntax highlighting).
4. Command palette (global search + navigation + theme toggle).
5. Bookmarking/favorites (local-first).
6. Template comparison view.
7. Prompt Playground with variable substitution and live preview.
8. Prompt quality score displayed per template.
9. Full SEO pipeline (sitemap, RSS, OpenGraph, structured data, canonical URLs).
10. Docs site (Getting Started, Architecture, Contributing, Writing a Template, Adding a
    Provider, Adding a Category, API, Deployment).
11. GitHub automation (CI, CodeQL, Dependabot/Renovate, automatic releases, issue/PR templates,
    labels).
12. **Future-ready, not built in v1** (interfaces reserved, see `architecture.md` §7):
    authentication, user accounts, community-submitted templates, voting, comments,
    marketplace-style installable versions, analytics, cloud sync.

## 6. Success bar

When a developer lands on `DipakMandlik/AI-TEMPLATE`, within 30 seconds they should feel it is
more polished, better organized, and more trustworthy than `claude-code-templates` — because
the UI is calmer and faster, the search is instant, every template is validated and documented
to the same standard, and the whole thing runs locally with one command and no external
accounts. That is the bar every phase in `implementation-phases.md` is held to.
