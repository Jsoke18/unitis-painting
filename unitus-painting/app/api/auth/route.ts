// app/api/auth/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';

// Types
interface User {
  id: string;
  email: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  user?: User;
}

interface AuthCheckResponse {
  success: boolean;
  message: string;
  user?: User;
}

// Enhanced logging with source tracking
const logger = {
  info: (message: string, data?: any) => {
    console.log(`[AUTH] [INFO] ${message}`, data || '');
  },
  error: (message: string, error: any) => {
    console.error(`[AUTH] [ERROR] ${message}`, {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
      ...(error.cause && { cause: error.cause })
    });
  },
  debug: (message: string, data?: any) => {
    if (process.env.DEBUG === 'true') {
      console.debug(`[AUTH] [DEBUG] ${message}`, data || '');
    }
  }
};

// Environment configuration
const ENV = {
  isProd: process.env.NODE_ENV === 'production',
  baseDomain: 'unituspainting.com',
  get domain() {
    return this.isProd ? `www.${this.baseDomain}` : 'localhost';
  },
  get origin() {
    return this.isProd 
      ? `https://www.${this.baseDomain}`
      : 'http://localhost:3000';
  },
  jwtSecret: process.env.JWT_SECRET || 'development-secret',
  dbUrl: process.env.DATABASE_URL
};

// Test credentials
const TEST_CREDENTIALS = {
  email: 'admin@unitus.com',
  password: 'admin123',
  id: 'test-admin-id'
};

// Database initialization with error handling
const initDatabase = () => {
  if (!ENV.dbUrl) {
    logger.debug('No database URL provided, operating in test-only mode');
    return null;
  }

  try {
    return neon(ENV.dbUrl);
  } catch (error) {
    logger.error('Database initialization failed:', error);
    return null;
  }
};

const sql = initDatabase();

// CORS headers
const CORS_HEADERS = {
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Origin': ENV.origin,
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400'
};

// Cookie configuration
const getCookieOptions = () => ({
  httpOnly: true,
  secure: ENV.isProd,
  sameSite: 'lax' as const,
  path: '/',
  domain: ENV.isProd ? `.${ENV.baseDomain}` : undefined,
  maxAge: 86400 // 24 hours
});

// Helper functions
const createResponse = (data: any, status: number = 200): NextResponse => {
  const response = NextResponse.json(data, { 
    status,
    headers: CORS_HEADERS
  });
  return response;
};

const sanitizeUser = (user: any): User => ({
  id: user.id,
  email: user.email
});

const verifyDomain = (request: NextRequest): NextResponse | null => {
  if (!ENV.isProd) return null;

  const host = request.headers.get('host');
  if (host && !host.startsWith('www.')) {
    const url = new URL(request.url);
    url.host = ENV.domain;
    return NextResponse.redirect(url, { status: 308 });
  }
  return null;
};

const handleTestCredentials = (email: string, password: string) => {
  if (email === TEST_CREDENTIALS.email && password === TEST_CREDENTIALS.password) {
    return {
      id: TEST_CREDENTIALS.id,
      email: TEST_CREDENTIALS.email
    };
  }
  return null;
};

