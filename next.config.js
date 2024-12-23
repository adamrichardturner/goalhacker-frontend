/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  distDir: 'out',
  trailingSlash: false,
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig
