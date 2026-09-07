/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'admin.gadgetmartbd.shop',
      },
    ],
  },
};

export default nextConfig;