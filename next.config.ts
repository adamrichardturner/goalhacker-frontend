import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Link',
            value: '</manifest.json>; rel="manifest"',
          },
        ],
      },
    ]
  },
}

export default nextConfig
