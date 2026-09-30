# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Overview

Personal academic website for Zae Myung Kim. Custom design built with Astro (static output, no UI framework). Deployed to GitHub Pages by `.github/workflows/deploy.yml` on pushes to `master`, which builds and pushes `dist/` to the `gh-pages` branch.

## Commands

```bash
npm install
npm run dev          # dev server with HMR at http://localhost:4321
npm run build        # production build into dist/
npm run preview      # serve the built site
npm run format       # prettier (with prettier-plugin-astro)
```

## Architecture

- `src/layouts/Base.astro` — HTML shell: head/meta, fonts, theme bootstrap script, `Nav`, `Footer`.
- `src/components/` — `Nav`, `Footer`, `Icon` (inline SVG set), `Hero`, `Pillars`, `Sidebar`, `NewsList`, `PubEntry`, `PubList`.
- `src/pages/` — one file per route: `index`, `publications`, `gallery`, `teaching`, `software`, `news`, `blog/`, `404`.
- `src/lib/data.ts` — loads `src/data/*.yml|json` at build time (bundled via `import.meta.glob`), shared types, topic taxonomy (`TOPICS`), grouping and formatting helpers.
- `src/data/` — all structured content (YAML/JSON). `papers.json` is the single source for the publication list, selected papers on the home page, pillar chips, and the gallery.
- `src/content/` — Markdown content collections (`blog/`, `pages/bio.md`), configured in `src/content.config.ts`.
- `src/styles/global.css` — design tokens (`:root` light, `[data-theme="dark"]`), layout, and all component styles. `gallery.css` is page-specific.
- `public/` — static assets: `img/` (photo, project thumbnails, `papers/` figures), `pdf/My_CV.pdf`, `.nojekyll`.

## Conventions

- Dark mode is toggled by setting `data-theme` on `<html>`; persisted in `localStorage("theme")`.
- Topic keys: `structure`, `metacognition`, `collaboration`, `multilingual`, `others`. Colors live in `global.css` as `--t-<topic>` and are applied through `[data-topic]` → `--tc`.
- Paper ids are stable anchors: `/publications/#<id>` and `/gallery/#<id>` (opens the modal).
- Dates in YAML are quoted strings (`"2026-09"`, `"2026-09-30"`), never bare dates.
- Keep pages data-driven: add content to `src/data/`, not to page markup.
