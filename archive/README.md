# archive

This directory holds legacy tooling and deployment scripts from the original
version of gencal. They are kept **for reference only** while the project is
modernised (see the `feat/gencal-v2` work).

> ⚠️ **Deprecated.** Nothing here is wired into the current build or run flow.
> The paths and assumptions inside these files (Python 3.9, root-relative
> copies, Azure resources, etc.) are stale and will likely be removed in a
> future release once replacements exist.

## Contents

| Subdirectory | Purpose                                                                 |
| ------------ | ---------------------------------------------------------------------- |
| `python/`    | The original Python/Flask app (`app.py`, `gencal.py`) plus its `pyproject.toml`/`uv.lock`, superseded by the TypeScript Cloudflare Worker at the repo root. Run with `cd archive/python && uv run flask run`. |
| `docker/`    | Original container build for the Flask app — `Dockerfile` and `docker-build-push.sh` (build + push to Docker Hub). Targeted Python 3.9 and `pip install -r requirements.txt`. |
| `azure/`     | `app-install-az.sh` — deploys the app to an Azure App Service (Free F1 plan) via `az webapp up`. |
| `cli/`       | `gencal-cli.py` — standalone command-line wrapper around `gencal.generate_svg_calendar()` that writes `cal-<year>-<month>.svg` to disk. |
