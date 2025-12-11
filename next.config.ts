import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://192.168.1.10:7002/:path*', // Proxy to Backend
      },
    ]
  },
};

export default nextConfig;
