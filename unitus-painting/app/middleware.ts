// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@vercel/edge-config';

// Create Edge Config client
const edge = createClient(process.env.EDGE_CONFIG!);

export const config = {
  matcher: [
    '/admin/:path*', // Admin routes
    '/welcome',      // Edge config route
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
};

export async function middleware(request: NextRequest) {
  // Handle welcome route with edge config
  if (request.nextUrl.pathname === '/welcome') {
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
  if (request.nextUrl.pathname.startsWith('/admin') && 
      !request.nextUrl.pathname.startsWith('/api')) {
    const isAdmin = request.cookies.get('admin')?.value === 'true';
    
    if (!isAdmin) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}