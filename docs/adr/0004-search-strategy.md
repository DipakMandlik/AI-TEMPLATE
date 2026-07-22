# ADR 0004: Client-side FlexSearch index, URL-synced filters, no search SaaS

- Status: Accepted
- Date: 2026-07-22

## Context

Enterprise search/filter requirements (tags, category, provider, LLM, difficulty, popularity,
recency) must be instant and must not require an external service to work, per the
zero-SaaS-core constraint in `architecture.md` §1.

## Decision

Build a static **FlexSearch** index at build time from Content Collections output, chunked by
provider; run search/filtering entirely client-side; sync query + filter + sort state to the
URL via `nuqs`.

## Rationale

- The catalog size at any realistic scale for this project (hundreds, not millions, of
  templates) fits comfortably in a client-side index — no Algolia/Elasticsearch/Typesense
  account needed for core search to work, unlike a hosted-search dependency.
- URL-synced state makes every search/filter combination shareable and back-button-safe for
  free, and is SSR-hydratable on first load (server reads the URL, renders matching results
  before any client JS runs).
- Chunking the index by provider mirrors the inspiration project's "split payload" idea
  (`roadmap.md` §3.3) without a separate Python generation script — it's one step in the same
  TypeScript content pipeline (ADR 0002).

## Consequences

- If the catalog grows enough that the client-side index becomes too large to ship
  performantly, the fallback is a server-side search route handler over the same Content
  Collections data — no schema change required, since the index is generated from data we
  already have typed.
- Popularity/recency facets need a lightweight, privacy-respecting counter (future phase,
  behind the `AnalyticsSink` interface in `architecture.md` §7) rather than a hard dependency
  on a specific analytics vendor.
