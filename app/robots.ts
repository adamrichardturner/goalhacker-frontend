import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://goalhacker.app'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/goals/', // Private user data
        '/login/',
        '/signup/',
        '/reset-password/',
        '/verify-email/',
        '/await-verification/',
        '/privacy',
        '/terms',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
