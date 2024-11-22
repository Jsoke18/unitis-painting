// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Extract the pathname for easier use
  const { pathname } = request.nextUrl;

  // Define protected paths and their handling
  if (pathname.startsWith('/uploads/')) {
    return handleUploadsProtection(request);
  }

  if (pathname.startsWith('/admin')) {
    return handleAdminProtection(request);
  }

  return NextResponse.next();
}

function handleUploadsProtection(request: NextRequest) {
  const filepath = request.nextUrl.pathname;
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  
  const hasAllowedExtension = allowedExtensions.some(ext =>
    filepath.toLowerCase().endsWith(ext)
  );
  
  if (!hasAllowedExtension) {
    return NextResponse.json(
      { error: 'Invalid file type' },
      { status: 400 }
    );
  }
  
  return NextResponse.next();
}

function handleAdminProtection(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get('auth-token');
  const isLoginPage = pathname === '/admin/login';

  // Always allow API routes to pass through
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Redirect to login if not authenticated and not on login page
  if (!authToken && !isLoginPage) {
    const loginUrl = new URL('/admin/login', request.url);
    // Preserve the original destination
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to admin dashboard if authenticated and on login page
  if (authToken && isLoginPage) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/uploads/:path*',
    '/admin/:path*',
    '/api/auth/:path*'
  ]
};