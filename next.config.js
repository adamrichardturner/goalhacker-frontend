/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    reactCompiler: true,
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
      {
        source: '/default-goal-images/:path*',
        destination: `${apiUrl}/api/images/default-goal-images/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${apiUrl}/api/images/uploads/:path*`,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/api/images/**',
      },
    ],
    domains: ['localhost'],
  },
}

module.exports = nextConfig
