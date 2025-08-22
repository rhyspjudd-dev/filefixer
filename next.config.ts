import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove problematic optimizations that break production
  experimental: {
    scrollRestoration: true,
  },
  
  // Optimize for serverless cold starts
  output: 'standalone',
  poweredByHeader: false,
  
  // Compress responses
  compress: true,
  
  // Optimize images
  images: {
    domains: [
      'lh3.googleusercontent.com', // Google profile images
      'avatars.githubusercontent.com', // GitHub profile images
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Headers for performance (simplified)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ],
      }
    ];
  },
};

export default nextConfig;
