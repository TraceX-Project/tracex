import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  reactStrictMode: false,
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
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
      {
	protocol: 'https',
	hostname: '*.googleusercontent.com',
	pathname: '/**',
      },

      // For minio (local)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/**',
      },

      // For minio (production)
      {
	protocol: 'https',
	hostname: 'tracex-minio.cloud.ce.kmitl.ac.th',
	pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
