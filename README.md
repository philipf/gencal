# gencal

Generates a simple month calendar in SVG format.

I use this tool to generate calendars to pull into [draw.io](https://draw.io) to plan out upcoming deployments.

> Disclaimer: To expedite the process, most of the original code was generated using ChatGPT and GitHub Copilot.

## Example

<img src="calendar.svg" alt="Example SVG calendar"/>

## Usage

### Online

Calendar for the current month:
<https://gencal.notnot.ninja/>

Calendar for a specific month (`/<year>/<month>`):
<https://gencal.notnot.ninja/2023/5>

### Run locally

This project uses [mise](https://mise.jdx.dev/) to manage the toolchain (Python + [uv](https://docs.astral.sh/uv/)) and `uv` to manage dependencies.

```bash
mise install   # installs the pinned Python and uv
uv sync        # creates .venv and installs locked dependencies
```

Start the Flask app:

```bash
uv run flask run
```

Then open <http://localhost:5000/> for the current month, or
<http://localhost:5000/2023/5> for a specific month.

## Project layout

| Path             | Purpose                                                  |
| ---------------- | -------------------------------------------------------- |
| `app.py`         | Flask app that serves the calendar as an SVG response.   |
| `gencal.py`      | Core module that builds the SVG calendar drawing.        |
| `pyproject.toml` | Project metadata and dependencies.                       |
| `uv.lock`        | Pinned, reproducible dependency lockfile.                |
| `archive/`       | Legacy deployment/tooling, kept for reference. See its [README](archive/README.md). |
