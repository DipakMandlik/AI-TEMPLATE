# AI-TEMPLATE — Architecture

> Status: Foundational design document. Written before any application code exists in this
> repository. Nothing here is implemented yet — this is the contract that Phases 3–10
> (see `implementation-phases.md`) build against.

## 1. Guiding constraints

These constraints shape every decision below and exist to fix specific weaknesses found in
the inspiration project (`davila7/claude-code-templates`, see `roadmap.md` §3 for the full
audit):

1. **Zero-SaaS core.** Browsing, searching, and reading templates must work fully offline /
   self-hosted with `pnpm install && pnpm dev` — no Clerk, Supabase, Neon, Sentry, or
   Cloudflare account required to run the product. Auth, analytics, and community features
   are additive, optional, and isolated behind provider interfaces (see §7).
2. **One language, one runtime.** No Python bolted onto a Node/TS project for indexing.
   Content generation is TypeScript, runs in the same toolchain as the app, and is type-checked
   by the same `tsc`.
3. **Validated content, not reviewed-by-agent content.** Every template is validated against a
   Zod schema in CI. A malformed template fails the build; it does not rely on a human or an
   agent remembering to check a list.
4. **Provider-agnostic taxonomy.** A template is not "a Claude thing" or "a Cursor thing" —
   it is a portable unit of prompt/agent configuration that declares which tools it's
   compatible with. Claude Code, Cursor, Copilot, Windsurf, Codex, Aider, Cline, Roo Code,
   Continue.dev, Gemini, OpenAI, and custom agents are all first-class `Provider` values on
   equal footing.
5. **Everything testable.** No placeholder `"test": "echo ok"` scripts. Unit, integration,
   component, e2e, and accessibility tests are real, run in CI, and gate merges.

## 2. Technology stack

| Concern            | Choice                                                                      | Why                                                                                                        |
| ------------------ | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Framework          | Next.js 15 (App Router)                                                     | Server Components, streaming, ISR/SSG for template pages, edge-ready                                       |
| Language           | TypeScript (strict mode)                                                    | No `any`, no implicit returns, compiler is a linter                                                        |
| Styling            | Tailwind CSS v4                                                             | Utility-first, themeable via CSS variables (white/blue theme + dark mode)                                  |
| Components         | shadcn/ui (owned, not a dependency)                                         | Copy-in primitives we control and can restyle — no black-box design system                                 |
| Motion             | Framer Motion                                                               | Page transitions, hero animation, command palette open/close, skeleton fades                               |
| Validation         | Zod                                                                         | Single source of truth for template frontmatter, form input, API boundaries                                |
| Data fetching      | React Query (TanStack Query)                                                | Client-side cache for search/filter state, optimistic bookmarking (future)                                 |
| Content            | MDX + Content Collections (Velite)                                          | Type-safe content layer: `.md`/`.mdx` + frontmatter → typed, validated, tree-shaken JSON at build time     |
| Search             | Local search index (FlexSearch) + URL-synced filters                        | No external search SaaS required for core search to work                                                   |
| Testing            | Vitest (unit/component), Playwright (e2e + a11y via `@axe-core/playwright`) | Real coverage, real CI gates                                                                               |
| Quality            | ESLint, Prettier, Husky, lint-staged                                        | Enforced pre-commit and in CI, not just documented                                                         |
| CI/CD              | GitHub Actions                                                              | Lint, typecheck, test, build, Lighthouse CI, CodeQL, preview deploys                                       |
| Package management | pnpm workspaces (monorepo)                                                  | `apps/web`, `packages/content`, `packages/ui`, `packages/config` as isolated, independently testable units |

Every one of these is a plain, self-hostable choice. There is no required external account
to develop, build, test, or run the app locally.

## 3. Monorepo layout

