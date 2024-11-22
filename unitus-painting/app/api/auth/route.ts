// app/api/auth/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { headers } from 'next/headers';

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

// Enhanced logging
const logger = {
  info: (message: string, ...args: any[]) => {
    console.log(`[AUTH] [INFO] ${message}`, ...args);
  },
  error: (message: string, error: any) => {
    console.error(`[AUTH] [ERROR] ${message}`, {
      name: error?.name,
      message: error?.message,
      stack: error?.stack
    });
  }
};

// Database initialization
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

const sql = neon(process.env.DATABASE_URL);

// JWT configuration
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}

const JWT_SECRET = process.env.JWT_SECRET;

// Domain configuration
const PRODUCTION_DOMAIN = 'unituspainting.com';
const DEV_DOMAIN = 'localhost';

// Environment-specific configurations
const isProduction = process.env.NODE_ENV === 'production';
const DOMAIN = isProduction ? PRODUCTION_DOMAIN : DEV_DOMAIN;
const PROTOCOL = isProduction ? 'https' : 'http';
const BASE_URL = isProduction ? `https://${PRODUCTION_DOMAIN}` : `http://${DEV_DOMAIN}:3000`;

// CORS and cookie configurations
const CORS_HEADERS = {
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Origin': BASE_URL,
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400',
};

const getCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: 'lax' as const,
  path: '/',
  domain: isProduction ? `.${PRODUCTION_DOMAIN}` : undefined, // Note the dot prefix for production
  maxAge: 86400 // 24 hours
});

// Helper functions
const sanitizeUser = (user: any): User => ({
  id: user.id,
  email: user.email,
});

const createResponse = (data: any, status: number = 200): NextResponse => {
  const response = NextResponse.json(data, { 
    status,
    headers: CORS_HEADERS
  });
  return response;
};

// Route handlers
export async function POST(request: NextRequest) {
  logger.info('Processing login request');

  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate inputs
    if (!email || !password) {
      return createResponse({ 
        success: false, 
        message: 'Email and password are required' 
      }, 400);
    }

    // Query database
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

    // Verify password
    const validPassword = await argon2.verify(users[0].password_hash, password);
    if (!validPassword) {
      logger.info('Login failed: Invalid password', { email });
      return createResponse({ 
        success: false, 
        message: 'Invalid credentials' 
      }, 401);
    }

    // Generate JWT
    const token = jwt.sign(
      { 
        userId: users[0].id, 
        email: users[0].email,
        iat: Math.floor(Date.now() / 1000)
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Create success response
    const response = createResponse({
      success: true,
      message: 'Login successful',
      user: sanitizeUser(users[0])
    });

    // Set auth cookies
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
  logger.info('Checking authentication status');

  try {
    const authToken = request.cookies.get('auth-token');

    if (!authToken?.value) {
      return createResponse({ 
        success: false, 
        message: 'Not authenticated' 
      }, 401);
    }

    try {
      const decoded = jwt.verify(authToken.value, JWT_SECRET) as {
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

      // Clear invalid cookies
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
  logger.info('Processing logout request');

  try {
    const response = createResponse({
      success: true,
      message: 'Logout successful'
    });

    // Clear cookies
    const cookieOptions = getCookieOptions();
    response.cookies.set('auth-token', '', { ...cookieOptions, maxAge: 0 });
    response.cookies.set('admin', '', { ...cookieOptions, maxAge: 0 });

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
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS
  });
}