# gencal

Generates a simple month calendar in SVG format.

I use this tool to generate calendars to pull into [draw.io](https://draw.io) to plan out upcoming deployments.

> Disclaimer: To expedite the process, most of the original code was generated using ChatGPT and GitHub Copilot.

## Example

<img src="calendar.svg" alt="Example SVG calendar"/>

## Usage

### Online

Calendar for the current month:
<https://gencal.notnot.uk/>

Calendar for a specific month (`/<year>/<month>`):
<https://gencal.notnot.uk/2023/5>

## Implementation

gencal is a [TypeScript](https://www.typescriptlang.org/) [Cloudflare Worker](https://developers.cloudflare.com/workers/).
It has no runtime dependencies — the SVG is generated as a string.

## Run locally

This project uses [mise](https://mise.jdx.dev/) to manage the toolchain (Node +
[pnpm](https://pnpm.io/)) and pnpm to manage dependencies.

```bash
mise install   # installs the pinned Node and pnpm
pnpm install   # installs dependencies
pnpm dev       # runs the Worker locally via wrangler
```

Then open <http://localhost:8787/> for the current month, or
<http://localhost:8787/2023/5> for a specific month.

Run the tests and typecheck:

```bash
pnpm test
pnpm typecheck
```

## Deploy

Manual deploy to Cloudflare (a `*.workers.dev` URL):

```bash
pnpm exec wrangler login    # one-time, opens browser OAuth
pnpm deploy                 # wrangler deploy
```

## Project layout

| Path               | Purpose                                                       |
| ------------------ | ------------------------------------------------------------- |
| `src/index.ts`     | Worker entry point — routing, errors, caching.                |
| `src/calendar.ts`  | Core module that builds the SVG calendar string.              |
| `test/`            | vitest unit tests.                                            |
| `wrangler.jsonc`   | Cloudflare Worker configuration.                              |
| `archive/`         | Legacy code/tooling, kept for reference (incl. the original Python app). See its [README](archive/README.md). |
