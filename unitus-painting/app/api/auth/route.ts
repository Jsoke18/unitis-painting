// app/api/auth/route.js
import { NextResponse } from 'next/server';

// In a real application, these would be stored securely in a database
const VALID_CREDENTIALS = {
  email: 'admin@unituspainting.com',
  password: 'admin123' // In production, use a proper hashed password
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (email === VALID_CREDENTIALS.email && password === VALID_CREDENTIALS.password) {
      return NextResponse.json({ 
        success: true, 
        token: 'dummy-jwt-token' // In production, generate a proper JWT
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}