# nutrx-web

The homepage for [nutrx-labs.com](https://nutrx-labs.com): the rtf\* developer tools and the nutrx and Softfill iOS apps on one page.

Static site built with [Astro](https://astro.build). There's no backend, and the page makes no third-party requests: fonts and icons are self-hosted.

## Develop

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # static output in dist/
npm run preview   # serve dist/
```

Requires Node 22+.

## Where things live

| Path | What |
|---|---|
| `src/data/products.json` | Copy for every tool and app card and for the hero terminal listing. |
| `src/lib/products.ts` | Loads the products and, **at build time**, replaces tool versions with each repo's latest GitHub release (`v1.13.0` → `v1.13`). If the fetch fails, the versions in the JSON are used. Set `SKIP_VERSION_FETCH=1` to skip it, or `GITHUB_TOKEN` to avoid rate limits in CI. |
| `src/styles/tokens.css` | Design tokens for the dark (default) and light themes. |
| `src/components/` | Header, hero terminal, tool/app cards, footer, tmux-style status bar. |
| `public/` | Favicon, touch icon, OG image, app icons. |
| `scripts/og/` | HTML sources for the OG image and touch icon (see its README to re-render). |
| `design/` | The original design handoff: reference page, tokens and screenshots. |

## Theme

Follows the system by default. The toggle sets `data-theme` on `<html>` and saves the choice in `localStorage` (`nl-theme`). An inline script in `<head>` applies it before first paint.
