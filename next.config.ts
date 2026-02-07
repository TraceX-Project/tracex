import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  reactStrictMode: false,
  transpilePackages: ['@t3-oss/env-nextjs', '@t3-oss/env-core'],
  async redirects() {
    return [
      {
        source: '/projects/:projectId',
        destination: '/projects/:projectId/logical',
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      // For Google profile images
      new URL('https://lh3.googleusercontent.com/**'),

      // For minio (local)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
