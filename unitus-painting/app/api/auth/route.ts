// app/api/auth/route.ts
import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';

// Enhanced logging setup
const log = {
  info: (message: string, ...args: any[]) => {
    console.log(`[AUTH] [INFO] ${message}`, ...args);
  },
  error: (message: string, error: any) => {
    console.error(`[AUTH] [ERROR] ${message}`, {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
      cause: error?.cause
    });
  }
};

// Initialize database and JWT configuration
let sql: any;
try {
  sql = neon(process.env.DATABASE_URL!);
  log.info('Database connection initialized');
} catch (error) {
  log.error('Database initialization failed', error);
  throw new Error('Database initialization failed');
}

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}

// Helper function for CORS headers
function getCorsHeaders() {
  return {
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
      ? 'https://www.unituspainting.com' 
      : 'http://localhost:3000',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  };
}

// Helper function to add CORS headers to response
function addCorsHeaders(response: NextResponse) {
  const corsHeaders = getCorsHeaders();
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

// Cookie domain helper
function getCookieDomain(request: Request) {
  if (process.env.NODE_ENV !== 'production') return undefined;
  
  const host = request.headers.get('host') || '';
  if (host.includes('unituspainting.com')) {
    return '.unituspainting.com';
  }
  return undefined;
}

// Cookie configuration
function getCookieOptions(request: Request) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    domain: getCookieDomain(request)
  };
}

// Helper function to sanitize user object
const sanitizeUser = (user: any) => ({
  id: user.id,
  email: user.email,
});

// Debug helper
function logRequestInfo(request: Request) {
  log.info('Request details:', {
    method: request.method,
    url: request.url,
    headers: Object.fromEntries(request.headers.entries()),
    cookies: request.headers.get('cookie'),
  });
}

/**
 * POST - Handle login
 */
export async function POST(request: Request) {
  logRequestInfo(request);
  log.info('Processing login request');

  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      log.error('Failed to parse request body', error);
      const response = NextResponse.json(
        { success: false, message: 'Invalid request body' },
        { status: 400 }
      );
      return addCorsHeaders(response);
    }

    const { email, password } = body;

    // Validate inputs
    if (!email || !password) {
      const response = NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
      return addCorsHeaders(response);
    }

    // Query database
    const users = await sql`
      SELECT * FROM admin_users 
      WHERE email = ${email.toLowerCase().trim()}
    `;

    if (users.length === 0) {
      const response = NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
      return addCorsHeaders(response);
    }

    // Verify password
    const validPassword = await argon2.verify(users[0].password_hash, password);
    if (!validPassword) {
      const response = NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
      return addCorsHeaders(response);
    }

    // Generate token
    const token = jwt.sign(
      {
        userId: users[0].id,
        email: users[0].email,
        iat: Math.floor(Date.now() / 1000),
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Create successful response
    const response = NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        user: sanitizeUser(users[0])
      },
      { status: 200 }
    );

    // Set cookies
    const cookieOptions = getCookieOptions(request);
    response.cookies.set('auth-token', token, {
      ...cookieOptions,
      maxAge: 86400 // 24 hours
    });

    response.cookies.set('admin', 'true', {
      ...cookieOptions,
      maxAge: 86400
    });

    return addCorsHeaders(response);

  } catch (error) {
    log.error('Login error', error);
    const response = NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
    return addCorsHeaders(response);
  }
}

/**
 * GET - Check authentication status
 */
export async function GET(request: Request) {
  logRequestInfo(request);
  log.info('Checking authentication status');

  try {
    const authToken = request.cookies.get('auth-token');

    if (!authToken?.value) {
      const response = NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
      return addCorsHeaders(response);
    }

    try {
      const decoded = jwt.verify(authToken.value, JWT_SECRET) as {
        userId: string;
        email: string;
      };

      const response = NextResponse.json({
        success: true,
        message: 'Authenticated',
        user: {
          id: decoded.userId,
          email: decoded.email,
        }
      });
      return addCorsHeaders(response);

    } catch (error) {
      log.error('Token verification failed', error);
      const response = NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );

      // Clear invalid cookies
      const cookieOptions = getCookieOptions(request);
      response.cookies.set('auth-token', '', { ...cookieOptions, maxAge: 0 });
      response.cookies.set('admin', '', { ...cookieOptions, maxAge: 0 });

      return addCorsHeaders(response);
    }

  } catch (error) {
    log.error('Auth check error', error);
    const response = NextResponse.json(
      { success: false, message: 'Error checking authentication' },
      { status: 500 }
    );
    return addCorsHeaders(response);
  }
}

/**
 * DELETE - Handle logout
 */
export async function DELETE(request: Request) {
  logRequestInfo(request);
  log.info('Processing logout request');

  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logout successful'
    });

    const cookieOptions = getCookieOptions(request);
    response.cookies.set('auth-token', '', { ...cookieOptions, maxAge: 0 });
    response.cookies.set('admin', '', { ...cookieOptions, maxAge: 0 });

    return addCorsHeaders(response);

  } catch (error) {
    log.error('Logout error', error);
    const response = NextResponse.json(
      { success: false, message: 'Error during logout' },
      { status: 500 }
    );
    return addCorsHeaders(response);
  }
}

/**
 * OPTIONS - Handle CORS preflight
 */
export async function OPTIONS(request: Request) {
  log.info('Handling OPTIONS request');
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(),
  });
}