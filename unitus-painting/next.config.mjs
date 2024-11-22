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
  
  async headers() {
    return [
      {
        // Headers for API routes
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'production' 
              ? 'https://www.unituspainting.com' 
              : 'http://localhost:3000'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true'
          }
        ]
      },
      {
        // Security headers for all other routes
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          // Additional security headers
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
        ],
      },
    ];
  },

  // Add rewrites to handle API routes properly
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
});

export default nextConfig;