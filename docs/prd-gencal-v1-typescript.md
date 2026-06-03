# PRD — gencal v1 (TypeScript Cloudflare Worker)

## Summary

Port the existing Python/Flask `gencal` app to a TypeScript Cloudflare Worker.
The goal of v1 is to **prove the concept** — that gencal can run on Cloudflare —
at strict feature parity with the current Python app. No new features. v1 is a
foundation we can refactor toward a final shape later.

## Background

`gencal` generates a simple month calendar as an SVG, used to drop into draw.io
for planning deployments. The current implementation is a Flask app (`app.py`)
backed by a core module (`gencal.py`) that builds the SVG with `svgwrite`.

Flask is a WSGI framework and doesn't map onto the Cloudflare Workers runtime,
and the `svgwrite` dependency is unnecessary (SVG is just string building). The
native, mature Cloudflare runtime is JS/TS (V8 isolates), so v1 is a TypeScript
rewrite with effectively zero runtime dependencies.

## Goals

- Serve the same SVG calendar over the same two routes from a Cloudflare Worker.
- Visual parity with the current calendar output.
- Exact behavioural parity for errors and input handling.
- Deployed and reachable on a `workers.dev` URL.

## Non-goals (deferred to a later version)

- Custom domain cutover (`gencal.notnot.ninja` stays on the old deploy).
- CI/CD pipeline (manual deploy only for v1).
- Linting/formatting tooling (Biome) — typecheck only.
- Route-level integration tests — unit tests only.
- Any new features: themes/colors, configurable size, week-start option,
  PNG/PDF output, query-param customization, an index/landing page, year-only
  or range views.
- Rich error responses (e.g. JSON) — plain-text parity only.
- Caching strategy beyond the simple dated-routes rule below.
- Observability/logging, rate limiting, analytics.

## Functional requirements

### Routes

| Route             | Behaviour                                                   |
| ----------------- | ---------------------------------------------------------- |
| `GET /`           | SVG for the **current** month.                            |
| `GET /<year>/<month>` | SVG for the specified month. Accepts padded and unpadded month (`/2023/5` and `/2023/05`). |

Response content type: `image/svg+xml`.

### Visual output (parity)

Port the constants and layout from `gencal.py` so the output is **visually
equivalent** (not necessarily byte-identical XML):

- 7-column grid, **Monday-first** week ordering (matches Python's
  `calendar.monthcalendar`). Note: JS `Date` is Sunday-first by default and must
  be adjusted in the port.
- Weekday header row (bold), bold centered month + year title.
- Cell size 90px, header height 20px, Arial font, black text.
- Weekends (Sat/Sun, columns 5–6) shaded light grey at `opacity="0.3"`.

### Error handling (exact parity)

| Condition                          | Status | Body                              |
| ---------------------------------- | ------ | --------------------------------- |
| Invalid year/month (out of range or non-numeric, e.g. `/2023/13`, `/abc/def`) | 400 | `Invalid year or month`           |
| Unknown route (e.g. `/foo/bar/baz`)| 404    | `Sorry, this page doesn't exist.` |

### Caching

- `GET /<year>/<month>` → `Cache-Control: public, max-age=31536000, immutable`
  (a dated month never changes).
- `GET /` → `Cache-Control: no-store` (current month must not go stale across a
  month rollover).

## Technical requirements

- **Runtime:** Cloudflare Worker, TypeScript, `strict` mode.
- **Dependencies:** none required at runtime (SVG is built as strings).
- **Structure:** Worker at repo root (`src/`, `wrangler.toml`, `package.json`).
- **Toolchain:** Node (LTS) and pnpm managed via `mise`; `uv`/Python remain for
  the archived reference app.
- **Testing:** minimal **unit tests (vitest)** on the pure logic — the date-grid
  builder and SVG output for known months (e.g. May 2023), covering Monday-first
  ordering, leap years, and short months.
- **Quality gate:** `tsc --noEmit` typecheck (no linter in v1).
- **Deploy:** manual `pnpm wrangler deploy` to `workers.dev` (after
  `wrangler login`).

## Migration / housekeeping

- Keep `app.py` and `gencal.py` at the repo root during the port for reference.
- Once the Worker reaches parity, move them to `archive/python/` (preserving git
  history), consistent with the existing `archive/` convention.
- Update `README.md` to document the Worker run/deploy flow.

## Acceptance criteria

- [ ] `GET /` returns a valid SVG (`image/svg+xml`) for the current month.
- [ ] `GET /<year>/<month>` returns a valid SVG for the requested month, padded
      or unpadded.
- [ ] Output is visually equivalent to the current Python calendar (Monday-first,
      weekend shading, title, ported constants).
- [ ] Invalid input returns `400 Invalid year or month`.
- [ ] Unknown routes return `404 Sorry, this page doesn't exist.`
- [ ] Dated routes send the immutable cache header; `/` sends `no-store`.
- [ ] Unit tests pass and cover Monday-first ordering, a leap-year February, and
      a 31-day month.
- [ ] `tsc --noEmit` passes under strict mode.
- [ ] Deployed and reachable on a `workers.dev` URL.
- [ ] `app.py`/`gencal.py` moved to `archive/python/`.

## Deferred backlog (post-v1)

- Custom domain cutover + CI/CD deploy pipeline.
- Biome lint/format; route-level integration tests.
- Visual/feature refactor: themes, sizing, configurable week-start, output
  formats, landing page.
