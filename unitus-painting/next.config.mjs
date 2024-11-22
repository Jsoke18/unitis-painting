// next.config.js
import BuilderDevTools from "@builder.io/dev-tools/next";

/** @type {import('next').NextConfig} */
const nextConfig = BuilderDevTools()({
  reactStrictMode: true,
  
  images: {
    domains: ['cdn.builder.io'],
  },
  
  typescript: {
    ignoreBuildErrors: true,
  },
  
  experimental: {
    allowMiddlewareResponseBody: true
  },

  // Security headers configuration
  async headers() {
    const isProd = process.env.NODE_ENV === 'production';
    const origin = isProd ? 'https://unituspainting.com' : 'http://localhost:3000';
    
    return [
      {
        // API routes headers
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: origin
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With'
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true'
          },
          {
            key: 'Access-Control-Max-Age',
            value: '86400'
          }
        ]
      },
      {
        // Security headers for all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ];
  },

  // Middleware configuration to prevent interference with API routes
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: '/api/:path*',
          has: [
            {
              type: 'header',
              key: 'x-invoke-path',
            },
          ],
        },
      ],
    };
  },

  // Production optimization
  swcMinify: true,

  // Environment configuration
  env: {
    NEXT_PUBLIC_API_URL: process.env.NODE_ENV === 'production' 
      ? 'https://unituspainting.com/api'
      : 'http://localhost:3000/api'
  },

  // Disable powered by header
  poweredByHeader: false,

  // Asset prefix (if using CDN)
  assetPrefix: process.env.NODE_ENV === 'production' 
    ? 'https://unituspainting.com' 
    : '',

  // Other configurations
  compress: true,
  generateEtags: true,
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
});

export default nextConfig;