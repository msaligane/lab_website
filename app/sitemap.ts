import type { MetadataRoute } from 'next'
import { getNewsSlugs, getResearchSlugs } from '@/lib/content'
import { siteUrl } from '@/app/layout'
import { getPublishedTapeouts } from '@/lib/tapeouts'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [newsSlugs, researchSlugs, tapeouts] = await Promise.all([
    getNewsSlugs(),
    getResearchSlugs(),
    getPublishedTapeouts(),
  ])

  const staticRoutes: { path: string; priority: number }[] = [
    { path: '', priority: 1 },
    { path: '/team', priority: 0.9 },
    { path: '/research', priority: 0.8 },
    { path: '/publications', priority: 0.8 },
    { path: '/news', priority: 0.7 },
    { path: '/contact', priority: 0.5 },
  ]

  return [
    ...tapeouts.map((project) => ({
      url: `${siteUrl}/tapeouts/${project.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...staticRoutes.map(({ path, priority }) => ({
      url: `${siteUrl}${path}`,
      changeFrequency: 'monthly' as const,
      priority,
    })),
    ...newsSlugs.map((slug) => ({
      url: `${siteUrl}/news/${slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...researchSlugs.map((slug) => ({
      url: `${siteUrl}/research/${slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]
}
