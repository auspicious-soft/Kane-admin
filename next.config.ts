import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode:false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        pathname: '/api/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    // Enable if you want to use the auth interrupts feature
    // authInterrupts: true,
  },
};

export default nextConfig;

