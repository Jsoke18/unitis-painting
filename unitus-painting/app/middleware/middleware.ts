// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Handle uploads protection
  if (request.nextUrl.pathname.startsWith('/uploads/')) {
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
  }

  // Handle admin authentication
  if (request.nextUrl.pathname.startsWith('/admin/')) {
    const isAuthenticated = request.cookies.get('auth-token');
    const isLoginPage = request.nextUrl.pathname === '/admin/login';

    if (!isAuthenticated && !isLoginPage) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    if (isLoginPage && isAuthenticated) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/uploads/:path*', '/admin/:path*']
};