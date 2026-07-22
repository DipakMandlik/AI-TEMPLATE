# ADR 0002: Velite for the content pipeline, Zod as the schema layer

- Status: Accepted
- Date: 2026-07-22

## Context

Templates are authored as MDX + `meta.json`. We need build-time validation, typed output, and
no second-language toolchain (see `roadmap.md` §3.2 #2 — the inspiration project bolts a
Python script onto a Node project for this exact job).

## Decision

Use **Velite** for the Content Collections layer, with **Zod** schemas (shared from
`packages/validation`) as the single source of truth for what a valid template looks like.

## Rationale

- Velite is TypeScript-native, integrates with Next.js via a build-time codegen step, and
  produces fully typed, tree-shaken output (`import { templates } from "content-collections"`)
  — no runtime JSON fetch, no hydration mismatch risk.
- Reusing the same Zod schema for content validation, form input (future contribution UI),
  and API boundaries means one definition of "valid template," not three.
- Rejected alternatives: Contentlayer (unmaintained), a hand-rolled `fs`-walking script (loses
  typed output and caching), MDX-only frontmatter without a separate `meta.json` (harder to
  validate independent of MDX parsing).

## Consequences

- Every content author needs `meta.json` + `template.mdx`, not a single flat file — slightly
  more ceremony per template than the inspiration project's flat `.md`, in exchange for
  structured, independently-parseable metadata and per-template supporting files
  (`CHANGELOG.md`, images) without overloading one file.
- `scripts/validate-content.ts` must be kept in sync with the Velite config so `pnpm
  validate:content` can run standalone in CI without a full Next.js build.
