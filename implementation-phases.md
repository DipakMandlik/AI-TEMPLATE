# AI-TEMPLATE — Implementation Phases

This is the ordered execution plan. **Phases are not skipped or reordered.** Each phase ends
with a working, reviewable state and a set of small, meaningful commits (Conventional
Commits style: `feat:`, `refactor:`, `perf:`, `docs:`, `test:`, `chore:`) — never one giant
unreviewable commit. Every phase has explicit exit criteria; the next phase does not start
until they're met.

---

## Phase 1 — Planning ✅ (this document set)

**Goal:** Understand before building.

- Clone/inspect `DipakMandlik/AI-TEMPLATE` (confirmed empty — zero commits) and audit
  `davila7/claude-code-templates` (architecture, taxonomy, weaknesses).
- Produce `roadmap.md`, `architecture.md`, `implementation-phases.md`.

**Exit criteria:** All three planning documents committed to
`claude/ai-template-planning-a05bmg`. No application code written yet.

---

## Phase 2 — Architecture

**Goal:** Turn `architecture.md` into concrete, reviewable technical decisions before any
scaffolding exists.

- Finalize monorepo tool: pnpm workspaces (chosen over Turborepo/Nx for lower ceremony at
  this project's size; revisit if build graph complexity grows).
- Finalize content pipeline tool: Velite for Content Collections + MDX.
- Lock the `TemplateMeta` Zod schema (v1) — this is the hardest thing to change later, so it
  gets the most scrutiny now.
- Decide hosting target for previews (Vercel) vs. self-host instructions (Docker/Node).
- Write ADRs (`docs/adr/0001-monorepo-tool.md`, `0002-content-pipeline.md`,
  `0003-design-system.md`, `0004-search-strategy.md`) — short, dated, reversible-decision
  records so future contributors know *why*, not just *what*.

**Exit criteria:** ADRs merged. No open architectural question blocks Phase 3.

---

## Phase 3 — Foundation

**Goal:** A running, empty, fully-tooled app — the "boring" work that makes every later phase
fast.

- `pnpm init` workspace root; `apps/web` (Next.js 15, App Router, TS strict);
  `packages/{ui,content,config,validation}`.
- ESLint + Prettier + Husky + lint-staged wired and passing on an empty app.
- Vitest + Playwright installed with one smoke test each (real assertions, not `expect(true)`).
- GitHub Actions `ci.yml`: install → typecheck → lint → test → build, green on a trivial diff.
- Base Tailwind v4 theme tokens (white/blue palette, spacing scale, radius scale) — no
  components yet, just the design tokens `architecture.md` §6 specifies.
- `.editorconfig`, `CODEOWNERS`, base `README.md` stub (expanded in Phase 7).

**Exit criteria:** `pnpm dev` serves a blank themed page; `pnpm build`, `pnpm test`,
`pnpm lint`, `pnpm typecheck` all pass in CI on every PR.

**Example commits:** `chore: scaffold pnpm workspace and apps/web`,
`chore: configure eslint, prettier, husky, lint-staged`,
`ci: add typecheck/lint/test/build workflow`.

---

## Phase 4 — UI System

**Goal:** The owned design system and premium visual language, built before any real content
exists to render, so every later feature composes existing primitives instead of inventing
new ones.

- Import/restyle shadcn/ui primitives into `packages/ui` (Button, Card, Badge, Dialog, Sheet,
  Tabs, Tooltip, Skeleton, Command).
- Framer Motion wrappers: page-transition, fade-in, stagger-list, skeleton-shimmer.
- Dark mode via `data-theme`, toggle component, system-preference detection.
- Command palette shell (`⌘K`) wired to static nav links first (content-aware search comes in
  Phase 6).
- Landing page v1: hero with animated background, feature cards, "why AI-TEMPLATE" section,
  footer — using real primitives, placeholder copy/stats where content doesn't exist yet.
- Storybook-style component preview route (`/dev/components`) behind a dev-only flag, so
  every primitive is visually reviewable without hunting through app pages.
- Accessibility pass #1: every primitive keyboard-navigable, focus-visible states, axe-core
  test per component.

**Exit criteria:** Landing page renders with real motion/theme/dark-mode; component preview
route shows every primitive; Lighthouse Accessibility ≥ 95 on the landing page; axe-core
component tests green in CI.

---

## Phase 5 — Template Engine

**Goal:** The content system from `architecture.md` §4, made real.

- Implement `TemplateMeta` Zod schema in `packages/validation`.
- Configure Velite in `packages/content` against `content/templates/**`.
- Author 10–15 real, high-quality seed templates across at least 4 providers (Claude Code,
  Cursor, Copilot, custom-agent) and 3 categories, each with full metadata (author, version,
  compatibility, tags, difficulty, license, examples, use cases, best practices, limitations,
  changelog) — enough to prove every schema field renders correctly, not placeholder lorem
  ipsum.
- `scripts/new-template.ts` scaffolding CLI.
- `scripts/validate-content.ts` standalone validation, wired into CI as its own fast job.
- Template list page and template detail page rendering real content via Server Components,
  MDX syntax highlighting (Shiki), copy-to-clipboard, "open in GitHub" link.
- Auto-derived categories/providers/tags feeding the (static, pre-Phase-6) filter sidebar.

**Exit criteria:** `pnpm validate:content` fails loudly on a deliberately broken fixture
template and passes on real content; template detail pages fully render all metadata fields
for every seed template; content-validation CI job is required for merge.

---

## Phase 6 — Search

**Goal:** Enterprise search and filtering, instant and URL-shareable.

- Build-time FlexSearch index generation from Content Collections output, chunked by provider.
- Faceted sidebar: tags, category, provider/framework, LLM, difficulty, popularity (download/
  view proxy), recency — multi-select, instant client-side update.
- URL sync for query + all filters + sort (`nuqs`), back-button-safe, shareable links.
- Saved filters (local storage v1; account-synced later per `architecture.md` §7).
- Command palette upgraded to search real template content, not just static nav.
- "Recently added," "Trending," "Popular" derived views on the library page.

**Exit criteria:** Typing in the command palette or search bar returns results with no network
round-trip; every filter combination is reflected in and restorable from the URL; Playwright
e2e covers search → filter → open-template as a golden path.

---

## Phase 7 — Documentation

**Goal:** Documentation good enough that a new contributor never has to ask a question the
docs should have answered.

- `README.md`: what/why, quickstart, screenshots, badges.
- `docs/getting-started.md`, `docs/architecture.md` (public-facing summary linking back to
  root `architecture.md`), `docs/contributing.md`, `docs/writing-a-template.md`,
  `docs/adding-a-category.md`, `docs/adding-a-provider.md`, `docs/api.md`, `docs/deployment.md`.
- `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`.
- `.github/ISSUE_TEMPLATE/*` (bug report, feature request, new template, new provider),
  `.github/PULL_REQUEST_TEMPLATE.md`.
- GitHub labels defined as code (`.github/labels.yml` + sync action).
- Docs pages rendered through the same MDX pipeline as templates — dogfooding the content
  system rather than a separate docs stack.

**Exit criteria:** A contributor can go from `git clone` to an opened PR adding a new template
using only the docs, with no undocumented step (validated by having a fresh agent or reviewer
follow the docs literally in Phase 8/9 QA).

---

## Phase 8 — Testing

**Goal:** Close every gap the inspiration project left open (see `roadmap.md` §3.2 #1).

- Unit: Zod schemas (valid + invalid fixtures), utils, search index builder.
- Component: every interactive primitive and feature component (filters, command palette,
  copy button, theme toggle, bookmark button) via Vitest + Testing Library.
- Integration: Content Collections build against fixture templates, including intentionally
  malformed ones (must fail).
- E2E (Playwright): search → filter → open template → copy prompt; command palette full flow;
  dark-mode toggle persists across reload; template comparison flow.
- Accessibility: axe-core scan on every route in CI, zero serious/critical violations allowed.
- Coverage thresholds enforced in CI (not just aspirational): meaningful minimums per package,
  tuned per package type rather than one global number.

**Exit criteria:** All test types green in CI; CI fails the build if coverage drops below the
configured threshold; no test is skipped/`.only`'d in the committed suite.

---

## Phase 9 — Optimization

**Goal:** Lighthouse 100 across Performance/Accessibility/Best-Practices/SEO, for real,
measured — not asserted.

- Bundle analysis (`@next/bundle-analyzer`); code-split anything not needed for first paint.
- Image optimization audit (`next/image` everywhere, correct `sizes`, AVIF/WebP).
- Font optimization audit (`next/font`, subset, no layout shift).
- Caching headers / `revalidate` tuning for static template pages.
- Dynamic imports for command palette, playground, and comparison view (below-the-fold /
  interaction-gated features).
- Prefetching tuned for `<Link>` hover/viewport intent on the library page.
- Full SEO pass: `sitemap.ts`, `robots.ts`, RSS feed, OpenGraph/Twitter card generation per
  template, JSON-LD structured data, canonical URLs.
- Lighthouse CI wired into the PR workflow with a hard budget (fail under 95, target 100) so
  regressions are caught before merge, not after.

**Exit criteria:** Lighthouse CI reports 100/100/100/100 (or documented, justified exceptions)
on the landing page, library page, and a representative template page, on every PR going
forward.

---

## Phase 10 — Release

**Goal:** Ship it as a project other people can immediately use and contribute to.

- Semantic versioning; `release.yml` generates changelog from Conventional Commits and cuts a
  GitHub Release on tag push.
- `CHANGELOG.md` seeded from the commit history of Phases 3–9.
- Production deploy (Vercel or self-host Docker instructions verified end-to-end).
- Final README pass: badges (CI, coverage, license, Lighthouse), screenshots/GIF of the command
  palette and library, comparison callout vs. the inspiration project's strengths (fair,
  factual, not disparaging).
- Announce-ready assets: OpenGraph image for the repo/site, short demo GIF.
- Post-release checklist: Dependabot/Renovate active, CodeQL active, branch protection rules
  active, issue/PR templates active, first "good first issue" batch labeled for new
  contributors.

**Exit criteria:** A clean `git clone` → `pnpm install` → `pnpm dev` works with zero manual
config on a contributor's machine; the repository is publicly presentable as v1.0.0.

---

## Cross-cutting rules for every phase

- **Small commits.** Each commit is one logical change, buildable and (where applicable)
  passing tests on its own.
- **No phase skipping.** If Phase 6 reveals an architecture gap, we patch `architecture.md`
  and note it, we don't silently improvise past it.
- **No TODOs left in committed code.** A TODO means the phase isn't done; either finish it or
  file a tracked issue and reference the issue number, never a bare comment.
- **Every PR** includes: summary, screenshots (UI changes), architecture notes (if
  structural), performance impact (if Phase 9+), testing completed, breaking changes, and a
  checklist — per the user's PR quality bar.
