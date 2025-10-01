import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure proper static generation
  trailingSlash: false,
};

export default nextConfig;
