
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  serverActions: {
    bodySizeLimit: '200mb',
  },
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
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
        // Ensures leaflet's images can be loaded
        config.resolve.alias['leaflet/dist/images'] = require.resolve('leaflet/dist/images');
    }
    return config;
  },
};

export default nextConfig;
