# gencal — Context

## What this is

`gencal` generates a simple month calendar as an **SVG** image, served over HTTP.
The primary use case is dropping the generated calendar into [draw.io](https://draw.io)
to plan out upcoming deployments.

v2 is a TypeScript rewrite running as a **Cloudflare Worker**. The original
Python/Flask implementation is kept under `archive/` for reference. See
`docs/prd-gencal-v1-typescript.md` for the v1 scope (strict parity with the
Python app).

## Glossary

Use these terms consistently in issues, tests, commits, and code.

- **Calendar** — the SVG document produced for a single month. Not a stateful
  data structure; it is generated on each request and returned as the response.
- **Month grid** — the 7-column × N-row layout of day cells for a given month.
  Derived from the year/month. **Monday-first** week ordering (carried over from
  Python's `calendar.monthcalendar`; JS `Date` is Sunday-first by default and is
  adjusted in the port).
- **Cell** — one square in the grid. Either a **header cell** (weekday name, top
  row) or a **day cell** (a day number, or empty for padding days outside the
  month).
- **Weekend shading** — Saturday/Sunday day cells (grid columns 5–6) are shaded
  light grey at `opacity="0.3"`.
- **Title** — the bold, centered "{Month} {Year}" heading above the grid.
- **Current-month route** (`GET /`) — returns the Calendar for the month in which
  the request is served. Time-sensitive; never cached (`no-store`).
- **Dated route** (`GET /<year>/<month>`) — returns the Calendar for an explicit
  month. Accepts padded and unpadded month (`/2023/5`, `/2023/05`). Immutable, so
  cached aggressively.
- **Parity** — for v1, "visually equivalent" output (same layout/styling, not
  necessarily byte-identical XML) and **exact** behavioral parity for status
  codes and error message strings.

## Error contract (parity)

- Invalid year/month (out of range or non-numeric) → `400` body `Invalid year or month`.
- Unknown route → `404` body `Sorry, this page doesn't exist.`
- Plain-text bodies only (no JSON).

## Layout

- Worker source at repo root (`src/`).
- `archive/` — superseded reference code (Docker, Azure, CLI, and the original
  Python app). Deprecated; see `archive/README.md`.
- `docs/` — PRD and `docs/agents/` config for engineering skills.
