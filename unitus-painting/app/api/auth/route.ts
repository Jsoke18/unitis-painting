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

// Enhanced logging
const logger = {
  info: (message: string, data?: any) => {
    console.log(`[AUTH] [INFO] ${message}`, data || '');
  },
  error: (message: string, error: any) => {
    console.error(`[AUTH] [ERROR] ${message}`, {
      name: error?.name,
      message: error?.message,
      stack: error?.stack
    });
  },
  debug: (message: string, data?: any) => {
    if (process.env.DEBUG === 'true') {
      console.debug(`[AUTH] [DEBUG] ${message}`, data || '');
    }
  }
};

// Environment and configuration
const ENV = {
  isProd: process.env.NODE_ENV === 'production',
  domain: process.env.NODE_ENV === 'production' ? 'unituspainting.com' : 'localhost',
  jwtSecret: process.env.JWT_SECRET!,
  dbUrl: process.env.DATABASE_URL!
};

// Initialize database
const sql = neon(ENV.dbUrl);

// CORS configuration
const CORS_HEADERS = {
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Origin': ENV.isProd 
    ? `https://${ENV.domain}` 
    : `http://${ENV.domain}:3000`,
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
  domain: ENV.isProd ? `.${ENV.domain}` : undefined,
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

// Route handlers
export async function POST(request: NextRequest) {
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
    logger.debug('Setting cookies with options', cookieOptions);
    
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

export async function OPTIONS() {
  logger.debug('Handling OPTIONS request');
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS
  });
}