```
ai-template/
├── apps/
│   └── web/                        # The Next.js application
│       ├── app/                    # App Router routes (Server Components by default)
│       │   ├── (marketing)/        # Landing page, about, docs index
│       │   ├── templates/
│       │   │   ├── page.tsx        # Library / browse view
│       │   │   └── [slug]/page.tsx # Template detail page
│       │   ├── categories/[slug]/page.tsx
│       │   ├── providers/[slug]/page.tsx
│       │   ├── search/page.tsx
│       │   ├── api/                # Route handlers (sitemap, rss, og-image, health)
│       │   └── layout.tsx
│       ├── components/             # App-specific composed components (not primitives)
│       ├── features/               # Feature-sliced modules (search, filters, command-palette,
│       │                           #   bookmarks, playground, comparison)
│       ├── hooks/                  # Shared React hooks
│       ├── lib/                    # Client/server utilities (non-React)
│       ├── styles/                 # Tailwind config, globals, theme tokens
│       ├── types/                  # App-local types
│       ├── constants/              # Enums: providers, categories, difficulty levels
│       ├── server/                 # Server-only modules (data access, cache tags)
│       └── public/                 # Static assets
├── packages/
│   ├── ui/                         # shadcn/ui primitives + design tokens, framework-agnostic
│   ├── content/                    # Content Collections config + Zod schemas + MDX pipeline
│   ├── config/                     # Shared eslint/tsconfig/tailwind presets
│   └── validation/                 # Zod schemas shared by content, forms, and API routes
├── content/
│   └── templates/
│       └── {provider-or-generic}/{category}/{template-slug}/
│           ├── template.mdx        # Body: description, examples, best practices, prompt
│           └── meta.json           # Structured metadata (validated against schema)
├── docs/                           # Docusaurus-free, MDX-based docs rendered by apps/web
├── .github/
│   ├── workflows/                  # ci.yml, lighthouse.yml, codeql.yml, release.yml, preview.yml
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
├── tests/
│   ├── e2e/                        # Playwright specs
│   └── a11y/                       # Automated accessibility specs
├── scripts/                        # TS scripts: validate-content, generate-index, new-template
├── roadmap.md
├── architecture.md
└── implementation-phases.md
```

Rationale for the monorepo split: `packages/content` and `packages/ui` must be independently
unit-testable and reusable if we ever ship a CLI or a VS Code extension later without dragging
in all of Next.js.

## 4. Content system

### 4.1 Authoring format

Each template is a directory, not a single file — this scales better than the inspiration
project's flat `{type}/{category}/{name}.md` once a template needs multiple examples, images,
or a changelog:

```
content/templates/cursor/frontend/react-server-components/
├── template.mdx
├── meta.json
└── CHANGELOG.md
```

`meta.json` (validated by `packages/validation/template.schema.ts`, a Zod schema):

```ts
export const TemplateMeta = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(3).max(80),
  description: z.string().min(20).max(240),
  author: z.object({
    name: z.string(),
    url: z.string().url().optional(),
    github: z.string().optional(),
  }),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  compatibility: z
    .array(
      z.enum([
        "claude-code",
        "cursor",
        "openai",
        "gemini",
        "copilot",
        "windsurf",
        "codex",
        "aider",
        "cline",
        "roo-code",
        "continue-dev",
        "custom",
      ]),
    )
    .min(1),
  tags: z.array(z.string()).max(12),
  category: z.string(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  license: z.string(), // SPDX identifier
  useCases: z.array(z.string()),
  bestPractices: z.array(z.string()).optional(),
  limitations: z.array(z.string()).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
```

`template.mdx` frontmatter is intentionally thin (title + description for the MDX renderer);
all structured metadata lives in `meta.json` so it can be validated, indexed, and queried
without parsing MDX ASTs.

### 4.2 Build-time pipeline

1. **Content Collections (Velite)** walks `content/templates/**`, parses `meta.json` +
   `template.mdx`, validates every entry against `TemplateMeta`, and fails the build on any
   violation — with the offending file path and the exact Zod error, not a silent skip.
2. Output is a typed `.content-collections/` cache: `templates: Template[]`, fully typed,
   imported directly (`import { templates } from "content-collections"`) — no runtime JSON
   fetch, no hydration mismatch risk.
3. A generated **search index** (FlexSearch, tokenized on title/description/tags/category)
   is built once at build time and served as a static asset chunked by provider — mirroring
   the inspiration project's "split payload" idea, but generated by the same TS pipeline
   instead of a separate Python script.
4. Categories, providers, and difficulty facets are **derived from content**, not hand-maintained
   lists — adding a template with a new tag automatically surfaces it in the filter sidebar.
5. `scripts/validate-content.ts` runs the same validation standalone in CI (`pnpm validate:content`)
   so a PR that only touches `content/` still gets a fast, isolated check.

### 4.3 Authoring workflow

`pnpm new:template` runs an interactive TS script (`scripts/new-template.ts`) that scaffolds
the directory, pre-fills `meta.json` from prompts, and opens the MDX file — removing the
copy-paste-and-edit-and-hope-it-validates friction.

## 5. Rendering & data flow

- **Server Components by default.** Template list/detail pages are RSC; content is read at
  build time from the Content Collections cache (SSG) for public templates, with ISR for any
  future dynamically-added community templates (Phase-future, see §7).
- **Client Components** are scoped to interactive leaves only: command palette, filter sidebar,
  copy-to-clipboard button, theme toggle, playground input. This keeps the JS bundle minimal
  and Lighthouse Performance scores high.
