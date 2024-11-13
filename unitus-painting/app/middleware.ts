// middleware.ts
import { NextResponse } from 'next/server';
import { createClient } from '@vercel/edge-config';

// Define config for matching routes
export const config = {
  matcher: '/welcome'
};

// Create Edge Config client
const edge = createClient(process.env.EDGE_CONFIG!);

export async function middleware() {
  try {
    // Get greeting from Edge Config
    const greeting = await edge.get('greeting');
    
    // Return JSON response
    return NextResponse.json(
      { greeting },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
        }
      }
    );
  } catch (error) {
    console.error('Edge Config error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch greeting' },
      { status: 500 }
    );
  }
}

// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    allowMiddlewareResponseBody: true
  }
};

module.exports = nextConfig;

// .env.local
EDGE_CONFIG="your_edge_config_url_here"

// app/welcome/page.tsx
'use client';

import { useEffect, useState } from 'react';

export default function WelcomePage() {
  const [greeting, setGreeting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/welcome')
      .then(res => res.json())
      .then(data => setGreeting(data.greeting))
      .catch(err => setError(err.message));
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!greeting) return <div>Loading...</div>;

  return <div>{greeting}</div>;
}