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

log.info('API route loaded, environment:', process.env.NODE_ENV);

// Validate environment variables
const requiredEnvVars = {
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET
};

// Check all required environment variables
Object.entries(requiredEnvVars).forEach(([name, value]) => {
  if (!value) {
    const error = `${name} is not defined in environment variables`;
    log.error(error, new Error(error));
    throw new Error(error);
  }
});

// Initialize database connection
const sql = neon(process.env.DATABASE_URL);
const JWT_SECRET = process.env.JWT_SECRET;

// Helper function to determine cookie domain
function getCookieDomain(request: Request) {
  if (process.env.NODE_ENV !== 'production') return undefined;
  
  const host = request.headers.get('host') || '';
  if (host.includes('unituspainting.com')) {
    return '.unituspainting.com';
  }
  return undefined;
}

// Cookie configuration function
function getCookieOptions(request: Request) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    domain: getCookieDomain(request)
  };
}

// Debug logging helper
function logCookieStatus(request: Request, response: NextResponse) {
  log.info('Cookie Debug Info:', {
    environment: process.env.NODE_ENV,
    host: request.headers.get('host'),
    requestCookies: request.headers.get('cookie'),
    responseCookies: response.headers.get('set-cookie'),
    secure: process.env.NODE_ENV === 'production',
    domain: getCookieDomain(request)
  });
}

// Helper function to sanitize user object
const sanitizeUser = (user: any) => ({
  id: user.id,
  email: user.email,
});

/**
 * Login handler
 */
export async function POST(request: Request) {
  log.info('Login request received');
  
  try {
    // Validate request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      log.error('Failed to parse request body', error);
      return NextResponse.json(
        { success: false, message: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { email, password } = body;

    log.info('Processing login attempt', { email: email?.toLowerCase() });

    // Validate required fields
    if (!email || !password) {
      log.info('Login failed: Missing required fields');
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get user from database
    let users;
    try {
      users = await sql`
        SELECT * FROM admin_users 
        WHERE email = ${email.toLowerCase().trim()}
      `;
    } catch (error) {
      log.error('Database query failed', error);
      return NextResponse.json(
        { success: false, message: 'Database error occurred' },
        { status: 500 }
      );
    }

    if (users.length === 0) {
      log.info('Login failed: User not found');
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const user = users[0];

    // Verify password
    let validPassword = false;
    try {
      validPassword = await argon2.verify(user.password_hash, password);
    } catch (error) {
      log.error('Password verification failed', error);
      return NextResponse.json(
        { success: false, message: 'Authentication error' },
        { status: 500 }
      );
    }

    if (!validPassword) {
      log.info('Login failed: Invalid password');
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    let token;
    try {
      token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          iat: Math.floor(Date.now() / 1000),
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
    } catch (error) {
      log.error('Token generation failed', error);
      return NextResponse.json(
        { success: false, message: 'Error generating authentication token' },
        { status: 500 }
      );
    }

    // Create response with cookies
    const response = NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        user: sanitizeUser(user)
      },
      { status: 200 }
    );

    const cookieOptions = getCookieOptions(request);

    // Set cookies
    response.cookies.set('auth-token', token, {
      ...cookieOptions,
      maxAge: 86400 // 24 hours
    });

    response.cookies.set('admin', 'true', {
      ...cookieOptions,
      maxAge: 86400 // 24 hours
    });

    // Log cookie status for debugging
    logCookieStatus(request, response);

    log.info('Login successful', { userId: user.id });
    return response;

  } catch (error) {
    log.error('Unexpected error during login', error);
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
  log.info('Logout request received');
  
  try {
    const response = NextResponse.json(
      {
        success: true,
        message: 'Logout successful'
      },
      { status: 200 }
    );

    const cookieOptions = getCookieOptions(request);

    // Clear cookies
    response.cookies.set('auth-token', '', {
      ...cookieOptions,
      maxAge: 0
    });

    response.cookies.set('admin', '', {
      ...cookieOptions,
      maxAge: 0
    });

    logCookieStatus(request, response);
    log.info('Logout successful');
    return response;
  } catch (error) {
    log.error('Error during logout', error);
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
  log.info('Auth check request received');
  
  try {
    const authToken = request.cookies.get('auth-token');
    log.info('Auth token present:', !!authToken);

    if (!authToken?.value) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    try {
      const decoded = jwt.verify(authToken.value, JWT_SECRET) as {
        userId: string;
        email: string;
      };

      log.info('Token verified successfully', { userId: decoded.userId });
      return NextResponse.json({
        success: true,
        message: 'Authenticated',
        user: {
          id: decoded.userId,
          email: decoded.email,
        }
      });
    } catch (error) {
      log.error('Token verification failed', error);
      
      const response = NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );

      const cookieOptions = getCookieOptions(request);

      // Clear invalid cookies
      response.cookies.set('auth-token', '', {
        ...cookieOptions,
        maxAge: 0
      });

      response.cookies.set('admin', '', {
        ...cookieOptions,
        maxAge: 0
      });

      return response;
    }

  } catch (error) {
    log.error('Auth check error', error);
    return NextResponse.json(
      { success: false, message: 'Error checking authentication' },
      { status: 500 }
    );
  }
}

/**
 * Handle OPTIONS requests for CORS
 */
export async function OPTIONS(request: Request) {
  log.info('CORS preflight request received');
  
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}