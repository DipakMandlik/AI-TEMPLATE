# ADR 0002: Velite for the content pipeline, Zod as the schema layer

- Status: Accepted (amended)
- Date: 2026-07-22 (amended 2026-07-22, Phase 5)

## Context

Templates need build-time validation, typed output, and no second-language toolchain (see
`roadmap.md` §3.2 #2 — the inspiration project bolts a Python script onto a Node project for
this exact job).

## Decision

Use **Velite** for the Content Collections layer, with **Zod** schemas (shared from
`packages/validation`) as the single source of truth for what a valid template looks like.
Each template is authored as a single `template.mdx` file with YAML frontmatter — see
**Amendment** below for why this replaced the original two-file design.

## Rationale

- Velite is TypeScript-native, integrates with Next.js via a build-time codegen step (`velite
build` / `velite dev`, run as a plain CLI process — no coupling to Turbopack vs. webpack),
  and produces fully typed, tree-shaken output (`import { templates } from
"#content"`) — no runtime JSON fetch, no hydration mismatch risk.
- Reusing the same Zod schema for content validation, form input (future contribution UI),
  and API boundaries means one definition of "valid template," not three.
- Rejected alternatives: Contentlayer (unmaintained), a hand-rolled `fs`-walking script (loses
  typed output and caching).

## Amendment (Phase 5): single-file authoring, not `meta.json` + `template.mdx`

The original version of this ADR specified a two-file layout — `meta.json` for structured
metadata plus `template.mdx` for prose — reasoning that JSON metadata needed to be
"independently parseable without parsing MDX ASTs." Implementing the pipeline surfaced that
this reasoning doesn't hold: Velite parses YAML frontmatter into the typed, validated object
_before_ touching the MDX body at all — frontmatter is never part of the MDX AST, and Velite's
compiled output already gives every consumer a plain typed object without them needing to walk
anything. The second file bought no real capability, only extra ceremony per template with no
offsetting benefit. Frontmatter supports the same nested arrays/objects (examples, changelog
entries) that JSON does.

**Revised layout:**

```
content/templates/{provider-or-generic}/{category}/{template-slug}.mdx
```

One file per template: YAML frontmatter for every structured field (author, version,
compatibility, tags, category, difficulty, license, useCases, bestPractices, limitations,
examples, changelog), MDX body for the long-form overview and the actual prompt content.
`architecture.md` §4 is updated to match.

## Consequences

- Simpler authoring (one file, not two) and a smaller Velite config surface.
- `scripts/validate-content.ts` must be kept in sync with the Velite schema so `pnpm
validate:content` can run standalone in CI without a full Next.js build.
- A future template needing large supporting assets (images, a multi-file example project)
  gets a sibling folder only when it actually needs one — not by default.
