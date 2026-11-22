import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('admin_session')?.value;

  if (!sessionToken) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const parsed = JSON.parse(Buffer.from(sessionToken, 'base64').toString('utf-8'));
    return NextResponse.json({
      authenticated: true,
      user: { email: parsed.email, name: parsed.name, role: parsed.role }
    });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
