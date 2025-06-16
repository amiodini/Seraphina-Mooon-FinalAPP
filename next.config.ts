import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  imges: {
    remotePatterns: [
      {
        hostname: 'img.clerk.com'
      }
    ]
  }
};

export default nextConfig;
