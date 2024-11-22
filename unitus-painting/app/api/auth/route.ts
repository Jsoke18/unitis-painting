// app/api/auth/route.ts
import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';

console.log('API route loaded, environment:', process.env.NODE_ENV);

// Validate environment variables
const requiredEnvVars = {
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET
};

// Check all required environment variables
Object.entries(requiredEnvVars).forEach(([name, value]) => {
  if (!value) {
    console.error(`${name} is not defined in environment variables`);
    throw new Error(`${name} is not defined in environment variables`);
  }
});

const sql = neon(process.env.DATABASE_URL);
const JWT_SECRET = process.env.JWT_SECRET;

// Cookie configuration
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
};

/**
 * Login handler
 */
export async function POST(request: Request) {
  console.log('POST /api/auth - Login request received');
  
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('Login attempt for email:', email);

    if (!email || !password) {
      console.log('Login failed: Missing email or password');
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get user from database
    console.log('Querying database for user');
    const users = await sql`
      SELECT * FROM admin_users 
      WHERE email = ${email.toLowerCase().trim()}
    `;

    if (users.length === 0) {
      console.log('Login failed: User not found');
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const user = users[0];
    console.log('User found, verifying password');

    // Verify password
    try {
      const validPassword = await argon2.verify(user.password_hash, password);
      if (!validPassword) {
        console.log('Login failed: Invalid password');
        return NextResponse.json(
          { success: false, message: 'Invalid credentials' },
          { status: 401 }
        );
      }
    } catch (error) {
      console.error('Password verification error:', error);
      return NextResponse.json(
        { success: false, message: 'Authentication error' },
        { status: 500 }
      );
    }

    console.log('Password verified, generating JWT');

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        iat: Math.floor(Date.now() / 1000),
      },
      JWT_SECRET,
      {
        expiresIn: '24h',
      }
    );

    console.log('Creating response with cookies');

    // Create response with cookies
    const response = NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email
        }
      },
      { status: 200 }
    );

    // Set cookies
    response.cookies.set('auth-token', token, {
      ...cookieOptions,
      maxAge: 86400 // 24 hours
    });

    response.cookies.set('admin', 'true', {
      ...cookieOptions,
      maxAge: 86400 // 24 hours
    });

    console.log('Login successful, returning response');
    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Logout handler
 */
export async function DELETE(request: Request) {
  console.log('DELETE /api/auth - Logout request received');
  
  try {
    const response = NextResponse.json(
      {
        success: true,
        message: 'Logout successful'
      },
      { status: 200 }
    );

    // Clear cookies
    console.log('Clearing auth cookies');
    response.cookies.set('auth-token', '', {
      ...cookieOptions,
      maxAge: 0
    });

    response.cookies.set('admin', '', {
      ...cookieOptions,
      maxAge: 0
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, message: 'Error during logout' },
      { status: 500 }
    );
  }
}

/**
 * GET handler for checking auth status
 */
export async function GET(request: Request) {
  console.log('GET /api/auth - Auth check request received');
  
  try {
    const authToken = request.cookies.get('auth-token');
    console.log('Auth token present:', !!authToken);

    if (!authToken?.value) {
      console.log('Auth check failed: No token found');
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    try {
      console.log('Verifying JWT token');
      const decoded = jwt.verify(authToken.value, JWT_SECRET) as {
        userId: string;
        email: string;
      };

      console.log('Token verified, user authenticated');
      return NextResponse.json({
        success: true,
        message: 'Authenticated',
        user: {
          id: decoded.userId,
          email: decoded.email,
        }
      });
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { success: false, message: 'Error checking authentication' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS(request: Request) {
  console.log('OPTIONS /api/auth - CORS preflight request received');
  
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}