import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://192.168.1.3:7002/:path*', // Proxy to Backend
      },
    ]
  },
  reactStrictMode: false,
  experimental: {
    // @ts-expect-error - allowedDevOrigins is a valid config but types might be missing
    allowedDevOrigins: ["192.168.1.3"],
  },
};

export default nextConfig;
