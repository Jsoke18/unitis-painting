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
});

export default nextConfig;