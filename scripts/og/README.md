Sources for `public/og.png` (1200×630) and `public/apple-touch-icon.png` (180×180).
Re-render from the repo root after `npm install`:

```sh
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless=new --hide-scrollbars --allow-file-access-from-files --window-size=1200,630 --screenshot="$PWD/public/og.png" "file://$PWD/scripts/og/og.html"
"$CHROME" --headless=new --hide-scrollbars --window-size=180,180 --screenshot="$PWD/public/apple-touch-icon.png" "file://$PWD/scripts/og/touch.html"
```
