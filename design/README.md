# nutrx-labs.com — design handoff

The homepage for **nutrx-labs.com**: one page that presents everything Alex Țurcan builds under the nutrx labs name. That's the **rtf\*** family of developer tools for working with AI agents, plus two iOS apps, **nutrx** and **Softfill**. The design direction is "Terminal": a developer-flavoured page with a dark theme (default) and a light theme.

## What's in this folder

| Path | What it is |
|---|---|
| `reference/index.html` | **The design, as a working static page.** It covers both themes, the theme toggle, copy buttons and the status-bar section indicator. Open it in a browser. Markup and copy are final; styles are inline because the page was exported from the mockup. |
| `tokens/tokens.css` | All colors, fonts, radii and layout values as CSS custom properties, for dark (default) and light. |
| `tokens/tokens.json` | The same tokens plus the type scale, as JSON. |
| `content/products.json` | Every product card's content: names, descriptions, badges, commands and links. Use it to drive the cards and the hero listing instead of hard-coding them. |
| `screenshots/` | Full-page renders: `desktop-dark`, `desktop-light` (1440 px wide) and `phone-dark`, `phone-light` (390 px, @2x). |

Treat `reference/index.html` and the screenshots as the source of truth for look and copy. Rebuild it properly in whatever stack you choose (plain HTML, Astro, Next static export, etc.). The site is fully static and needs no backend.

## Page structure

Top to bottom, with anchor ids:

1. **Header** (`#top`)
   - Left: the wordmark `~/nutrx-labs` followed by an amber block cursor.
   - Right: nav links `tools/` → `#tools`, `apps/` → `#apps`, `github ↗` → github.com/a7ex-turcan, then the theme toggle button.
   - Wraps onto two lines on phones.
2. **Hero**
   - **Left column:**
     - A `$ cat about.txt` prompt line.
     - The H1 "Software that runs **on your side.**", with the highlighted part in `--accent-lg`.
     - A lead paragraph.
     - Two buttons: **Browse the tools** (primary, amber fill, links to `#tools`) and **See the apps** (outline, links to `#apps`).
   - **Right column:** a terminal panel.
     - A title bar reading `alex@nutrx-labs: ~` on the left and `zsh` on the right.
     - `$ ls ~/nutrx-labs/*` followed by the listing, grouped under `tools/` and `apps/`.
     - Each listing row is a link to that product's card. A row shows three columns: name, summary and status. The summary column takes the remaining width and may wrap; the name is fixed at 80 px.
     - Ends with a `$` prompt and a block cursor.
   - The columns stack on phones, with the terminal below the copy.
3. **Tools** (`#tools`)
   - Header: a `// tools` label, the H2 "The rtf\* family", and an intro paragraph.
   - Then a 2-column grid of tool cards (1 column on phones): rtfm, rtfq, rtfc, rtfd.
4. **Apps** (`#apps`)
   - Header: a `// apps` label, the H2 "Two iOS apps. No accounts.", and an intro.
   - Then a 2-column grid of app cards: nutrx and Softfill.
5. **Footer**
   - Left: the wordmark and the line "Built by Alex Țurcan in Chișinău, Moldova. Most of it is open source."
   - Right: links to github, linkedin and email.
6. **Status bar**
   - A full-bleed amber bar styled like a tmux status line: `[nutrx-labs] 0:tools* 1:apps 2:github` on the left, `© 2026 nutrx labs` on the right.
   - The window names are links.
   - The `*` marks the section in view. `0:tools` is active from the top of the page until `#apps` scrolls past 40% of the viewport height, then `1:apps` takes over.

## Components

**Tool card**
- Surface: `--surface` background, 1 px `--line` border, 16 px radius, padding `clamp(22px, 2.4vw, 32px)`, 16 px gaps.
- Header row:
  - The name in mono 30/600 in `--accent-lg`, with the expansion next to it in mono 12.5 `--muted`. They wrap below each other when narrow.
  - A pill badge on the right: mono 11.5, `--muted` text, `--line-2` border.
