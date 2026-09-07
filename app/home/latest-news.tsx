import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Reveal from '@/components/ui/reveal'
import CardImage from '@/components/ui/card-image'
import { prisma } from '@/lib/prisma'
import { newsImage } from '@/lib/images'

interface NewsItem {
  title: string
  slug: string
  excerpt: string
  category: string
  date: string
}

const fallbackNews: NewsItem[] = [
  {
    title: 'Advancing Next-Generation Reactor Technology',
    slug: 'advancing-next-gen-reactor-technology',
    excerpt:
      'Our latest breakthrough in small modular reactor design promises to revolutionise distributed clean energy generation.',
    category: 'Nuclear Innovation',
    date: '2025-11-15',
  },
  {
    title: 'Global Partnership for Clean Energy Expansion',
    slug: 'global-partnership-clean-energy',
    excerpt:
      'ENEC signs landmark agreement with international partners to develop new nuclear capacity across emerging markets.',
    category: 'Corporate',
    date: '2025-10-28',
  },
  {
    title: 'New Safety Standards Set Industry Benchmark',
    slug: 'new-safety-standards-benchmark',
    excerpt:
      'Our updated safety protocols exceed international regulatory requirements and establish a new gold standard for nuclear operations.',
    category: 'Safety',
    date: '2025-10-10',
  },
]

const categoryColors: Record<string, string> = {
  'Nuclear Innovation': 'bg-cyan-500/10 text-cyan-700',
  Corporate: 'bg-navy-500/10 text-navy-700',
  Safety: 'bg-emerald-500/10 text-emerald-700',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export async function LatestNews() {
  let news = fallbackNews

  try {
    const articles = await prisma.newsArticle.findMany({
      where: { status: 'PUBLISHED' },
      include: { category: true },
      orderBy: { publishedAt: 'desc' },
      take: 3,
    })

    if (articles.length > 0) {
      news = articles.map((a) => ({
        title: a.title,
        slug: a.slug,
        excerpt: a.excerpt,
        category: a.category.name,
        date: a.publishedAt?.toISOString() ?? a.createdAt.toISOString(),
      }))
    }
  } catch {
    // Database not seeded yet — use fallback
  }

  return (
    <section className="section-padding bg-white">
      <div className="container-narrow">
        <Reveal>
          <div className="mb-16 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-500">
                Insights
              </p>
              <h2 className="text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl">
                Latest News &amp; Insights
              </h2>
            </div>
            <Link
              href="/news"
              className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-cyan-600 transition-colors hover:text-cyan-500"
            >
              View All News
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-3">
          {news.map((item, i) => (
            <Reveal key={item.slug} delay={i * 0.15}>
              <Link
                href={`/news/${item.slug}`}
                className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
              >
                <CardImage
                  src={newsImage(item.slug, item.category)}
                  alt={item.title}
                  className="aspect-[16/9]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="p-8">
                  <div className="mb-4 flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${categoryColors[item.category] ?? 'bg-slate-100 text-slate-600'}`}
                    >
                      {item.category}
                    </span>
                    <time className="text-xs text-slate-400">
                      {formatDate(item.date)}
                    </time>
                  </div>
                  <h3 className="mb-3 text-lg font-bold text-navy-900 transition-colors group-hover:text-cyan-600">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-500">
                    {item.excerpt}
                  </p>
                  <div className="mt-6 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-cyan-600">
                    Read More
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
