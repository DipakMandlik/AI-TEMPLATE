# ADR 0001: Use pnpm workspaces (no Turborepo/Nx) for the monorepo

- Status: Accepted
- Date: 2026-07-22

## Context

The project needs `apps/web` plus several internal packages (`ui`, `content`, `config`,
`validation`) that must be independently testable and importable without publishing to npm.

## Decision

Use plain **pnpm workspaces** (`pnpm-workspace.yaml`), not Turborepo or Nx.

## Rationale

- At this project's size (one app, four internal packages), a task-graph orchestrator adds
  configuration surface without solving a problem we have yet — pnpm's own `-r`/`--filter`
  flags and workspace `catalog:` protocol cover install, build, and test ordering.
- Fewer tools to onboard a new contributor to: `pnpm install` and `pnpm -w <script>` is the
  entire mental model.
- Revisit if/when the build graph grows enough that remote caching or affected-package
  detection becomes a real bottleneck (tracked as a future ADR, not a present concern).

## Consequences

- CI must manually order `build`/`test` steps per package (acceptable at 4 packages).
- If we outgrow this, Turborepo is a low-friction migration since it layers on top of
  existing pnpm workspaces rather than replacing them.
