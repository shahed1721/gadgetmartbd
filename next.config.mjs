/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gadgetmartbd.shop',
      },
    ],
  },
};

export default nextConfig;