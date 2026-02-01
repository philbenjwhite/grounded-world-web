import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/storybook',
          destination: '/storybook/index.html',
        },
      ],
    };
  },
};

export default nextConfig;
