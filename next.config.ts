import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Comment out or remove this section
    turbo: {
      rules: {
        "*.css": ["@tailwindcss/postcss", "css"],
      },
    },
  },
};

export default nextConfig;
