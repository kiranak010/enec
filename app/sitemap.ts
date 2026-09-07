import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { site } from '@/config/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // Static public pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: site.url, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${site.url}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${site.url}/about/history`, lastModified: now, changeFrequency: 'yearly', priority: 0.7 },
    { url: `${site.url}/about/leadership`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${site.url}/teams`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${site.url}/about/governance`, lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${site.url}/nuclear-energy`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${site.url}/nuclear-energy/technology`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${site.url}/nuclear-energy/safety`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${site.url}/projects`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${site.url}/sustainability`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${site.url}/sustainability/environment`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${site.url}/sustainability/community`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${site.url}/sustainability/reports`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${site.url}/safety`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${site.url}/innovation`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${site.url}/innovation/research`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${site.url}/news`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${site.url}/media`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${site.url}/documents`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${site.url}/careers`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${site.url}/careers/jobs`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${site.url}/suppliers`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${site.url}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.7 },
    { url: `${site.url}/search`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${site.url}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${site.url}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${site.url}/accessibility`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]

  // Dynamic project pages
  let projectPages: MetadataRoute.Sitemap = []
  try {
    const projects = await prisma.project.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    })
    projectPages = projects.map((p) => ({
      url: `${site.url}/projects/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))
  } catch {
    // DB may not be available during build
  }

  // Dynamic news pages
  let newsPages: MetadataRoute.Sitemap = []
  try {
    const articles = await prisma.newsArticle.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true },
    })
    newsPages = articles.map((a) => ({
      url: `${site.url}/news/${a.slug}`,
      lastModified: a.updatedAt,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    }))
  } catch {
    // DB may not be available during build
  }

  // Dynamic job pages
  let jobPages: MetadataRoute.Sitemap = []
  try {
    const jobs = await prisma.job.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true },
    })
    jobPages = jobs.map((j) => ({
      url: `${site.url}/careers/jobs/${j.slug}`,
      lastModified: j.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  } catch {
    // DB may not be available during build
  }

  return [...staticPages, ...projectPages, ...newsPages, ...jobPages]
}