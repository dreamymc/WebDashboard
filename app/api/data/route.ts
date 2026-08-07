import { NextResponse } from 'next/server';

// Stub — Phase 2 will implement the real data fetch.
// Protected by middleware; this route is unreachable without a valid session.
export async function GET() {
  return NextResponse.json({ status: 'pending', message: 'Data layer not yet implemented (Phase 2)' });
}
