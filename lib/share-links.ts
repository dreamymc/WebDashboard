/**
 * Share-link KV store using Upstash REST API directly.
 * Compatible with Edge Runtime (no TCP connections).
 */

export type ShareLink = {
  token: string;
  label: string;
  passwordHash: string;
  createdAt: string;   // ISO string
  expiresAt: string | null; // ISO string or null for never
  maxUses: number | null;
  useCount: number;
  revoked: boolean;
};

const KV_URL   = process.env.KV_REST_API_URL!;
const KV_TOKEN = process.env.KV_REST_API_TOKEN!;

async function kvFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${KV_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${KV_TOKEN}`,
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error(`KV error: ${res.status} ${await res.text()}`);
  return res.json();
}

async function kvGet<T>(key: string): Promise<T | null> {
  const data = await kvFetch(`/get/${encodeURIComponent(key)}`);
  if (data.result == null) return null;
  return JSON.parse(data.result) as T;
}

async function kvSet(key: string, value: unknown): Promise<void> {
  await kvFetch(`/set/${encodeURIComponent(key)}`, {
    method: 'POST',
    body: JSON.stringify(JSON.stringify(value)),
  });
}

async function kvKeys(pattern: string): Promise<string[]> {
  const data = await kvFetch(`/keys/${encodeURIComponent(pattern)}`);
  return (data.result as string[]) ?? [];
}

async function kvDel(key: string): Promise<void> {
  await kvFetch(`/del/${encodeURIComponent(key)}`, { method: 'POST' });
}

// ── Public API ───────────────────────────────────────────────────────────────

export async function createShareLink(
  opts: Pick<ShareLink, 'label' | 'passwordHash' | 'expiresAt' | 'maxUses'>
): Promise<ShareLink> {
  const token = crypto.randomUUID();
  const link: ShareLink = {
    token,
    label: opts.label,
    passwordHash: opts.passwordHash,
    createdAt: new Date().toISOString(),
    expiresAt: opts.expiresAt,
    maxUses: opts.maxUses,
    useCount: 0,
    revoked: false,
  };
  await kvSet(`share:${token}`, link);
  return link;
}

export async function getShareLink(token: string): Promise<ShareLink | null> {
  return kvGet<ShareLink>(`share:${token}`);
}

export async function listShareLinks(): Promise<ShareLink[]> {
  const keys = await kvKeys('share:*');
  if (keys.length === 0) return [];
  const links = await Promise.all(keys.map((k) => kvGet<ShareLink>(k)));
  return links.filter(Boolean) as ShareLink[];
}

export async function revokeShareLink(token: string): Promise<void> {
  const link = await getShareLink(token);
  if (!link) return;
  link.revoked = true;
  await kvSet(`share:${token}`, link);
}

export async function deleteShareLink(token: string): Promise<void> {
  await kvDel(`share:${token}`);
}

export async function incrementUseCount(token: string): Promise<void> {
  const link = await getShareLink(token);
  if (!link) return;
  link.useCount++;
  await kvSet(`share:${token}`, link);
}

/** Returns null if valid, or a reason string if not */
export function validateShareLink(link: ShareLink): string | null {
  if (link.revoked) return 'revoked';
  if (link.expiresAt && new Date(link.expiresAt) < new Date()) return 'expired';
  if (link.maxUses !== null && link.useCount >= link.maxUses) return 'max-uses-reached';
  return null;
}