// Route handlers
export async function POST(request: NextRequest) {
  const domainRedirect = verifyDomain(request);
  if (domainRedirect) return domainRedirect;

  logger.debug('Processing login request', {
    headers: Object.fromEntries(request.headers.entries())
  });

  try {
    const body = await request.json();
    const { email, password } = body;

    logger.debug('Login attempt', { email });

    if (!email || !password) {
      return createResponse({ 
        success: false, 
        message: 'Email and password are required' 
      }, 400);
    }

    // Check test credentials first
    const testUser = handleTestCredentials(email, password);
    if (testUser) {
      logger.info('Login successful with test credentials', { email });
      
      const token = jwt.sign(
        { 
          userId: testUser.id,
          email: testUser.email,
          iat: Math.floor(Date.now() / 1000)
        },
        ENV.jwtSecret,
        { expiresIn: '24h' }
      );

      const response = createResponse({
        success: true,
        message: 'Login successful',
        user: testUser
      });

      const cookieOptions = getCookieOptions();
      logger.debug('Setting cookies with options', cookieOptions);
      
      response.cookies.set('auth-token', token, cookieOptions);
      response.cookies.set('admin', 'true', cookieOptions);

      return response;
    }

    // Regular database authentication
    if (!sql) {
      logger.error('Database not initialized');
      return createResponse({ 
        success: false, 
        message: 'Authentication service unavailable' 
      }, 503);
    }

    const users = await sql<any[]>`
      SELECT * FROM admin_users 
      WHERE email = ${email.toLowerCase().trim()}
    `;

    if (users.length === 0) {
      logger.info('Login failed: User not found', { email });
      return createResponse({ 
        success: false, 
        message: 'Invalid credentials' 
      }, 401);
    }

    const validPassword = await argon2.verify(users[0].password_hash, password);
    if (!validPassword) {
      logger.info('Login failed: Invalid password', { email });
      return createResponse({ 
        success: false, 
        message: 'Invalid credentials' 
      }, 401);
    }

    const token = jwt.sign(
      { 
        userId: users[0].id, 
        email: users[0].email,
        iat: Math.floor(Date.now() / 1000)
      },
      ENV.jwtSecret,
      { expiresIn: '24h' }
    );

    const response = createResponse({
      success: true,
      message: 'Login successful',
      user: sanitizeUser(users[0])
    });

    const cookieOptions = getCookieOptions();
    response.cookies.set('auth-token', token, cookieOptions);
    response.cookies.set('admin', 'true', cookieOptions);

    logger.info('Login successful', { email });
    return response;

  } catch (error) {
    logger.error('Login error:', error);
    return createResponse({ 
      success: false, 
      message: 'Internal server error' 
    }, 500);
  }
}

export async function GET(request: NextRequest) {
  const domainRedirect = verifyDomain(request);
  if (domainRedirect) return domainRedirect;

  logger.debug('Checking authentication status');

  try {
    const authToken = request.cookies.get('auth-token');
    logger.debug('Auth token present:', !!authToken);

    if (!authToken?.value) {
      return createResponse({ 
        success: false, 
        message: 'Not authenticated' 
      }, 401);
    }

    try {
      const decoded = jwt.verify(authToken.value, ENV.jwtSecret) as {
        userId: string;
        email: string;
      };

      return createResponse({
        success: true,
        message: 'Authenticated',
        user: {
          id: decoded.userId,
          email: decoded.email
        }
      });

    } catch (error) {
      logger.error('Token verification failed:', error);
      const response = createResponse({ 
        success: false, 
        message: 'Invalid token' 
      }, 401);

      const cookieOptions = getCookieOptions();
      response.cookies.set('auth-token', '', { ...cookieOptions, maxAge: 0 });
      response.cookies.set('admin', '', { ...cookieOptions, maxAge: 0 });

      return response;
    }

  } catch (error) {
    logger.error('Auth check error:', error);
    return createResponse({ 
      success: false, 
      message: 'Error checking authentication' 
    }, 500);
  }
}

export async function DELETE(request: NextRequest) {
  const domainRedirect = verifyDomain(request);
  if (domainRedirect) return domainRedirect;

  logger.debug('Processing logout request');

  try {
    const response = createResponse({
      success: true,
      message: 'Logout successful'
    });

    const cookieOptions = getCookieOptions();
    response.cookies.set('auth-token', '', { ...cookieOptions, maxAge: 0 });
    response.cookies.set('admin', '', { ...cookieOptions, maxAge: 0 });

    logger.info('Logout successful');
    return response;

  } catch (error) {
    logger.error('Logout error:', error);
    return createResponse({ 
      success: false, 
      message: 'Error during logout' 
    }, 500);
  }
}

export async function OPTIONS(request: NextRequest) {
  const domainRedirect = verifyDomain(request);
  if (domainRedirect) return domainRedirect;

  logger.debug('Handling OPTIONS request');
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS
  });
}