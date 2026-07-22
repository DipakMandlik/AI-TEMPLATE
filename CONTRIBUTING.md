# Contributing to AI-TEMPLATE

Thanks for considering a contribution. This file is the quick reference GitHub
surfaces on issues and PRs; the full contributor docs (with more context per
topic) live at [`/docs/contributing`](https://github.com/DipakMandlik/AI-TEMPLATE)
once the site is running locally, or in `content/docs/contributing.mdx` in this
repo.

## Before you start

- **Adding a template?** Check `/templates` in a local `pnpm dev` first to avoid
  duplicating an existing one, then go straight to `content/docs/writing-a-template.mdx`
  (rendered at `/docs/writing-a-template`) — most template PRs don't need an issue
  opened first.
- **Anything larger** — a new feature, an architecture change, a new provider —
  open an issue first so the approach can be discussed before you invest time in
  an implementation.

## Local setup

```sh
pnpm install
pnpm dev
```

Requires Node >=20.9 and pnpm >=9 (see `engines` in `package.json`). The app runs
at `http://localhost:3000`.

## Making changes

1. Create a branch off `main`: `git checkout -b feat/short-description`.
2. Make your change. Keep commits small and focused — one logical change per commit.
3. Follow [Conventional Commits](https://www.conventionalcommits.org/) for commit
   messages: `feat: ...`, `fix: ...`, `docs: ...`, `content: ...` (template
   additions), `test: ...`, `refactor: ...`, `chore: ...`.
4. Run the full check before opening a PR:

   ```sh
   pnpm typecheck
   pnpm lint
   pnpm test
   pnpm validate:content
   pnpm build
   ```

   All five are required checks in CI (`.github/workflows/ci.yml`) — running them
   locally first means no surprises.

5. For UI changes, also run `pnpm test:e2e` and actually look at the change in a
   browser (`pnpm dev`) — automated tests catch regressions in behavior, not in
   whether something looks right.

## Pull request checklist

- [ ] `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm validate:content`, and
      `pnpm build` all pass locally
- [ ] New behavior has a test (unit/component for logic, e2e for a user-facing flow)
- [ ] UI changes were checked in a real browser, not just by reading the diff
- [ ] Docs updated if the change affects how something is used (docs site, README,
      or `architecture.md`)
- [ ] Commit messages follow Conventional Commits
- [ ] No unrelated changes bundled into the same PR

## Code style

- TypeScript strict mode — no `any` without a specific reason stated in a comment.
- Prettier formats everything (`pnpm format`); don't hand-format around it.
- No dead code, no commented-out code, no TODOs left in committed code — either
  finish it or file an issue and reference the issue number.
- Prefer composition over configuration flags; prefer editing an existing file
  over adding a new abstraction for a one-off need.

## Project layout

See `architecture.md` at the repo root for the full system design, and
`content/docs/architecture.mdx` for the docs-site version of the same material.

## Code of Conduct

Participation in this project is governed by [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md).
