# ADR 0003: Owned shadcn/ui primitives in `packages/ui`, not a component library dependency

- Status: Accepted
- Date: 2026-07-22

## Context

The inspiration project assembles UI ad hoc per Astro/React page with no documented shared
primitive layer (`roadmap.md` §3.2 #6). We want a consistent, premium visual language (white
theme, blue accents, large spacing, soft shadows, large radii) across every surface.

## Decision

Copy shadcn/ui primitives into `packages/ui` as owned source (the shadcn model — components
are generated into your repo, not installed as an opaque dependency), restyled to our theme
tokens, wrapped with shared Framer Motion presets.

## Rationale

- Owned source means we can restyle, extend, or strip parts of a primitive without fighting a
  dependency's API surface or waiting on upstream releases.
- shadcn/ui's primitives are themeable via CSS variables, which maps directly onto our
  Tailwind v4 `@theme` token strategy and dark-mode-via-`data-theme` approach.
- Rejected alternatives: MUI/Chakra (heavier runtime, harder to restyle to a bespoke brand),
  building every primitive from scratch (unnecessary — shadcn's accessibility and composition
  patterns, built on Radix primitives, are already solid).

## Consequences

- `packages/ui` needs its own lint/test/build config and a `/dev/components` preview route
  (Phase 4) so every primitive is visually reviewable in isolation.
- Upstream shadcn changes must be manually ported if wanted — accepted tradeoff for full
  control.
