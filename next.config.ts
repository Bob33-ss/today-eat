import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Next.js 16 稳定版特性
  },
  // AI 请求超时调大
  serverExternalPackages: ["@prisma/client"],
};

export default nextConfig;
