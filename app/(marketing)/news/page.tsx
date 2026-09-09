import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Search,
  SearchX,
} from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import Button from '@/components/ui/button'
import PageHeader from '@/components/ui/page-header'
import CardImage from '@/components/ui/card-image'
import Reveal from '@/components/ui/reveal'
import { newsImage, images } from '@/lib/images'

export const metadata: Metadata = {
  title: 'News & Insights',
  description:
    'Latest news, announcements and insights from Emirates Nuclear Energy Corporation — covering innovation, safety, corporate milestones and the clean-energy workforce.',
}

interface NewsArticleData {
  title: string
  slug: string
  subtitle: string | null
  excerpt: string
  categoryName: string
  publishedAt: string
  readTimeMins: number | null
  isFeatured: boolean
}

const categoryColors: Record<string, string> = {
  'Nuclear Innovation': 'bg-cyan-500/10 text-cyan-700',
  Innovation: 'bg-blue-500/10 text-blue-700',
  Corporate: 'bg-navy-500/10 text-navy-700',
  Safety: 'bg-emerald-500/10 text-emerald-700',
  Careers: 'bg-amber-500/10 text-amber-700',
}

const fallbackArticles: NewsArticleData[] = [
  {
    title: 'Advancing Next-Generation Reactor Technology',
    slug: 'advancing-next-generation-reactor-technology',
    subtitle:
      'A closer look at how advanced reactor designs are reshaping the economics and geography of clean baseload power.',
    excerpt:
      'Our latest breakthrough in advanced reactor design promises to expand where and how clean nuclear power can be deployed — from compact modular units to integrated energy hubs.',
    categoryName: 'Nuclear Innovation',
    publishedAt: '2025-11-15T09:00:00Z',
    readTimeMins: 6,
    isFeatured: true,
  },
  {
    title: 'Global Partnership for Clean Energy Expansion',
    slug: 'global-partnership-for-clean-energy-expansion',
    subtitle:
      'ENEC joins international partners to accelerate new nuclear capacity across emerging markets.',
    excerpt:
      'ENEC has signed a landmark framework agreement with international partners to develop new nuclear capacity — unlocking a clean, reliable power pathway for emerging economies.',
    categoryName: 'Corporate',
    publishedAt: '2025-10-28T10:30:00Z',
    readTimeMins: 4,
    isFeatured: false,
  },
  {
    title: 'New Safety Standards Set Industry Benchmark',
    slug: 'new-safety-standards-set-industry-benchmark',
    subtitle:
      'Our updated safety protocols exceed international regulatory requirements and set a new standard for operations.',
    excerpt:
      'Our updated safety protocols exceed international regulatory requirements and establish a new gold standard for nuclear operations worldwide.',
    categoryName: 'Safety',
    publishedAt: '2025-10-10T08:15:00Z',
    readTimeMins: 5,
    isFeatured: false,
  },
  {
    title: "Investing in Tomorrow's Energy Workforce",
    slug: 'investing-in-tomorrows-energy-workforce',
    subtitle:
      'New graduate programmes and apprenticeships are building the next generation of nuclear professionals.',
    excerpt:
      'With the clean-energy sector growing rapidly, ENEC is expanding graduate programmes, apprenticeships and partnerships with universities to build the workforce of the future.',
    categoryName: 'Careers',
    publishedAt: '2025-09-22T14:00:00Z',
    readTimeMins: 3,
    isFeatured: false,
  },
  {
    title: 'Milestone: 25 GW of Clean Energy Capacity',
    slug: 'milestone-25-gw-of-clean-energy-capacity',
    subtitle:
      'Across our global fleet, clean nuclear capacity has reached 25 gigawatts.',
    excerpt:
      'ENEC has reached a significant corporate milestone — 25 gigawatts of operating clean-energy capacity across its global portfolio.',
    categoryName: 'Corporate',
    publishedAt: '2025-09-05T09:45:00Z',
    readTimeMins: 4,
    isFeatured: false,
  },
  {
    title: 'Pioneering AI-Driven Predictive Maintenance',
    slug: 'pioneering-ai-driven-predictive-maintenance',
    subtitle:
      'Machine learning is reducing downtime and strengthening safety across our stations.',
    excerpt:
      'We are deploying AI-driven predictive maintenance across our fleet — using sensor data and machine learning to improve availability while strengthening safety at every station.',
    categoryName: 'Innovation',
    publishedAt: '2025-08-18T11:20:00Z',
    readTimeMins: 5,
    isFeatured: false,
  },
  {
    title: 'ENEC Reports Record Generation in 2025',
    slug: 'enec-reports-record-generation-in-2025',
    subtitle:
      'Annual clean power output reached a new all-time high across the fleet.',
    excerpt:
      'A full year of reliable operation delivered record low-carbon generation — enough clean electricity to power millions of homes region-wide.',
    categoryName: 'Corporate',
    publishedAt: '2025-12-12T09:00:00Z',
    readTimeMins: 4,
    isFeatured: false,
  },
  {
    title: 'SMR Technology Roadmap Unveiled',
    slug: 'smr-technology-roadmap-unveiled',
    subtitle:
      'A step-by-step plan brings small modular reactor deployment closer to reality.',
    excerpt:
      'ENEC has released a detailed roadmap for small modular reactor deployment, including siting assessments, licensing groundwork and partnerships with reactor vendors.',
    categoryName: 'Nuclear Innovation',
    publishedAt: '2025-11-30T10:00:00Z',
    readTimeMins: 5,
    isFeatured: false,
  },
  {
    title: 'Nuclear Skills Academy Launched',
    slug: 'nuclear-skills-academy-launched',
    subtitle:
      'A new academy with leading universities builds the skilled workforce of tomorrow.',
    excerpt:
      'ENEC and partner universities have launched a dedicated Nuclear Skills Academy offering specialised degrees, apprenticeships and continuous professional development.',
    categoryName: 'Careers',
    publishedAt: '2025-11-05T09:30:00Z',
    readTimeMins: 3,
    isFeatured: false,
  },
  {
    title: 'Advanced Fuel: A More Efficient Nuclear Cycle',
    slug: 'advanced-fuel-more-efficient-nuclear-cycle',
    subtitle:
      'New fuel technologies could extend cycle length and improve plant economics.',
    excerpt:
      'Pilot programmes are evaluating advanced fuel assemblies that promise longer cycles, higher burnup and reduced waste for operating reactors.',
    categoryName: 'Innovation',
    publishedAt: '2025-10-18T08:00:00Z',
    readTimeMins: 6,
    isFeatured: false,
  },
]

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30'

