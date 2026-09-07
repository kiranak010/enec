import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  FileText,
  Newspaper,
  Briefcase,
  Factory,
  Search as SearchIcon,
  SearchX,
} from 'lucide-react'
import { prisma } from '@/lib/prisma'
import Button from '@/components/ui/button'
import PageHeader from '@/components/ui/page-header'
import Reveal from '@/components/ui/reveal'
import { images } from '@/lib/images'

export const metadata: Metadata = {
  title: 'Search',
  description:
    'Search across Emirates Nuclear Energy Corporation — news, projects, careers, documents and more.',
}

interface SearchResult {
  title: string
  url: string
  excerpt: string
  meta?: string
}

const fallbackNews: SearchResult[] = [
  { title: 'Advancing Next-Generation Reactor Technology', url: '/news/advancing-next-generation-reactor-technology', excerpt: 'Advanced reactor designs are reshaping the economics and geography of clean baseload power.', meta: 'Nuclear Innovation · Nov 15, 2025' },
  { title: 'Global Partnership for Clean Energy Expansion', url: '/news/global-partnership-for-clean-energy-expansion', excerpt: 'A landmark framework agreement will develop new nuclear capacity across emerging markets.', meta: 'Corporate · Oct 28, 2025' },
  { title: 'New Safety Standards Set Industry Benchmark', url: '/news/new-safety-standards-set-industry-benchmark', excerpt: 'Updated safety protocols establish a new gold standard for nuclear operations worldwide.', meta: 'Safety · Oct 10, 2025' },
  { title: 'Investing in Tomorrow\u2019s Energy Workforce', url: '/news/investing-in-tomorrows-energy-workforce', excerpt: 'Graduate programmes, apprenticeships and university partnerships build the workforce of the future.', meta: 'Careers · Sep 22, 2025' },
  { title: 'Pioneering AI-Driven Predictive Maintenance', url: '/news/pioneering-ai-driven-predictive-maintenance', excerpt: 'Machine learning reduces downtime and strengthens safety across our stations.', meta: 'Innovation · Aug 18, 2025' },
]

const fallbackProjects: SearchResult[] = [
  { title: 'Meridian Reactor', url: '/projects/meridian-reactor', excerpt: 'An advanced 1,150 MWe pressurized water reactor under construction in the Southeast United States.' },
  { title: 'Pacific Clean Energy Plant', url: '/projects/pacific-clean-energy-plant', excerpt: 'An operational 800 MWe pressurized water reactor providing clean power along the West Coast.' },
  { title: 'Northern Energy Hub', url: '/projects/northern-energy-hub', excerpt: 'A next-generation 2,200 MWe advanced small modular reactor energy hub for the Great Lakes.' },
  { title: 'Eastern Seaboard Station', url: '/projects/eastern-seaboard-station', excerpt: 'A completed 1,400 MWe plant strengthening grid resilience across the East Coast.' },
  { title: 'Central Plains Reactor', url: '/projects/central-plains-reactor', excerpt: 'A planned 950 MWe Gen III+ pressurized water reactor for the Midwest.' },
]

const fallbackJobs: SearchResult[] = [
  { title: 'Senior Nuclear Engineer', url: '/careers/jobs/senior-nuclear-engineer', excerpt: 'Lead reactor-system design reviews and safety assessments across our plant portfolio.' },
  { title: 'Reactor Systems Analyst', url: '/careers/jobs/reactor-systems-analyst', excerpt: 'Develop plant performance models and digital twins at the intersection of engineering and data science.' },
  { title: 'Safety Culture Specialist', url: '/careers/jobs/safety-culture-specialist', excerpt: 'Support fleet-wide safety culture programmes and continuous improvement initiatives.' },
  { title: 'Graduate Nuclear Science Program', url: '/careers/jobs/graduate-nuclear-science-program', excerpt: 'A structured two-year rotation through reactor physics, safety analysis and design engineering.' },
  { title: 'Summer Engineering Internship', url: '/careers/jobs/summer-engineering-internship', excerpt: 'A paid summer placement pairing classroom learning with hands-on work at our stations.' },
]

