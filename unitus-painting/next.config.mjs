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
    return [
      {
        // API routes headers
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'production' 
              ? 'https://unituspainting.com'
              : 'http://localhost:3000'
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

  // Rewrites configuration for API routes
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

  // Webpack configuration
  webpack: (config, { dev, isServer }) => {
    // Enable source maps in development
    if (dev) {
      config.devtool = 'eval-source-map';
    }

    // Add any custom webpack configurations here
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    return config;
  },

  // Output configuration
  output: 'standalone',

  // Compression configuration
  compress: true,

  // Powered by header
  poweredByHeader: false,

  // Asset prefix (if using CDN)
  assetPrefix: process.env.NODE_ENV === 'production' 
    ? 'https://unituspainting.com' 
    : '',

  // Trailing slash handling
  trailingSlash: false,

  // Custom build directory
  distDir: '.next',

  // Generate ETags
  generateEtags: true,

  // Page extensions
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],

  // Custom build ID
  generateBuildId: async () => {
    // You can add custom build ID generation here
    return 'unitus-build-' + Date.now();
  },

  // On demand entries
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },

  // Custom runtime configuration
  serverRuntimeConfig: {
    // Will only be available on the server side
    mySecret: 'secret',
  },

  // Public runtime configuration
  publicRuntimeConfig: {
    // Will be available on both server and client
    staticFolder: '/static',
  }
});

export default nextConfig;