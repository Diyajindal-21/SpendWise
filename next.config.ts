import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
    ],
  },
  outputFileTracingRoot: path.resolve(__dirname),
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  webpack: (config) => {
    config.snapshot = {
      ...config.snapshot,
      managedPaths: [],
    };
    config.watchOptions = {
      ignored: [
        '**/C:/Users/diyaj/Application Data/**',
        '**/C:/Users/diyaj/Cookies/**',
        '**/C:/Users/diyaj/AppData/**',
      ],
    };
    return config;
  },
};

export default nextConfig;