async function fetchArticles(): Promise<NewsArticleData[]> {
  try {
    const rows = await prisma.newsArticle.findMany({
      where: { status: 'PUBLISHED' },
      include: { category: true },
      orderBy: { publishedAt: 'desc' },
      take: 60,
    })

    if (rows.length > 0) {
      return rows.map((a) => ({
        title: a.title,
        slug: a.slug,
        subtitle: a.subtitle,
        excerpt: a.excerpt,
        categoryName: a.category.name,
        publishedAt: (a.publishedAt ?? a.createdAt).toISOString(),
        readTimeMins: a.readTimeMins,
        isFeatured: a.isFeatured,
      }))
    }
  } catch {
    // Database not available — use fallback
  }

  return fallbackArticles
}

interface NewsSearchParams {
  category?: string
  q?: string
  page?: string
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<NewsSearchParams>
}) {
  const sp = await searchParams

  const categoryFilter =
    typeof sp.category === 'string' ? sp.category : undefined
  const q = typeof sp.q === 'string' ? sp.q.trim().toLowerCase() : undefined
  const pageNum =
    typeof sp.page === 'string'
      ? Math.max(1, parseInt(sp.page, 10) || 1)
      : 1

  const articles = await fetchArticles()

  const categories = Array.from(
    new Set(articles.map((a) => a.categoryName))
  ).sort()

  let filtered = articles

  if (categoryFilter) {
    filtered = filtered.filter((a) => a.categoryName === categoryFilter)
  }
  if (q) {
    filtered = filtered.filter((a) =>
      `${a.title} ${a.subtitle ?? ''} ${a.excerpt} ${a.categoryName}`
        .toLowerCase()
        .includes(q)
    )
  }

  const pageSize = 9
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(pageNum, totalPages)
  const startIndex = (currentPage - 1) * pageSize
  const pageArticles = filtered.slice(startIndex, startIndex + pageSize)

  const featured = filtered.find((a) => a.isFeatured) ?? pageArticles[0]
  const rest = pageArticles.filter((a) => a !== featured)

  const buildHref = (
    overrides: Partial<NewsSearchParams>
  ): string => {
    const params = new URLSearchParams()
    if (categoryFilter) params.set('category', categoryFilter)
    if (q) params.set('q', q)
    Object.entries(overrides).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
    const query = params.toString()
    return query ? `/news?${query}` : '/news'
  }

  const categoryBadge = (name: string) => (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${categoryColors[name] ?? 'bg-slate-100 text-slate-600'}`}
    >
      {name}
    </span>
  )

  return (
    <>
      <PageHeader
        eyebrow="News & Media"
        title="News &amp; Insights"
        description={
          <>
            Official announcements, industry perspectives and updates from
            across our global operations — delivering clean energy with
            safety, innovation and integrity.
          </>
        }
        image={images.mediaBriefing}
      />

      <section className="section-padding bg-slate-50">
        <div className="container-narrow">
          <div className="flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              <Link
                href={buildHref({ category: undefined })}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  !categoryFilter
                    ? 'bg-navy-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={buildHref({ category: categoryFilter === cat ? undefined : cat })}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    categoryFilter === cat
                      ? 'bg-navy-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </Link>
              ))}
            </div>

            <form
              method="get"
              action="/news"
              className="relative w-full lg:w-80"
            >
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                name="q"
                defaultValue={sp.q ?? ''}
                placeholder="Search news…"
                aria-label="Search news"
                className={`${inputClass} pl-10`}
              />
              {categoryFilter ? (
                <input type="hidden" name="category" value={categoryFilter} />
              ) : null}
            </form>
          </div>

          <div className="mt-14">
            {featured && (
              <Link
                href={`/news/${featured.slug}`}
                className="group grid overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl lg:grid-cols-2"
              >
                <CardImage
                  src={newsImage(featured.slug, featured.categoryName)}
                  alt={featured.title}
                  className="aspect-[16/10] lg:aspect-auto lg:h-full"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                >
                  {featured.isFeatured && (
                    <span className="absolute left-5 top-5 z-10 rounded-full bg-cyan-500 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
                      Featured
                    </span>
                  )}
                </CardImage>
                <div className="flex flex-col justify-center p-8 lg:p-12">
                  <div className="mb-5 flex items-center gap-3">
                    {categoryBadge(featured.categoryName)}
                    <time className="text-xs text-slate-400">
                      {formatDate(featured.publishedAt)}
                    </time>
                  </div>
                  <h2 className="text-2xl font-bold text-navy-900 transition-colors group-hover:text-cyan-600 lg:text-3xl">
                    {featured.title}
                  </h2>
                  {featured.subtitle ? (
                    <p className="mt-3 font-medium leading-relaxed text-slate-700">
                      {featured.subtitle}
                    </p>
                  ) : null}
                  <p className="mt-4 text-sm leading-relaxed text-slate-500">
                    {featured.excerpt}
                  </p>
                  <div className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-cyan-600">
                    Read Article
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            )}

            {pageArticles.length === 0 ? (
              <div className="mx-auto mt-8 max-w-lg rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <SearchX className="mx-auto h-10 w-10 text-slate-300" />
                <h3 className="mt-6 text-xl font-bold text-navy-900">
                  No articles found
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                  Try a different keyword or reset the category filter to see
                  our latest stories.
                </p>
                <Button href="/news" variant="outline" className="mt-8">
                  View All News
                </Button>
              </div>
            ) : (
              <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {rest.map((item, i) => (
                  <Reveal key={item.slug} delay={i * 0.08}>
                    <Link
                      href={`/news/${item.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                    >
                      <CardImage
                        src={newsImage(item.slug, item.categoryName)}
                        alt={item.title}
                        className="aspect-[16/9]"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="flex flex-1 flex-col p-7">
                        <div className="mb-4 flex items-center gap-3">
                          {categoryBadge(item.categoryName)}
                          <time className="text-xs text-slate-400">
                            {formatDate(item.publishedAt)}
                          </time>
                        </div>
                        <h3 className="text-lg font-bold text-navy-900 transition-colors group-hover:text-cyan-600">
                          {item.title}
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-slate-500">
                          {item.excerpt}
                        </p>
                        <div className="mt-auto pt-6">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-600">
                            Read More
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <nav
                aria-label="News pagination"
                className="mt-14 flex flex-wrap items-center justify-center gap-2"
              >
                {currentPage > 1 && (
                  <Link
                    href={buildHref({ page: String(currentPage - 1) })}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:border-cyan-500 hover:text-cyan-600"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Link>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Link
                      key={page}
                      href={page === 1 ? buildHref({ page: undefined }) : buildHref({ page: String(page) })}
                      aria-current={page === currentPage ? 'page' : undefined}
                      className={`h-10 w-10 rounded-lg text-sm font-semibold transition-colors ${
                        page === currentPage
                          ? 'bg-cyan-500 text-white'
                          : 'border border-slate-300 bg-white text-slate-600 hover:border-cyan-500 hover:text-cyan-600'
                      }`}
                    >
                      {page}
                    </Link>
                  )
                )}

                {currentPage < totalPages && (
                  <Link
                    href={buildHref({ page: String(currentPage + 1) })}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:border-cyan-500 hover:text-cyan-600"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                )}
              </nav>
            )}
          </div>
        </div>
      </section>
    </>
  )
}