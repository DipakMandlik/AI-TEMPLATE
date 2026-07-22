# AI-TEMPLATE

> The world's best AI Prompt & AI Agent Template Library — a production-grade, multi-provider
> collection of templates for Claude Code, Cursor, Copilot, Windsurf, Codex, Aider, Cline, Roo
> Code, Continue.dev, Gemini, OpenAI, and custom agents.

**Status:** Foundation phase (Phase 3 of `implementation-phases.md`). The design system,
template catalog, and search haven't landed yet — see the roadmap for what's coming.

## Why this project exists

See [`roadmap.md`](./roadmap.md) for the full vision and a direct, evidence-based comparison
against the inspiration project. In short: this is not a fork or a clone — it's a
ground-up rebuild that fixes the architectural and product gaps found in that audit
(no automated tests, a mixed Python/Node toolchain, agent-reviewed instead of schema-validated
content, mandatory third-party SaaS coupling, and no owned design system).

## Documentation

- [`roadmap.md`](./roadmap.md) — vision, competitive audit, feature roadmap
- [`architecture.md`](./architecture.md) — technology stack, monorepo layout, content system
- [`implementation-phases.md`](./implementation-phases.md) — the phased execution plan
- [`docs/adr/`](./docs/adr/) — architecture decision records

## Getting started

Requirements: Node.js 20.9+ and [pnpm](https://pnpm.io) 9+.

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

Other useful scripts (see `package.json`):

```bash
pnpm build      # production build of apps/web
pnpm test       # unit + component tests (Vitest) across every package
pnpm test:e2e   # end-to-end tests (Playwright)
pnpm lint       # ESLint
pnpm typecheck  # tsc --noEmit across every package
pnpm format     # Prettier, writes changes
```

## Project structure

```
apps/web/            Next.js application (App Router)
packages/ui/          Owned design-system primitives (shadcn/ui-based)
packages/content/     Template content pipeline
packages/validation/  Shared Zod schemas
packages/config/      Shared TypeScript config and Tailwind theme tokens
content/templates/    The template catalog itself (Phase 5)
tests/e2e/            Playwright end-to-end specs
docs/adr/             Architecture decision records
```

## Contributing

Contribution guides land in Phase 7. Until then, see `implementation-phases.md` for what's
being worked on and in what order — please open an issue before starting substantial work so
it isn't duplicated.

## License

[MIT](./LICENSE)
