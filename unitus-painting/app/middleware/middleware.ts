// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Only allow access to uploaded files with specific extensions
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

  return NextResponse.next();
}

export const config = {
  matcher: '/uploads/:path*',
};