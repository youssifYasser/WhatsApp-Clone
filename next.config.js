/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: [
      'assets.stickpng.com',
      'lh3.googleusercontent.com',
      'ik.imagekit.io',
    ],
  },
}

module.exports = nextConfig
