/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  distDir: 'out',
  trailingSlash: false,
  reactStrictMode: false,
  experimental: {
    reactCompiler: true,
  },
}

module.exports = nextConfig
