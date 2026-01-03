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

      // For mock up images
      new URL('https://media.router-switch.com/**'),
      new URL('https://www.cisco.com/**'),
      {
        protocol: 'https',
        hostname: 'nc.agogfox.cc',
        port: '',
        pathname: '/**', // This allows all paths from this domain
      },
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
