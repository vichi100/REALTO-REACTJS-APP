import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://172.20.10.8:7002/:path*', // Proxy to Backend
      },
    ]
  },
  reactStrictMode: false,
};

export default nextConfig;