- **Interface tags:** a `<ul>` of mono 11.5 chips on a `--chip` background with 6 px radius.
- **Description:** 16.5 / 1.6 in `--fg-2`.
- **Command block:**
  - Background `--code`, border `--line`, radius 10, mono 12.5 / 1.8.
  - The first line is a `# comment` in `--muted`. Commands start with an amber `$`.
  - Scrolls horizontally rather than wrapping.
  - A 44×44 **copy button** sits in the top-right corner. It copies only the `$` lines, without the prompt, and swaps to a check icon for 1.5 s.
- **Links:** mono 12.5, pushed to the bottom of the card so cards in a row align. The repo link uses `--fg`; `releases ↗` uses `--muted`.
- **The "lab" variant (rtfd):**
  - Dashed `--line-2` border and no fill.
  - The name is in `--fg-2` instead of accent.
  - The badge is dashed and in `--accent`.
  - The command block holds comments only, so it has no copy button.

**App card**
- Same surface as a tool card.
- Header row: a 60×60 app icon (14 px radius), then the name in sans 30/700 with a mono platform line under it. A badge sits on the right; Softfill's "coming soon" uses the dashed accent style.
- **Preview "screen":**
  - A light panel (`--screen`, 12 px radius) in both themes.
  - nutrx shows a mini "Today" list of four nutrients with progress bars, using `--status-ok` for "hit" and `--status-over`/`--status-over-bar` for "over".
  - Softfill shows a line-art meadow illustration (inline SVG, colors fixed) and a "Sunny Meadow · 44 of 55 colored" caption with a Fill/Draw segmented control.
  - These previews are decorative (`aria-hidden`). They can be swapped for real screenshots later if Alex supplies them.
- **Buttons:**
  - Primary "Visit nutrx →" / "Visit Softfill →": `--fg` background with `--bg` text, so it inverts per theme. 46 px tall, 10 px radius.
  - Secondary "App Store ↗" (nutrx only): an underlined text link.

**Buttons in general**
- Primary: `--accent-fill` background with `--accent-ink` text, 48 px tall, 10 px radius, weight 600.
- Outline: 1 px `--line-2` border with `--fg` text.

## Themes

- Dark is the default.
- Light applies when the system prefers light, unless the visitor chose dark with the toggle. It also applies when `<html data-theme="light">` is set.
- The toggle flips `data-theme` on `<html>` and saves the choice to `localStorage` under the key `nl-theme`.
- A tiny inline script in `<head>` applies the saved choice before first paint. Keep that script, or the page will flash the wrong theme.
- All of this is already implemented in `reference/index.html`. `tokens.css` holds both palettes.

Accent rules, which matter for contrast:
- `--accent` is amber **text** at any size. In light mode it's darkened to `#8F5400` to keep 4.5:1.
- `--accent-lg` is only for text at 24 px or larger: the hero highlight and tool names.
- `--accent-fill` is for amber **surfaces** (primary button, cursor, status bar). It stays `#FFB547` in both themes, always with `--accent-ink` text on it.

## Typography & fonts

- **Fonts:**
  - Body and headings: **Hanken Grotesk** (400/500/600/700).
  - Wordmark, nav, labels, badges, terminal and code: **Martian Mono** (400/500/600).
- **Self-host the fonts in production.** The products' whole pitch is "nothing phoning home", so don't load them from the Google Fonts CDN. Use `@fontsource/hanken-grotesk` and `@fontsource/martian-mono` from npm, or the woff2 files from the google/fonts repo. Include the latin-ext subset, because the copy has ș and Ț.
- The reference page loads Google Fonts only for convenience, between the `FONTS-START`/`FONTS-END` comments.
- **Fluid sizes:** the reference uses `cqi` units because the page root is a size container (`container-type: inline-size`). On a full-width page, `cqi` behaves like `vw`, so `vw` is fine in production. `tokens.json` lists the fluid sizes in `vw`.

## Layout & responsiveness

- **Container:** `max-width: 1328px` including the side padding, which is `clamp(20px, 5vw, 64px)`.
- **Grids:** `repeat(auto-fit, minmax(min(520px, 100%), 1fr))` with a 20 px gap. That gives 2 columns on desktop and 1 on phones without media queries.
- **Section spacing:** `clamp(72px, 9vw, 128px)` after each section.
- **Wrapping:** everything uses flex-wrap; there's no horizontal scrolling except inside command blocks.
- **Hit targets:** at least 44 px for every link and button, including the nav, terminal rows and status-bar items.