const fallbackDocuments: SearchResult[] = [
  { title: '2025 Annual Report', url: '/documents', excerpt: 'PDF document available for download.' },
  { title: '2025 Sustainability Report', url: '/documents', excerpt: 'PDF document available for download.' },
  { title: 'Fleet Performance Review 2025', url: '/documents', excerpt: 'PDF document available for download.' },
  { title: 'Supply Chain Code of Conduct', url: '/documents', excerpt: 'PDF document available for download.' },
  { title: 'Gen IV Technology Readiness Assessment', url: '/documents', excerpt: 'PDF document available for download.' },
]

const categoryConfig = [
  { key: 'news', label: 'News & Insights', icon: Newspaper, accent: 'text-cyan-600 bg-cyan-500/10' },
  { key: 'projects', label: 'Projects', icon: Factory, accent: 'text-navy-700 bg-navy-500/10' },
  { key: 'jobs', label: 'Careers', icon: Briefcase, accent: 'text-emerald-600 bg-emerald-500/10' },
  { key: 'documents', label: 'Documents', icon: FileText, accent: 'text-amber-600 bg-amber-500/10' },
] as const

async function queryNews(q: string): Promise<SearchResult[]> {
  try {
    const rows = await prisma.newsArticle.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { title: { contains: q } },
          { subtitle: { contains: q } },
          { excerpt: { contains: q } },
          { content: { contains: q } },
          { category: { is: { name: { contains: q } } } },
        ],
      },
      include: { category: true },
      take: 10,
      orderBy: { publishedAt: 'desc' },
    })

    if (rows.length > 0) {
      return rows.map((r) => ({
        title: r.title,
        url: `/news/${r.slug}`,
        excerpt: r.excerpt,
        meta: `${r.category.name} · ${(r.publishedAt ?? r.createdAt)
          .toISOString()
          .slice(0, 10)}`,
      }))
    }
  } catch {
    // Database not available — use fallback
  }

  const needle = q.toLowerCase()
  return fallbackNews.filter((n) =>
    `${n.title} ${n.excerpt} ${n.meta}`
      .toLowerCase()
      .includes(needle)
  )
}

async function queryProjects(q: string): Promise<SearchResult[]> {
  try {
    const rows = await prisma.project.findMany({
      where: {
        published: true,
        OR: [
          { name: { contains: q } },
          { summary: { contains: q } },
          { description: { contains: q } },
          { location: { contains: q } },
          { technology: { contains: q } },
        ],
      },
      take: 10,
    })

    if (rows.length > 0) {
      return rows.map((r) => ({
        title: r.name,
        url: `/projects/${r.slug}`,
        excerpt: r.summary,
      }))
    }
  } catch {
    // Database not available — use fallback
  }

  const needle = q.toLowerCase()
  return fallbackProjects.filter((p) =>
    `${p.title} ${p.excerpt}`.toLowerCase().includes(needle)
  )
}

async function queryJobs(q: string): Promise<SearchResult[]> {
  try {
    const rows = await prisma.job.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { title: { contains: q } },
          { summary: { contains: q } },
          { description: { contains: q } },
          { department: { contains: q } },
          { location: { contains: q } },
        ],
      },
      take: 10,
    })

    if (rows.length > 0) {
      return rows.map((r) => ({
        title: r.title,
        url: `/careers/jobs/${r.slug}`,
        excerpt: r.summary,
      }))
    }
  } catch {
    // Database not available — use fallback
  }

  const needle = q.toLowerCase()
  return fallbackJobs.filter((j) =>
    `${j.title} ${j.excerpt}`.toLowerCase().includes(needle)
  )
}

async function queryDocuments(q: string): Promise<SearchResult[]> {
  try {
    const rows = await prisma.document.findMany({
      where: {
        published: true,
        OR: [{ title: { contains: q } }, { description: { contains: q } }],
      },
      take: 10,
    })

    if (rows.length > 0) {
      return rows.map((r) => ({
        title: r.title,
        url: r.fileUrl || '/documents',
        excerpt: `${r.fileType ?? 'Document'} available for download.`,
      }))
    }
  } catch {
    // Database not available — use fallback
  }

  const needle = q.toLowerCase()
  return fallbackDocuments.filter((d) =>
    `${d.title} ${d.excerpt}`.toLowerCase().includes(needle)
  )
}

interface SearchResultsProps {
  q: string
}

