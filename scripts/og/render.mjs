// Renders public/og/<tool>.png for every tool page with headless Chrome.
// Usage: node scripts/og/render.mjs   (CHROME=/path/to/chrome to override)
import { execFileSync } from 'node:child_process';
import { readFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '../..');
const chrome = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const { tools } = JSON.parse(readFileSync(join(root, 'src/data/products.json'), 'utf8'));
const template = pathToFileURL(join(here, 'tool.html'));

mkdirSync(join(root, 'public/og'), { recursive: true });

for (const tool of tools) {
  let yaml;
  try {
    yaml = readFileSync(join(root, `src/content/tools/${tool.id}.yaml`), 'utf8');
  } catch {
    continue; // no page, no image
  }
  // The tagline is a single quoted line; no YAML parser needed for that.
  const tagline = JSON.parse(yaml.match(/^tagline:\s*(".*")\s*$/m)[1]);
  const url = new URL(template);
  url.search = new URLSearchParams({
    id: tool.id,
    name: tool.name,
    exp: tool.expansion,
    tagline: tagline.replaceAll('`', ''),
    ...(tool.status === 'lab' ? { lab: '1' } : {}),
  });
  const out = join(root, `public/og/${tool.id}.png`);
  execFileSync(chrome, [
    '--headless=new',
    '--hide-scrollbars',
    '--allow-file-access-from-files',
    '--virtual-time-budget=2000',
    '--window-size=1200,630',
    `--screenshot=${out}`,
    url.href,
  ], { stdio: 'ignore' });
  console.log(`public/og/${tool.id}.png`);
}
