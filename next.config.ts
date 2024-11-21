import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // Bỏ qua kiểm tra ESLint khi build
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
