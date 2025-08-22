import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Critical performance optimizations for 1+ minute load times
  experimental: {
    scrollRestoration: true,
  },
  
  // Optimize for serverless
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  
  // Bundle optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Compress responses
  compress: true,
  
  images: {
    domains: [
      'lh3.googleusercontent.com', // Google profile images
      'avatars.githubusercontent.com', // GitHub profile images
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
