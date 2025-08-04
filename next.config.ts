import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  transpilePackages: ['@t3-oss/env-nextjs', '@t3-oss/env-core'],
  images: {
    remotePatterns: [
      // For Google profile images
      new URL('https://lh3.googleusercontent.com/**'),
      new URL('https://media.router-switch.com/**'),
      new URL('https://www.cisco.com/**'),
    ],
  },
};

export default nextConfig;
