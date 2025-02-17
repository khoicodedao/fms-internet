import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // Bỏ qua kiểm tra ESLint khi build
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  i18n: {
    locales: ["en", "vi"], // Danh sách ngôn ngữ
    defaultLocale: "en", // Ngôn ngữ mặc định
  },
};

export default nextConfig;
