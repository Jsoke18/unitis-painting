// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Enhanced logging setup
const log = {
  info: (message: string, data?: any) => {
    console.log(`[MIDDLEWARE] [INFO] ${message}`, data || '');
  },
  error: (message: string, error: any) => {
    console.error(`[MIDDLEWARE] [ERROR] ${message}`, {
      name: error?.name,
      message: error?.message,
      stack: error?.stack
    });
  }
};

// Helper function to check if a path should be excluded from middleware
function isExcludedPath(path: string): boolean {
  const excludedPaths = [
    '/api/',
    '/_next/',
    '/static/',
    '/_vercel/',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml'
  ];
  return excludedPaths.some(excluded => path.startsWith(excluded));
}

// Helper function to handle admin access
function handleAdminAccess(request: NextRequest) {
  const authToken = request.cookies.get('auth-token');
  const isLoginPage = request.nextUrl.pathname === '/admin/login';

  log.info('Admin access check:', {
    path: request.nextUrl.pathname,
    hasToken: !!authToken,
    isLoginPage,
    method: request.method
  });

  // Non-authenticated users must go to login
  if (!authToken && !isLoginPage) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    log.info('Redirecting to login:', loginUrl.toString());
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated users trying to access login page go to admin
  if (authToken && isLoginPage) {
    const adminUrl = new URL('/admin', request.url);
    log.info('Redirecting to admin dashboard:', adminUrl.toString());
    return NextResponse.redirect(adminUrl);
  }

  log.info('Admin access granted');
  return NextResponse.next();
}

export function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    // Log all requests in production
    log.info('Request received:', {
      path: pathname,
      method: request.method,
      host: request.headers.get('host'),
      userAgent: request.headers.get('user-agent')
    });

    // Skip excluded paths
    if (isExcludedPath(pathname)) {
      log.info('Skipping middleware for excluded path:', pathname);
      return NextResponse.next();
    }

    // Handle admin routes
    if (pathname.startsWith('/admin')) {
      return handleAdminAccess(request);
    }

    // All other routes pass through
    return NextResponse.next();

  } catch (error) {
    log.error('Middleware error:', error);
    // In case of error, allow the request to proceed
    return NextResponse.next();
  }
}

export const config = {
  /*
   * Match:
   * - /admin/* (all admin routes)
   * - /((?!api/|_next/|_static/|_vercel|[\w-]+\.\w+).*) (everything except api, _next, etc)
   */
  matcher: [
    '/admin/:path*',
    '/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)'
  ]
};