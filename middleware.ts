import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession } from '@/lib/auth';

// ── Simple in-memory rate limiter (Edge compatible) ──────────────────────────
// Maps IP → [attempt count, window start ms]
const rateLimitMap = new Map<string, [number, number]>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry[1] > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, [1, now]);
    return false;
  }
  entry[0]++;
  if (entry[0] > RATE_LIMIT_MAX) return true;
  return false;
}

// ── Route matchers ────────────────────────────────────────────────────────────
function isProtected(pathname: string): boolean {
  return (
    pathname.startsWith('/overview') ||
    pathname.startsWith('/pipeline') ||
    pathname.startsWith('/vendors-tco') ||
    pathname.startsWith('/forecast') ||
    pathname.startsWith('/sites') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api/data')
  );
}

function isAdminOnly(pathname: string): boolean {
  return pathname.startsWith('/admin');
}

function isLoginRateLimited(request: NextRequest): boolean {
  if (!request.nextUrl.pathname.startsWith('/api/auth/login')) return false;
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';
  return isRateLimited(ip);
}

// ── Middleware ────────────────────────────────────────────────────────────────
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Add noindex headers to every response
  const headers = new Headers();
  headers.set('X-Robots-Tag', 'noindex, nofollow');

  // Rate-limit login POST
  if (request.method === 'POST' && isLoginRateLimited(request)) {
    return new NextResponse(JSON.stringify({ error: 'Too many requests' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json', ...Object.fromEntries(headers) },
    });
  }

  if (!isProtected(pathname)) {
    const res = NextResponse.next();
    res.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return res;
  }

  // Read session cookie
  const sessionCookie = request.cookies.get('session')?.value;
  const session = sessionCookie ? await verifySession(sessionCookie) : null;

  if (!session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminOnly(pathname) && session.role !== 'admin') {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const res = NextResponse.next();
  res.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt).*)',
  ],
};
