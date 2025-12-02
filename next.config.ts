import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'instagram.fhan14-3.fna.fbcdn.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.fbcdn.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.cdninstagram.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.pinimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'down-vn.img.susercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.backblazeb2.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.s3.us-east-005.backblazeb2.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
