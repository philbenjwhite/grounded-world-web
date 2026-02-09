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
      afterFiles: [
        // Proxy TinaCMS GraphQL requests to the local TinaCMS server
        {
          source: '/api/tina/gql',
          destination:
            process.env.NODE_ENV === 'development'
              ? 'http://localhost:4001/graphql'
              : '/api/tina/gql',
        },
      ],
    };
  },
};

export default nextConfig;
