import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Netlify-specific optimizations
  trailingSlash: false,
  
  // Critical performance optimizations for production cold starts
  experimental: {
    scrollRestoration: true,
  },
  
  // Remove standalone for Netlify - use default
  // output: 'standalone', // Comment out for Netlify
  poweredByHeader: false,
  
  // Bundle optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Compress responses aggressively
  compress: true,
  
  // Add headers to improve caching and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          }
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      }
    ];
  },
  
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com',
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
