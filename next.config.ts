import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Enable proxy (replaces middleware in Next.js 16)
    proxyTimeout: 30000,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
