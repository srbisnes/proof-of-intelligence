import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // serverActions already stable in Next 15
  },
  // Avoid bundling issues with Hedera SDK on server
  serverExternalPackages: ["@hashgraph/sdk"],
};

export default nextConfig;
