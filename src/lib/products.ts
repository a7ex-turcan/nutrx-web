import data from '../data/products.json';

export type Tool = (typeof data.tools)[number];
export type App = (typeof data.apps)[number];

const OWNER = 'a7ex-turcan';

/**
 * Latest release tag for a repo, as "major.minor" (v1.13.0 -> "1.13").
 * Runs at build time only; returns null on any failure so the build falls
 * back to the version in products.json.
 */
async function latestVersion(repo: string): Promise<string | null> {
  if (process.env.SKIP_VERSION_FETCH) return null;
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
  const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  try {
    const res = await fetch(`https://api.github.com/repos/${OWNER}/${repo}/releases/latest`, {
      headers,
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const { tag_name } = (await res.json()) as { tag_name?: string };
    const match = tag_name?.match(/^v?(\d+)\.(\d+)/);
    return match ? `${match[1]}.${match[2]}` : null;
  } catch {
    return null;
  }
}

function badgeFor(tool: Tool, version: string | null): string {
  if (tool.status === 'lab' || !version) return tool.badge;
  const parts = [`v${version}`, tool.license];
  if (tool.status === 'early') parts.unshift('early');
  return parts.join(' · ');
}

export async function getTools(): Promise<Tool[]> {
  return Promise.all(
    data.tools.map(async (tool) => {
      if (tool.status === 'lab') return tool;
      const version = (await latestVersion(tool.id)) ?? tool.version;
      return {
        ...tool,
        version,
        badge: badgeFor(tool, version),
        listing: { ...tool.listing, right: `v${version}` },
      };
    }),
  );
}

export const apps: App[] = data.apps;
export const site = data.site;
