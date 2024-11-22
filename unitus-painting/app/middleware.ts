// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@vercel/edge-config';

// Create Edge Config client
const edge = createClient(process.env.EDGE_CONFIG!);

export const config = {
  matcher: [
    '/admin/:path*',          // Admin routes
    '/welcome',               // Edge config route
    '/((?!api|_next/static|_next/image|favicon.ico).*)', // All routes except API and Next.js internals
  ]
};

export async function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname;

  // Handle welcome route with edge config
  if (path === '/welcome') {
    try {
      const greeting = await edge.get('greeting');
      return NextResponse.json(
        { greeting },
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store'
          }
        }
      );
    } catch (error) {
      console.error('Edge Config error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch greeting' },
        { status: 500 }
      );
    }
  }

  // Handle admin routes authentication
  if (path.startsWith('/admin') && !path.startsWith('/api')) {
    // Check for auth token
    const authToken = request.cookies.get('auth-token');

    if (!authToken) {
      // Store the intended destination and redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', path);
      return NextResponse.redirect(loginUrl);
    }

    try {
      // You can add additional token validation here if needed
      return NextResponse.next();
    } catch (error) {
      console.error('Auth validation error:', error);
      // If token validation fails, redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', path);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Allow all other routes to pass through
  return NextResponse.next();
}