import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ✅ ข้ามการตรวจสอบ ESLint ตอน build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ✅ ข้ามการตรวจสอบ TypeScript ตอน build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
