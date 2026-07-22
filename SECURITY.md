# Security Policy

## Supported Versions

AI-TEMPLATE ships as a single rolling `main` branch with no maintained release
branches yet (see `roadmap.md` for the versioning plan). Security fixes land on
`main`; there is currently nothing older to backport to.

## Reporting a Vulnerability

Please **do not** open a public issue for a security vulnerability.

Instead, use GitHub's private reporting channel:

1. Go to the [Security tab](https://github.com/DipakMandlik/AI-TEMPLATE/security/advisories/new)
   of this repository.
2. Click **"Report a vulnerability"** and describe the issue, including steps to
   reproduce and, if possible, the affected file(s).

You should expect an initial response within a few days. If the report is
confirmed, we'll work with you on a fix and coordinate disclosure timing before
any public advisory is published.

## Scope

AI-TEMPLATE is a static content site (Next.js, statically generated at build
time) with no backend, no database, no authentication, and no server-side
secrets — see `architecture.md` §1 for the zero-SaaS-core constraint. In scope
for reports:

- Cross-site scripting via the MDX rendering pipeline (`content/**/*.mdx` →
  `apps/web/components/mdx-content.tsx`), e.g. a way for template/doc content to
  execute arbitrary script beyond the sanctioned MDX component set
- Supply-chain issues in the build (`.github/workflows/ci.yml`, Dependabot
  config, dependency confusion)
- Any way client-side state (URL params, `localStorage` saved filters) could be
  abused to inject content into the page outside of React's normal escaping

Out of scope: since there's no user data, no auth, and no server, reports about
missing rate limiting, account takeover, or server-side injection don't apply
to the current architecture — they'll be closed as not applicable unless the
report demonstrates otherwise.
