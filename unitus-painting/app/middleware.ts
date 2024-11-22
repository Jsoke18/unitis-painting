// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Enhanced logging
const logger = {
  info: (message: string, data?: any) => {
    console.log(`[MIDDLEWARE] [INFO] ${message}`, data || '');
  },
  error: (message: string, error: any) => {
    console.error(`[MIDDLEWARE] [ERROR] ${message}`, {
      name: error?.name,
      message: error?.message,
      stack: error?.stack
    });
  },
  debug: (message: string, data?: any) => {
    if (process.env.DEBUG === 'true') {
      console.debug(`[MIDDLEWARE] [DEBUG] ${message}`, data || '');
    }
  }
};

// Path exclusion patterns
const EXCLUDED_PATHS = new Set([
  '/api/',
  '/_next/',
  '/static/',
  '/_vercel/',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml'
]);

// Helper function to check if a path should be excluded
function isExcludedPath(path: string): boolean {
  return Array.from(EXCLUDED_PATHS).some(excluded => path.startsWith(excluded));
}

// Helper function to check if path is an admin route
function isAdminRoute(path: string): boolean {
  return path.startsWith('/admin');
}

// Helper function to get login URL
function getLoginUrl(request: NextRequest): URL {
  const loginUrl = new URL('/admin/login', request.url);
  loginUrl.searchParams.set('from', request.nextUrl.pathname);
  return loginUrl;
}

// Helper function to get admin dashboard URL
function getAdminUrl(request: NextRequest): URL {
  return new URL('/admin', request.url);
}

// Helper function to handle admin access
function handleAdminAccess(request: NextRequest) {
  const authToken = request.cookies.get('auth-token');
  const isLoginPage = request.nextUrl.pathname === '/admin/login';

  logger.debug('Admin access check:', {
    path: request.nextUrl.pathname,
    hasToken: !!authToken,
    isLoginPage
  });

  // Redirect to login if no auth token (except for login page)
  if (!authToken && !isLoginPage) {
    const loginUrl = getLoginUrl(request);
    logger.info('Redirecting to login:', loginUrl.toString());
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to admin dashboard if already authenticated and trying to access login
  if (authToken && isLoginPage) {
    const adminUrl = getAdminUrl(request);
    logger.info('Redirecting to admin dashboard:', adminUrl.toString());
    return NextResponse.redirect(adminUrl);
  }

  logger.info('Admin access granted');
  return NextResponse.next();
}

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    // Debug logging
    logger.debug('Request received:', {
      path: pathname,
      method: request.method,
      host: request.headers.get('host'),
      userAgent: request.headers.get('user-agent')
    });

    // Skip middleware for excluded paths
    if (isExcludedPath(pathname)) {
      logger.debug('Skipping middleware for excluded path:', pathname);
      return NextResponse.next();
    }

    // Handle admin routes
    if (isAdminRoute(pathname)) {
      return handleAdminAccess(request);
    }

    // Allow all other routes
    return NextResponse.next();

  } catch (error) {
    logger.error('Middleware error:', error);
    // In case of error, allow the request to proceed
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ],
};