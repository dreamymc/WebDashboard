import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

const KV_URL = process.env.KV_REST_API_URL!;
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

async function run() {
  const keysData = await kvFetch('/keys/share:*');
  const keys = keysData.result || [];
  console.log(`Found ${keys.length} share links`);

  for (const key of keys) {
    const data = await kvFetch(`/get/${encodeURIComponent(key)}`);
    if (data.result) {
      const link = JSON.parse(data.result);
      if (!link.token || !link.label) {
        console.log(`Deleting corrupted key: ${key}`, link);
        await kvFetch(`/del/${encodeURIComponent(key)}`, { method: 'POST' });
      } else {
        console.log(`Valid key: ${key}`);
      }
    }
  }
}

run().catch(console.error);
