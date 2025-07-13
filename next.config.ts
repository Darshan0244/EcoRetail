import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.grown.bio',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'mushroompackaging.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.yankodesign.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
