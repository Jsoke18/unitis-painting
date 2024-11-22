// app/api/auth/route.ts
import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { LoginResponse, AuthCheckResponse, User } from '@/types/auth';

// Enhanced logging setup
const logger = {
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
  },
  debug: (message: string, ...args: any[]) => {
    if (process.env.DEBUG === 'true') {
      console.debug(`[AUTH] [DEBUG] ${message}`, ...args);
    }
  }
};

// Database initialization
const initializeDatabase = () => {
  try {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error('DATABASE_URL is not defined');
    }
    return neon(dbUrl);
  } catch (error) {
    logger.error('Database initialization failed', error);
    throw new Error('Database initialization failed');
  }
};

const sql = initializeDatabase();

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}

// CORS configuration
const CORS_ORIGIN = process.env.NODE_ENV === 'production' 
  ? 'https://unituspainting.com'
  : 'http://localhost:3000';

function getCorsHeaders() {
  return {
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': CORS_ORIGIN,
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400',
  };
}

function addCorsHeaders(response: NextResponse) {
  Object.entries(getCorsHeaders()).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

// Cookie configuration
function getCookieDomain(request: Request): string {
  if (process.env.NODE_ENV !== 'production') return 'localhost';
  return 'unituspainting.com';
}

function getCookieOptions(request: Request) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    domain: getCookieDomain(request)
  };
}

// User sanitization
function sanitizeUser(user: any): User {
  return {
    id: user.id,
    email: user.email,
  };
}

// Request logging
function logRequestInfo(request: Request) {
  logger.debug('Request details:', {
    method: request.method,
    url: request.url,
    headers: Object.fromEntries(request.headers.entries()),
  });
}

// Error response helper
function createErrorResponse(message: string, status: number): NextResponse {
  const response = NextResponse.json(
    { success: false, message },
    { status }
  );
  return addCorsHeaders(response);
}

// Success response helper
function createSuccessResponse(data: any, status = 200): NextResponse {
  const response = NextResponse.json(
    { success: true, ...data },
    { status }
  );
  return addCorsHeaders(response);
}

/**
 * POST - Handle login
 */
export async function POST(request: Request): Promise<NextResponse<LoginResponse>> {
  logRequestInfo(request);
  logger.info('Processing login request');

  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      logger.error('Failed to parse request body', error);
      return createErrorResponse('Invalid request body', 400);
    }

    const { email, password } = body;

    // Input validation
    if (!email || !password) {
      return createErrorResponse('Email and password are required', 400);
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
      return createErrorResponse('Invalid input types', 400);
    }

    // Query database
    const users = await sql<any[]>`
      SELECT * FROM admin_users 
      WHERE email = ${email.toLowerCase().trim()}
    `;

    if (users.length === 0) {
      logger.info('Login attempt failed: User not found', { email });
      return createErrorResponse('Invalid credentials', 401);
    }

    // Verify password
    const validPassword = await argon2.verify(users[0].password_hash, password);
    if (!validPassword) {
      logger.info('Login attempt failed: Invalid password', { email });
      return createErrorResponse('Invalid credentials', 401);
    }

    // Generate JWT
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
    const response = createSuccessResponse({
      message: 'Login successful',
      user: sanitizeUser(users[0])
    });

    // Set cookies
    const cookieOptions = getCookieOptions(request);
    response.cookies.set('auth-token', token, {
      ...cookieOptions,
      maxAge: 86400
    });

    response.cookies.set('admin', 'true', {
      ...cookieOptions,
      maxAge: 86400
    });

    logger.info('Login successful', { email });
    return response;

  } catch (error) {
    logger.error('Login error', error);
    return createErrorResponse('Internal server error', 500);
  }
}

/**
 * GET - Check authentication status
 */
export async function GET(request: Request): Promise<NextResponse<AuthCheckResponse>> {
  logRequestInfo(request);
  logger.info('Checking authentication status');

  try {
    const authToken = request.cookies.get('auth-token');

    if (!authToken?.value) {
      return createErrorResponse('Not authenticated', 401);
    }

    try {
      const decoded = jwt.verify(authToken.value, JWT_SECRET) as {
        userId: string;
        email: string;
      };

      return createSuccessResponse({
        message: 'Authenticated',
        user: {
          id: decoded.userId,
          email: decoded.email,
        }
      });

    } catch (error) {
      logger.error('Token verification failed', error);
      const response = createErrorResponse('Invalid token', 401);

      // Clear invalid cookies
      const cookieOptions = getCookieOptions(request);
      response.cookies.set('auth-token', '', { ...cookieOptions, maxAge: 0 });
      response.cookies.set('admin', '', { ...cookieOptions, maxAge: 0 });

      return response;
    }

  } catch (error) {
    logger.error('Auth check error', error);
    return createErrorResponse('Error checking authentication', 500);
  }
}

/**
 * DELETE - Handle logout
 */
export async function DELETE(request: Request) {
  logRequestInfo(request);
  logger.info('Processing logout request');

  try {
    const response = createSuccessResponse({
      message: 'Logout successful'
    });

    const cookieOptions = getCookieOptions(request);
    response.cookies.set('auth-token', '', { ...cookieOptions, maxAge: 0 });
    response.cookies.set('admin', '', { ...cookieOptions, maxAge: 0 });

    return response;

  } catch (error) {
    logger.error('Logout error', error);
    return createErrorResponse('Error during logout', 500);
  }
}

/**
 * OPTIONS - Handle CORS preflight
 */
export async function OPTIONS(request: Request) {
  logger.info('Handling OPTIONS request');
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(),
  });
}