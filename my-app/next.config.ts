import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack is the default bundler in Next.js 16+
  // The previous webpack config for .mjs files is no longer needed
  turbopack: {},
};

export default nextConfig;
