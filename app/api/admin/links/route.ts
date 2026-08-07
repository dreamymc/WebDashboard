import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import {
  createShareLink,
  listShareLinks,
  revokeShareLink,
  deleteShareLink,
} from '@/lib/share-links';

import bcrypt from 'bcryptjs';

// All these routes require admin role. The middleware handles the gate;
// we double-check here for defence in depth.
async function assertAdmin(request: NextRequest): Promise<boolean> {
  const cookie = request.cookies.get('session')?.value;
  if (!cookie) return false;
  const session = await verifySession(cookie);
  return session?.role === 'admin';
}

// GET /api/admin/links — list all share links
export async function GET(request: NextRequest) {
  if (!(await assertAdmin(request))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const links = await listShareLinks();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const safe = links.map(({ passwordHash: _ph, ...rest }) => rest);
  return NextResponse.json(safe);
}

// POST /api/admin/links — create a share link
export async function POST(request: NextRequest) {
  if (!(await assertAdmin(request))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const body = await request.json().catch(() => null);
  if (!body || typeof body.label !== 'string' || typeof body.password !== 'string') {
    return NextResponse.json({ error: 'label and password required' }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(body.password, 10);
  const expiresAt: string | null = body.expiresAt
    ? new Date(body.expiresAt).toISOString()
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // default 30 days

  const link = await createShareLink({
    label: body.label,
    passwordHash,
    expiresAt,
    maxUses: body.maxUses ?? null,
  });

  const origin = request.headers.get('origin') ?? '';
  const shareUrl = `${origin}/login?t=${link.token}`;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash: _ph, ...safe } = link;
  return NextResponse.json({ ...safe, shareUrl }, { status: 201 });
}

// PATCH /api/admin/links — revoke or delete
export async function PATCH(request: NextRequest) {
  if (!(await assertAdmin(request))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const body = await request.json().catch(() => null);
  if (!body || typeof body.token !== 'string') {
    return NextResponse.json({ error: 'token required' }, { status: 400 });
  }

  if (body.action === 'delete') {
    await deleteShareLink(body.token);
    return NextResponse.json({ ok: true, action: 'deleted' });
  }

  await revokeShareLink(body.token);
  return NextResponse.json({ ok: true, action: 'revoked' });
}


