# zaemyung.github.io

Personal academic website of Zae Myung Kim, built with [Astro](https://astro.build) and deployed to GitHub Pages.

## Develop

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static output in dist/
npm run preview    # serve dist/
```

## Where content lives

| What                                                             | File                                                                    |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Name, bio lead, pillars, CTAs                                    | `src/data/profile.yml`                                                  |
| Navigation tabs                                                  | `src/data/nav.yml`                                                      |
| Publications (drives the list, selected papers, and the gallery) | `src/data/papers.json`                                                  |
| Paper figures                                                    | `public/img/papers/<id>.jpg`                                            |
| News                                                             | `src/data/news.yml`                                                     |
| Talks, teaching, mentees                                         | `src/data/talks.yml`, `teaching.yml`, `mentees.yml`                     |
| Experience, education, awards, service                           | `src/data/experience.yml`, `education.yml`, `awards.yml`, `service.yml` |
| Software cards                                                   | `src/data/software.yml`                                                 |
| Long bio (About page)                                            | `src/content/pages/bio.md`                                              |
| Blog posts                                                       | `src/content/blog/*.md`                                                 |
| CV                                                               | `public/pdf/My_CV.pdf`                                                  |

## Adding a paper

Add an object to `src/data/papers.json` (see existing entries for the schema: `id`, `title`, `authors`, `venue`, `year`, `type`, `topics`, `links`, `abstract`, `tldr`, `preview`, `selected`). Drop a figure at `public/img/papers/<id>.jpg` and set `preview` to `img/papers/<id>.jpg`. Set `selected: true` to feature it on the home page.

## Adding a tab

Add an entry to `src/data/nav.yml` and create a page under `src/pages/`.

## Deploy

Pushes to `master` run `.github/workflows/deploy.yml`, which builds the site and publishes `dist/` to the `gh-pages` branch.
