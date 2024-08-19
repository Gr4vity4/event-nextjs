import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith('/dashboard')) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookies().toString(),
        },
        credentials: 'include',
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.log('API Error:', errorData);
        throw new Error(errorData.message || 'API request failed');
      }

      const userData = await res.json();
      console.log('User Data:', userData);
    } catch (error) {
      console.error('Middleware Error:', error);
      console.log('Cookies:', cookies().toString());
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/dashboard/:path*',
};
