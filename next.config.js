/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXTAUTH_URL:
      process.env.NEXTAUTH_URL || 'https://mydailycoffee.rivailjunior.com',
  },
  images: {
    domains: ['images.unsplash.com'],
  },
};

module.exports = nextConfig
