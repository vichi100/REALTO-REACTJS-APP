import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const host = process.env.NEXT_PUBLIC_APP_HOST || 'localhost';
    return [
      {
        source: '/api/:path*',
        destination: `http://${host}:7002/:path*`, // Proxy to Backend
      },
    ]
  },
  reactStrictMode: false,
  experimental: {
    // @ts-expect-error - allowedDevOrigins is a valid config but types might be missing
    allowedDevOrigins: ["192.168.1.4"],
  },
};

export default nextConfig;