async function SearchResults({ q }: SearchResultsProps) {
  const [news, projects, jobs, documents] = await Promise.all([
    queryNews(q),
    queryProjects(q),
    queryJobs(q),
    queryDocuments(q),
  ])

  const groups = [
    { ...categoryConfig[0], results: news },
    { ...categoryConfig[1], results: projects },
    { ...categoryConfig[2], results: jobs },
    { ...categoryConfig[3], results: documents },
  ]

  const total = news.length + projects.length + jobs.length + documents.length

  if (total === 0) {
    return (
      <div className="mx-auto mt-10 max-w-lg rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
        <SearchX className="mx-auto h-10 w-10 text-slate-300" />
        <h2 className="mt-6 text-xl font-bold text-navy-900">
          No results found
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          We could not find anything matching “{q}”. Try a different keyword,
          or browse our most popular content instead.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/projects" variant="outline" size="sm">
            Projects
          </Button>
          <Button href="/news" variant="outline" size="sm">
            News
          </Button>
          <Button href="/careers/jobs" variant="outline" size="sm">
            Careers
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <p className="text-sm text-slate-500">
        <strong className="text-navy-900">{total}</strong>
        {total === 1 ? ' result' : ' results'} for “{q}”
      </p>

      <div className="mt-8 space-y-12">
        {groups.map(
          (group) =>
            group.results.length > 0 && (
              <section key={group.key}>
                <h2 className="flex items-center gap-3 text-2xl font-bold text-navy-900">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${group.accent}`}
                  >
                    <group.icon className="h-5 w-5" />
                  </span>
                  {group.label}
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                    {group.results.length}
                  </span>
                </h2>

                <div className="mt-6 space-y-4">
                  {group.results.map((result) => (
                    <Link
                      key={result.title}
                      href={result.url}
                      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-500/50 hover:shadow-lg"
                    >
                      {result.meta ? (
                        <span className="mb-2 w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                          {result.meta}
                        </span>
                      ) : null}
                      <h3 className="text-lg font-bold text-navy-900 transition-colors group-hover:text-cyan-600">
                        {result.title}
                      </h3>
                      {result.excerpt ? (
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
                          {result.excerpt}
                        </p>
                      ) : null}
                      <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-600">
                        Open
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )
        )}
      </div>
    </div>
  )
}

function ResultsSkeleton() {
  return (
    <div className="space-y-8" aria-hidden="true">
      {[0, 1, 2].map((block) => (
        <div key={block}>
          <div className="h-8 w-56 animate-pulse rounded-lg bg-slate-200" />
          <div className="mt-5 space-y-4">
            {[0, 1, 2].map((card) => (
              <div
                key={card}
                className="rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                <div className="mt-3 h-5 w-3/4 animate-pulse rounded bg-slate-200" />
                <div className="mt-3 h-4 w-full animate-pulse rounded bg-slate-100" />
                <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

interface SearchPageParams {
  q?: string | string[]
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchPageParams>
}) {
  const sp = await searchParams
  const q =
    typeof sp.q === 'string'
      ? sp.q.trim()
      : Array.isArray(sp.q)
        ? sp.q[0]?.trim() ?? ''
        : ''

  return (
    <>
      <PageHeader
        eyebrow="Find Anything"
        title="Search"
        description={
          <>
            Search across our projects, news, careers and document library.
          </>
        }
        image={images.controlRoom}
      >
        <form
          method="get"
          action="/search"
          className="relative mt-10 max-w-2xl"
        >
          <SearchIcon className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search projects, news, jobs, documents…"
            aria-label="Search the site"
            className="w-full rounded-2xl border border-white/15 bg-white/10 py-5 pl-14 pr-32 text-base text-white placeholder:text-navy-200/70 backdrop-blur-sm transition-colors focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-cyan-500/25 transition-colors hover:bg-cyan-600"
          >
            Search
          </button>
        </form>
      </PageHeader>

      <section className="section-padding bg-slate-50">
        <div className="container-narrow">
          <Reveal>
            {q ? (
              <Suspense fallback={<ResultsSkeleton />}>
                <SearchResults key={q} q={q} />
              </Suspense>
            ) : (
              <div className="mx-auto max-w-lg rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <SearchIcon className="mx-auto h-10 w-10 text-slate-300" />
                <h2 className="mt-6 text-xl font-bold text-navy-900">
                  What are you looking for?
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                  Start typing a keyword above to search across our projects,
                  news archive, open positions and document library.
                </p>
              </div>
            )}
          </Reveal>
        </div>
      </section>
    </>
  )
}