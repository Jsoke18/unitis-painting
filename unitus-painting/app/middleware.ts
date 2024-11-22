// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Debug logging for production issues
  console.log('Middleware executing:', {
    path: request.nextUrl.pathname,
    method: request.method,
    isApi: request.nextUrl.pathname.startsWith('/api/'),
  });

  // Skip middleware for API routes completely
  if (request.nextUrl.pathname.startsWith('/api/')) {
    console.log('API route detected, passing through');
    return NextResponse.next();
  }

  // Handle admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    return handleAdminAccess(request);
  }

  // All other routes pass through
  return NextResponse.next();
}

function handleAdminAccess(request: NextRequest) {
  const authToken = request.cookies.get('auth-token');
  const isLoginPage = request.nextUrl.pathname === '/admin/login';

  // Always allow API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  if (!authToken && !isLoginPage) {
    const url = new URL('/admin/login', request.url);
    url.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (authToken && isLoginPage) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match admin routes but explicitly exclude API routes
    '/admin/:path*',
    
    // Exclude API routes from middleware processing
    '/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};