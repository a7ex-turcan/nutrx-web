import data from '../data/products.json';

export type Tool = (typeof data.tools)[number];
export type App = (typeof data.apps)[number];

const OWNER = 'a7ex-turcan';

/*
 * Versions are looked up at build time only: GitHub releases for the tools,
 * the App Store for the apps. Any failure returns null and the build falls
 * back to what products.json says. SKIP_VERSION_FETCH=1 skips the lookups.
 */
async function fetchJson<T>(url: string, headers: Record<string, string> = {}): Promise<T | null> {
  if (process.env.SKIP_VERSION_FETCH) return null;
  try {
    const res = await fetch(url, { headers, signal: AbortSignal.timeout(5000) });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

/** "v1.13.0" -> "1.13" */
function majorMinor(version?: string): string | null {
  const match = version?.match(/^v?(\d+)\.(\d+)/);
  return match ? `${match[1]}.${match[2]}` : null;
}

async function latestRelease(repo: string): Promise<string | null> {
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
  const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  const release = await fetchJson<{ tag_name?: string }>(
    `https://api.github.com/repos/${OWNER}/${repo}/releases/latest`,
    headers,
  );
  return majorMinor(release?.tag_name);
}

async function appStoreListing(id: string): Promise<{ version: string; price: string } | null> {
  const lookup = await fetchJson<{ results?: { version?: string; formattedPrice?: string }[] }>(
    `https://itunes.apple.com/lookup?id=${id}&country=us`,
  );
  const app = lookup?.results?.[0];
  const version = majorMinor(app?.version);
  return version && app?.formattedPrice ? { version, price: app.formattedPrice.toLowerCase() } : null;
}

export async function getTools(): Promise<Tool[]> {
  return Promise.all(
    data.tools.map(async (tool) => {
      if (tool.status === 'lab') return tool;
      const version = (await latestRelease(tool.id)) ?? tool.version;
      const badge = [tool.status === 'early' && 'early', `v${version}`, tool.license].filter(Boolean).join(' · ');
      return { ...tool, version, badge, listing: { ...tool.listing, right: `v${version}` } };
    }),
  );
}

export async function getApps(): Promise<App[]> {
  return Promise.all(
    data.apps.map(async (app) => {
      const listing = 'appStoreId' in app ? await appStoreListing(app.appStoreId) : null;
      return listing ? { ...app, badge: `v${listing.version} · ${listing.price}` } : app;
    }),
  );
}

export const site = data.site;
