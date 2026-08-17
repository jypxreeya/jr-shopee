import { NextResponse } from 'next/server';
import { encrypt } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { mail, username, password } = await request.json();

    const providedEmail = mail || username;
    const safeMail = providedEmail?.trim();
    const safePassword = password?.trim();

    if (safeMail === 'jayapriyakalidas@gmail.com' && safePassword === 'priyakutty@21') {
      // Create session
      const sessionData = { adminId: 1, mail };
      const encryptedSessionData = await encrypt(sessionData);

      const cookieStore = await cookies();
      cookieStore.set('session', encryptedSessionData, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      });

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Access Denied' }, { status: 401 });
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
