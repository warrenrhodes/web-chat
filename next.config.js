/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  productionBrowserSourceMaps: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {},
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "loremflickr.com",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
      resolveExtensions: [".tsx", ".ts", ".jsx", ".js"],
    },
  },
};

module.exports = nextConfig;
