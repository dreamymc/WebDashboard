import { NextRequest, NextResponse } from 'next/server';
import { comparePassword, signSession } from '@/lib/auth';
import { getShareLink, incrementUseCount, validateShareLink } from '@/lib/share-links';

// Prevent caching on this route
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.password !== 'string') {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { password, token: shareLinkToken } = body as { password: string; token?: string };

  // ── Admin login ─────────────────────────────────────────────────────────────
  const adminHash = process.env.ADMIN_PASSWORD_HASH!;
  const isAdmin = await comparePassword(password, adminHash);

  if (isAdmin) {
    const jwt = await signSession({ role: 'admin' });
    const res = NextResponse.json({ ok: true, role: 'admin' });
    res.cookies.set('session', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    return res;
  }

  // ── Share-link login ─────────────────────────────────────────────────────────
  if (shareLinkToken) {
    const link = await getShareLink(shareLinkToken);
    if (!link) {
      return NextResponse.json({ error: 'Invalid link' }, { status: 401 });
    }

    const invalid = validateShareLink(link);
    if (invalid) {
      return NextResponse.json({ error: `Link ${invalid}` }, { status: 401 });
    }

    const isCorrect = await comparePassword(password, link.passwordHash);
    if (!isCorrect) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }

    await incrementUseCount(shareLinkToken);
    const jwt = await signSession({ role: 'viewer', token: shareLinkToken });
    const res = NextResponse.json({ ok: true, role: 'viewer' });
    res.cookies.set('session', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    return res;
  }

  return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
}
