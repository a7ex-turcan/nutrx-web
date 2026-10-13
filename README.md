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
| `src/lib/products.ts` | Loads the products and looks up versions **at build time**: each tool's latest GitHub release (`v1.13.0` → `v1.13`) and, for apps with an `appStoreId`, the App Store version and price. If a lookup fails, the values in the JSON are used. Set `SKIP_VERSION_FETCH=1` to skip the lookups, or `GITHUB_TOKEN` to avoid rate limits. |
| `src/content/tools/<id>.yaml` | Copy for each tool page (`/rtfm/`, `/rtfq/`, …): tagline, highlights, steps, notes. The schema and its length limits are in `src/content.config.ts`. Wrap commands and identifiers in `` `backticks` `` to show them as inline code. |
| `src/pages/[tool].astro` | The tool page template. A new YAML file plus a matching entry in `products.json` makes a new page. |
| `src/styles/tokens.css` | Design tokens for the dark (default) and light themes. |
| `src/components/` | Header, hero terminal, tool/app cards, footer, tmux-style status bar. |
| `public/` | Favicon, touch icon, OG image, app icons. |
| `scripts/og/` | HTML sources for the OG image and touch icon (see its README to re-render). |
| `design/` | The original design handoff: reference page, tokens and screenshots. |

## Deploys

GitHub Pages, via `.github/workflows/deploy.yml`: on every push to `main`, daily at 04:17 UTC (to pick up new releases and App Store versions), and on demand from the Actions tab. DNS and redirects live in Cloudflare.

## Theme

Follows the system by default. The toggle sets `data-theme` on `<html>` and saves the choice in `localStorage` (`nl-theme`). An inline script in `<head>` applies it before first paint.
