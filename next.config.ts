import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  server: {
    https: true
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "prod-img.thesouledstore.com",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        port: "",
        pathname: "/**"
      }
    ]
  }
};

export default nextConfig;
