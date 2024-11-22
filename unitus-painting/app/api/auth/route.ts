// app/api/auth/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { createHash } from 'crypto';

// Test user configuration
const TEST_USER = {
  id: '1',
  email: 'admin@unitus.com',
  // Using SHA-256 hash of 'admin123' for comparison
  passwordHash: createHash('sha256').update('admin123').digest('hex')
};

// Environment configuration
const ENV = {
  isProd: process.env.NODE_ENV === 'production',
  jwtSecret: process.env.JWT_SECRET || 'default-development-secret'
};

// Helper function for password hashing
const hashPassword = (password: string) => {
  return createHash('sha256').update(password).digest('hex');
};

// CORS headers configuration
const CORS_HEADERS = {
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Origin': 'https://www.unituspainting.com',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
};

// Cookie configuration
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax' as const,
  path: '/',
  domain: '.unituspainting.com',
  maxAge: 86400 // 24 hours
};

// Helper function to create responses
const createResponse = (data: any, status: number = 200) => {
  return NextResponse.json(data, {
    status,
    headers: CORS_HEADERS
  });
};

export async function POST(request: NextRequest) {
  console.log('POST /api/auth - Starting authentication process');
  
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('Attempting login for email:', email);

    if (!email || !password) {
      return createResponse({
        success: false,
        message: 'Email and password are required'
      }, 400);
    }

    // Check credentials
    const hashedPassword = hashPassword(password);
    if (email === TEST_USER.email && hashedPassword === TEST_USER.passwordHash) {
      console.log('Valid credentials found for:', email);
      
      const token = jwt.sign(
        {
          userId: TEST_USER.id,
          email: TEST_USER.email,
          iat: Math.floor(Date.now() / 1000)
        },
        ENV.jwtSecret,
        { expiresIn: '24h' }
      );

      const response = createResponse({
        success: true,
        message: 'Login successful',
        user: {
          id: TEST_USER.id,
          email: TEST_USER.email
        }
      });

      // Set auth cookies
      response.cookies.set('auth-token', token, COOKIE_OPTIONS);
      response.cookies.set('admin', 'true', COOKIE_OPTIONS);

      console.log('Login successful, returning response');
      return response;
    }

    console.log('Invalid credentials for:', email);
    return createResponse({
      success: false,
      message: 'Invalid credentials'
    }, 401);

  } catch (error) {
    console.error('Login error:', error);
    return createResponse({
      success: false,
      message: 'Internal server error'
    }, 500);
  }
}

export async function GET(request: NextRequest) {
  console.log('GET /api/auth - Checking authentication');
  
  try {
    const authToken = request.cookies.get('auth-token');

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
      console.error('Token verification failed:', error);
      
      const response = createResponse({
        success: false,
        message: 'Invalid token'
      }, 401);

      response.cookies.set('auth-token', '', { ...COOKIE_OPTIONS, maxAge: 0 });
      response.cookies.set('admin', '', { ...COOKIE_OPTIONS, maxAge: 0 });

      return response;
    }
  } catch (error) {
    console.error('Auth check error:', error);
    return createResponse({
      success: false,
      message: 'Error checking authentication'
    }, 500);
  }
}

export async function DELETE(request: NextRequest) {
  console.log('DELETE /api/auth - Logging out');
  
  try {
    const response = createResponse({
      success: true,
      message: 'Logout successful'
    });

    response.cookies.set('auth-token', '', { ...COOKIE_OPTIONS, maxAge: 0 });
    response.cookies.set('admin', '', { ...COOKIE_OPTIONS, maxAge: 0 });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
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