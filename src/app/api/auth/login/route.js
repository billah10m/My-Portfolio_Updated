import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'asifbillah.cse@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_SECRET_KEY || process.env.ADMIN_PASSWORD || 'admin123';

export async function POST(request) {
  try {
    const { email, username, password } = await request.json();
    const inputIdentifier = (email || username || '').trim().toLowerCase();

    const validIdentifier = 
      inputIdentifier === ADMIN_EMAIL.toLowerCase() || 
      inputIdentifier === 'admin' || 
      inputIdentifier === 'asif' ||
      inputIdentifier === 'asifbillah';

    if (validIdentifier && password === ADMIN_PASSWORD) {
      const cookieStore = cookies();
      const token = Buffer.from(JSON.stringify({
        email: ADMIN_EMAIL,
        name: 'Asif Billah',
        role: 'owner',
        timestamp: Date.now()
      })).toString('base64');

      const host = request.headers.get('host') || '';
      const isLocal = host.includes('localhost') || host.includes('127.0.0.1');
      const isHttps = request.headers.get('x-forwarded-proto') === 'https';

      cookieStore.set('admin_session', token, {
        httpOnly: true,
        secure: isHttps || (!isLocal && process.env.NODE_ENV === 'production'),
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });

      return NextResponse.json({
        success: true,
        message: 'Admin authentication successful',
        user: { email: ADMIN_EMAIL, name: 'Asif Billah', role: 'owner' }
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid credentials. Please provide valid admin credentials.'
    }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
