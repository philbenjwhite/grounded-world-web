import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  staticPageGenerationTimeout: 180,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.tina.io",
      },
      {
        protocol: "https",
        hostname: "media.licdn.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/about',
        destination: '/about-us',
        permanent: true,
      },
    ];
  },
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
