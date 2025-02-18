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

// Environment configuration
const ENV = {
  isProd: process.env.NODE_ENV === 'production',
  baseDomain: 'unituspainting.com',
  get domain() {
    return this.isProd ? `www.${this.baseDomain}` : 'localhost:3000';
  },
  get origin() {
    return this.isProd 
      ? `https://www.${this.baseDomain}`
      : 'http://localhost:3000';
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
  '/sitemap.xml',
  '/manifest.json',
  '/.well-known/'
]);

// Helper functions
function isExcludedPath(path: string): boolean {
  return Array.from(EXCLUDED_PATHS).some(excluded => path.startsWith(excluded));
}

function isAdminRoute(path: string): boolean {
  return path.startsWith('/admin');
}

function getLoginUrl(request: NextRequest): URL {
  const loginUrl = new URL('/admin/login', ENV.origin);
  loginUrl.searchParams.set('from', request.nextUrl.pathname);
  return loginUrl;
}

function getAdminUrl(request: NextRequest): URL {
  return new URL('/admin', ENV.origin);
}

function handleDomainRedirect(request: NextRequest): NextResponse | null {
  if (!ENV.isProd) return null;

  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host');

  if (hostname && !hostname.startsWith('www.')) {
    url.host = ENV.domain;
    logger.debug('Redirecting to www domain', {
      from: hostname,
      to: url.host
    });
    return NextResponse.redirect(url, { status: 308 });
  }

  return null;
}

function handleAdminAccess(request: NextRequest) {
  const authToken = request.cookies.get('auth-token');
  const isLoginPage = request.nextUrl.pathname === '/admin/login';

  logger.debug('Admin access check:', {
    path: request.nextUrl.pathname,
    hasToken: !!authToken,
    isLoginPage,
    environment: process.env.NODE_ENV
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

// Main middleware function
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

    // Handle www redirect first
    const domainRedirect = handleDomainRedirect(request);
    if (domainRedirect) return domainRedirect;

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