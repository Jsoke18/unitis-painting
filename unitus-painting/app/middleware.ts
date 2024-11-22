// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Enhanced logging setup
const log = {
  info: (message: string, ...args: any[]) => {
    console.log(`[MIDDLEWARE] [INFO] ${message}`, ...args);
  },
  error: (message: string, error: any) => {
    console.error(`[MIDDLEWARE] [ERROR] ${message}`, {
      name: error?.name,
      message: error?.message,
      stack: error?.stack
    });
  }
};

export function middleware(request: NextRequest) {
  const startTime = Date.now();
  log.info('Request received:', {
    path: request.nextUrl.pathname,
    method: request.method,
    host: request.headers.get('host')
  });

  try {
    const response = handleRequest(request);
    
    const duration = Date.now() - startTime;
    log.info('Request completed:', {
      path: request.nextUrl.pathname,
      duration: `${duration}ms`,
      status: response instanceof NextResponse ? response.status : 'N/A'
    });

    return response;
  } catch (error) {
    log.error('Middleware error:', error);
    return NextResponse.next();
  }
}

function handleRequest(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow API routes to pass through
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

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
    log.info('Blocked invalid file access:', filepath);
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

  log.info('Admin access check:', {
    path: pathname,
    hasAuthToken: !!authToken,
    isLoginPage
  });

  // Redirect to login if not authenticated and not on login page
  if (!authToken && !isLoginPage) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    log.info('Redirecting to login:', loginUrl.toString());
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to admin dashboard if authenticated and on login page
  if (authToken && isLoginPage) {
    const adminUrl = new URL('/admin', request.url);
    log.info('Redirecting to admin dashboard:', adminUrl.toString());
    return NextResponse.redirect(adminUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all API routes
    '/api/:path*',
    // Match all admin routes
    '/admin/:path*',
    // Match upload routes
    '/uploads/:path*'
  ]
};