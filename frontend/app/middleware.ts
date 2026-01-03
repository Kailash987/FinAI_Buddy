import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasToken = request.cookies.has('token');

  // Handle root path
  if (pathname === '/') {
    const url = hasToken ? '/dashboard' : '/login';
    return NextResponse.redirect(new URL(url, request.url));
  }

  // If authenticated, and trying to access login/signup, redirect to dashboard
  if (hasToken && (pathname.startsWith('/login') || pathname.startsWith('/signup'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If not authenticated, and trying to access dashboard, redirect to login
  if (!hasToken && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/signup', '/dashboard/:path*'],
};
