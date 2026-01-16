/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // If you're using images from external sources, add them here
  images: {
    remotePatterns: [
      // Example:
      // {
      //   protocol: 'https',
      //   hostname: 'example.com',
      // },
    ],
  },
}

module.exports = nextConfig;