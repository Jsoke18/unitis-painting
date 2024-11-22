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
        // Apply these headers to all routes
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
        ],
      },
    ];
  },
  // Uncomment if you need to handle rewrites
  // async rewrites() {
  //   return {
  //     beforeFiles: [
  //       // Add any rewrites here
  //     ],
  //   };
  // },
});

export default nextConfig;