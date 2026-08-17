import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    // Note: Since we use jose, we can't easily decrypt in Edge Runtime without additional setup sometimes,
    // but jose works on Edge. However, for a simple middleware, just checking if session cookie exists 
    // is enough for basic protection, the API routes verify it fully.
  }
  
  if (pathname.startsWith('/admin/login') && session) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