## Interactions & states (not all visible in the static mockup)

- **Hover:**
  - Nav and footer links turn `--accent`.
  - Terminal listing rows get a `--chip` background.
  - Card repo links get an underline.
  - The primary button brightens slightly (for example `filter: brightness(1.05)`).
  - Outline buttons swap their border to `--fg`.
- **Focus:** a 2 px `--accent-fill` outline with 2 px offset on `:focus-visible`. This is in the reference.
- **Scrolling:** anchor links scroll smoothly, except under `prefers-reduced-motion`.
- **Optional:**
  - The status bar could be `position: sticky; bottom: 0` so it behaves like a real tmux bar. Decide after trying it on a phone, since it costs 44 px of screen.
  - A one-time typing animation for `ls ~/nutrx-labs/*` in the hero terminal. Skip it under reduced motion.

## SEO & meta

The reference `<head>` already has the title, description, canonical, Open Graph tags and `theme-color` for both schemes. Still needed:
- A 1200×630 OG image.
- A favicon: the amber block cursor on `--bg` would work.

Do not add the `apple-itunes-app` smart-banner meta here. It belongs on the nutrx subdomain only.

## ⚠️ Moving the current nutrx site to nutrx.nutrx-labs.com

nutrx-labs.com currently **is** the nutrx marketing site. Its canonical is `https://www.nutrx-labs.com/`, with pages `/features.html`, `/changelog.html`, `/privacy.html` and `/support.html`. Before this homepage replaces it:

1. Deploy the existing nutrx site to `nutrx.nutrx-labs.com`, the same way `softfill.nutrx-labs.com` is set up.
2. Add **301 redirects** from the old paths to the subdomain:
   - `/features.html`, `/changelog.html`, `/privacy.html`, `/support.html` → `https://nutrx.nutrx-labs.com/…`
   - The same paths on `www.` too.
   - `/nutrx_icon_1024.png`, if anything links to it.
3. **Update App Store Connect for nutrx.** The privacy-policy and support URLs almost certainly point at `www.nutrx-labs.com/privacy.html` and `/support.html`. The redirects keep them working, but point them at the subdomain directly.
4. On the nutrx site, update its canonical and `og:url` / `og:image` URLs to the subdomain. Check that the newsletter form still posts to the right place.
5. Pick one host for the new homepage (apex `nutrx-labs.com` or `www.`) and redirect the other to it.

## Keeping versions current

Badges and listing versions (rtfm v1.13, rtfq v0.1, rtfc v0.3, nutrx v1.10) are hard-coded as of 13 Oct 2026. Nice to have: fetch the latest GitHub release tag for each repo at **build time** and fill `content/products.json`. Don't fetch at runtime; keep the page fully static.

## Open items (ask Alex)

- **App icons:** the mockup shows dashed placeholders. Use the real ones:
  - nutrx: `https://www.nutrx-labs.com/nutrx_icon_1024.png` (moves with the site)
  - Softfill: `https://softfill.nutrx-labs.com/assets/img/brand/AppIcon-light.svg`
  - Render them at 60×60 with 14 px radius.
- **Email address** for the footer `email` link: not decided yet. The link points to `#` for now.
- **OG image and favicon:** see above.

## Acceptance checklist

- [ ] Matches the screenshots at 1440 px and 390 px, in both themes.
- [ ] Theme follows the system by default; the toggle overrides and persists; no flash on reload.
- [ ] Copy buttons copy only the commands, without the `$`.
- [ ] Terminal listing rows jump to the right cards; the status bar `*` follows the section in view.
- [ ] All text meets WCAG AA contrast with the given tokens. Don't introduce new greys.
- [ ] Every interactive element is at least 44 px and keyboard-reachable with a visible focus ring.
- [ ] Fonts are self-hosted; the page makes no third-party requests.
- [ ] The old nutrx URLs redirect to nutrx.nutrx-labs.com.
