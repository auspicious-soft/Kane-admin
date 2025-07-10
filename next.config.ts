// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   reactStrictMode:false,
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//        hostname: process.env.AWS_BUCKET_NAME ? `${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com` : '',
//         pathname: '/api/**',
//       },
//       {
//         protocol: 'https',
//         hostname: 'via.placeholder.com',
//         pathname: '/**',
//       },
//     ],
//   },
//   experimental: {
//     // Enable if you want to use the auth interrupts feature
//     // authInterrupts: true,
//   },
// };

// export default nextConfig;




/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure image optimization
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.AWS_BUCKET_NAME ? `${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com` : '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config: import('webpack').Configuration, { isServer }: { isServer: boolean }) => {
    if (!isServer) {
      config.resolve = config.resolve || {};
      config.resolve.fallback = {
        fs: false,
        path: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