- **Search & filters** run client-side against the prebuilt FlexSearch index for instant
  (sub-frame) results with zero network round-trip; the current query/filter state is
  synced to the URL (`?q=&provider=&category=&difficulty=&sort=`) via `nuqs`, so results are
  shareable, back-button-safe, and SSR-hydratable on first load.
- **React Query** manages any client state that _does_ need a network call (future: ratings,
  comments, saved collections) with cache invalidation and optimistic updates — kept out of
  the critical path for template browsing itself.

## 6. Design system

- `packages/ui` hosts shadcn/ui primitives (Button, Card, Dialog, Command, Sheet, Skeleton,
  Tooltip, Badge, Tabs) restyled to the brand: white surface, blue (`--brand-500`) accent,
  generous spacing scale (`4/6/8/12/16/24` rem steps), soft shadows (`shadow-sm`/`shadow-md`
  with low-opacity blue-tinted shadow color instead of pure black), large radii (`--radius: 0.75rem`+).
- Theme tokens are CSS variables consumed by Tailwind (`@theme` in Tailwind v4) so dark mode
  is a `data-theme` attribute swap, not a duplicated component tree.
- Motion primitives (`packages/ui/motion.ts`) wrap Framer Motion with the project's standard
  easing/duration so every page transition, skeleton fade, and modal open feels consistent
  instead of ad hoc per component.
- Command palette (`cmdk` + shadcn `Command`) is global, keyboard-triggered (`⌘K` / `Ctrl+K`),
  and is the single entry point for search, navigation, and theme toggling — addressing the
  inspiration project's lack of any keyboard-first UX.

## 7. Extensibility seams (future-ready, not built yet)

These are **interfaces defined now, implemented later**, so Phase 3–6 code never has to be
rewritten to accommodate them:

- `AuthProvider` interface — swappable (NextAuth/Auth.js by default; Clerk/Supabase Auth as
  drop-in alternatives) so self-hosters aren't forced into a vendor.
- `AnalyticsSink` interface — a no-op implementation ships by default; Plausible/PostHog/
  Supabase are opt-in adapters behind an env flag, never a hard dependency.
- `CommunityContentProvider` — defines how a future "submit a template" flow, voting, and
  comments plug into the same `Template` type used for built-in content, so community and
  first-party templates render through one code path.
- Marketplace/versioning: `meta.json`'s `version` + `CHANGELOG.md` per template already model
  the data future "install this exact version" tooling needs — no schema migration required
  to add it later.

## 8. Testing strategy

| Layer         | Tool                     | What it covers                                                                                      |
| ------------- | ------------------------ | --------------------------------------------------------------------------------------------------- |
| Unit          | Vitest                   | Zod schemas, utils, search index builder, content pipeline                                          |
| Component     | Vitest + Testing Library | Interactive components (filters, command palette, copy button) in isolation                         |
| Integration   | Vitest                   | Content Collections build against fixture templates (valid + intentionally invalid)                 |
| E2E           | Playwright               | Golden paths: search → filter → open template → copy prompt; command palette flow; dark mode toggle |
| Accessibility | Playwright + axe-core    | Automated WCAG 2.1 AA checks on every route in CI                                                   |
| Performance   | Lighthouse CI            | Budget-enforced (fail under 95) on PR preview deploys                                               |

## 9. CI/CD pipeline (GitHub Actions)

1. `ci.yml` — install (cached pnpm store) → typecheck → lint → unit/component tests →
   content validation → build → Playwright e2e against the built app.
2. `lighthouse.yml` — runs against the Vercel/preview URL on every PR, comments scores.
3. `codeql.yml` — weekly + on PR for JS/TS.
4. `dependabot.yml` / Renovate — grouped, auto-merged patch updates for low-risk deps.
5. `release.yml` — on tag push, generates changelog from Conventional Commits, publishes a
   GitHub Release.
6. Branch protection requires: typecheck, lint, unit, e2e, content-validation, and Lighthouse
   budget checks green before merge.

## 10. SEO & performance

- Static generation for all template/category/provider pages; `generateMetadata` per route for
  title/description/OpenGraph/Twitter cards; `generateStaticParams` for every template slug.
- `app/sitemap.ts` and `app/robots.ts` generated from the same Content Collections data used to
  render pages — cannot drift from what's actually published, unlike a hand-maintained
  `sitemap.xml`.
- `app/feed.xml/route.ts` RSS feed for "recently added/updated templates."
- JSON-LD structured data (`SoftwareSourceCode`/`TechArticle`) per template page.
- Image optimization via `next/image`; font optimization via `next/font` (self-hosted, no
  render-blocking Google Fonts request).

---

See `roadmap.md` for the comparative audit this design responds to, and
`implementation-phases.md` for the ordered execution plan.
