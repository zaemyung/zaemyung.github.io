# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal academic website for Zae Myung Kim, built on the [al-folio](https://github.com/alshedivat/al-folio) Jekyll theme. Deployed to GitHub Pages via the `deploy.yml` workflow on pushes to `master`.

## Build & Serve Commands

```bash
# Local development with Docker (recommended)
docker compose up

# Native local development (requires Ruby, Bundler, Jupyter)
bundle install
bundle exec jekyll serve --watch --port=8080 --livereload

# Production build (used in CI)
JEKYLL_ENV=production bundle exec jekyll build --lsi

# Formatting (Prettier with Liquid plugin)
npx prettier --check .
npx prettier --write .
```

The Docker setup serves on port 8080 with live reload on port 35729. It auto-restarts when `_config.yml` changes.

## Architecture

- **Theme**: al-folio (Jekyll-based academic theme). Site config lives in `_config.yml`.
- **Content pages**: `_pages/` — about, blog, news, projects, publications (Markdown/Liquid).
- **Publications**: `_bibliography/papers.bib` — BibTeX entries rendered by `jekyll-scholar`. Each entry can have `selected`, `abbr`, `pdf`, `code` fields.
- **Layouts**: `_layouts/` — Liquid templates (default, page, post, bib, cv, distill, profiles).
- **Includes**: `_includes/` — reusable Liquid partials (header, footer, metadata, resume sections, repository cards).
- **Custom plugins**: `_plugins/` — Ruby plugins for cache busting, citation handling, external posts, etc.
- **Styling**: `_sass/` — SCSS partials; `_variables.scss` for theme customization, `_themes.scss` for light/dark mode.
- **Data files**: `_data/` — YAML files for CV (`cv.yml`), coauthors, repositories, venues.
- **Collections**: `_news/` (announcements), `_projects/` (project pages), `_posts/` (blog posts).

## Deployment

GitHub Actions workflow (`.github/workflows/deploy.yml`) builds with Jekyll, purges unused CSS via PurgeCSS, and deploys the `_site/` folder to GitHub Pages using `JamesIves/github-pages-deploy-action`.

## Pre-commit & Formatting

Pre-commit hooks enforce trailing whitespace removal, end-of-file fixing, YAML validation, and large file checks. Prettier (with `@shopify/prettier-plugin-liquid`) formats Liquid/HTML/JS files at 150 char width.
