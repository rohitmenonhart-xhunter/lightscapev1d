/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Enable image optimization for Vercel deployment
  images: {
    domains: [],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Optimize for production
  productionBrowserSourceMaps: false,
  swcMinify: true,
  poweredByHeader: false,
  reactStrictMode: true,
  // Configure compression
  compress: true,
};

module.exports = nextConfig;
