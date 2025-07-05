/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn-images-3.listennotes.com",
      },
    ],
  },
};

module.exports = nextConfig;
