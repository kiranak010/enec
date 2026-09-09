import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, MapPin, RotateCcw, Search, SearchX } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import Button from '@/components/ui/button'
import PageHeader from '@/components/ui/page-header'
import CardImage from '@/components/ui/card-image'
import Reveal from '@/components/ui/reveal'
import { projectImage, images } from '@/lib/images'

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Explore Emirates Nuclear Energy Corporation’s global portfolio of advanced nuclear energy projects — from planned reactors to operational plants.',
}

type ProjectStatus =
  | 'PLANNED'
  | 'UNDER_DEVELOPMENT'
  | 'CONSTRUCTION'
  | 'OPERATIONAL'
  | 'COMPLETED'
  | 'DECOMMISSIONED'

interface ProjectCardData {
  name: string
  slug: string
  location: string
  country: string
  capacityMw: number | null
  technology: string
  status: ProjectStatus
  summary: string
}

const statusLabels: Record<ProjectStatus, string> = {
  PLANNED: 'Planned',
  UNDER_DEVELOPMENT: 'Under Development',
  CONSTRUCTION: 'Construction',
  OPERATIONAL: 'Operational',
  COMPLETED: 'Completed',
  DECOMMISSIONED: 'Decommissioned',
}

const statusBadgeClasses: Record<ProjectStatus, string> = {
  PLANNED: 'bg-slate-100 text-slate-700',
  UNDER_DEVELOPMENT: 'bg-blue-100 text-blue-700',
  CONSTRUCTION: 'bg-amber-100 text-amber-700',
  OPERATIONAL: 'bg-emerald-100 text-emerald-700',
  COMPLETED: 'bg-cyan-100 text-cyan-700',
  DECOMMISSIONED: 'bg-red-100 text-red-700',
}

const fallbackProjects: ProjectCardData[] = [
  {
    name: 'Meridian Reactor',
    slug: 'meridian-reactor',
    location: 'Southeast US',
    country: 'United States',
    capacityMw: 1150,
    technology: 'PWR',
    status: 'CONSTRUCTION',
    summary:
      'An advanced 1,150 MWe pressurized water reactor under construction to deliver clean baseline electricity to the Southeastern United States.',
  },
  {
    name: 'Pacific Clean Energy Plant',
    slug: 'pacific-clean-energy-plant',
    location: 'West Coast',
    country: 'United States',
    capacityMw: 800,
    technology: 'PWR',
    status: 'OPERATIONAL',
    summary:
      'An operational 800 MWe pressurized water reactor providing reliable, carbon-free power along the West Coast.',
  },
  {
    name: 'Northern Energy Hub',
    slug: 'northern-energy-hub',
    location: 'Great Lakes',
    country: 'United States',
    capacityMw: 2200,
    technology: 'Advanced SMR',
    status: 'UNDER_DEVELOPMENT',
    summary:
      'A next-generation 2,200 MWe energy hub pairing advanced small modular reactors with district heating for the Great Lakes region.',
  },
  {
    name: 'Eastern Seaboard Station',
    slug: 'eastern-seaboard-station',
    location: 'East Coast',
    country: 'United States',
    capacityMw: 1400,
    technology: 'PWR',
    status: 'COMPLETED',
    summary:
      'A completed 1,400 MWe plant strengthening grid resilience across the densely populated Eastern Seaboard.',
  },
  {
    name: 'Central Plains Reactor',
    slug: 'central-plains-reactor',
    location: 'Midwest',
    country: 'United States',
    capacityMw: 950,
    technology: 'Gen III+ PWR',
    status: 'PLANNED',
    summary:
      'A planned 950 MWe Gen III+ pressurized water reactor bringing affordable clean electricity and high-skill jobs to the Midwest.',
  },
  {
    name: 'Southern Coastal Project',
    slug: 'southern-coastal-project',
    location: 'Gulf Coast',
    country: 'United States',
    capacityMw: 1800,
    technology: 'Gen III+ PWR',
    status: 'CONSTRUCTION',
    summary:
      'A 1,800 MWe Gen III+ plant under construction on the Gulf Coast, engineered for hurricane resilience and industrial decarbonisation.',
  },
]

async function fetchProjects(): Promise<ProjectCardData[]> {
  try {
    const rows = await prisma.project.findMany({
      where: { published: true },
      orderBy: { updatedAt: 'desc' },
      take: 24,
    })

    if (rows.length > 0) {
      return rows.map((r) => ({
        name: r.name,
        slug: r.slug,
        location: r.location,
        country: r.country,
        capacityMw: r.capacityMw,
        technology: r.technology,
        status: r.status as ProjectStatus,
        summary: r.summary,
      }))
    }
  } catch {
    // Database not available — use fallback
  }

  return fallbackProjects
}

interface ProjectsSearchParams {
  status?: string
  technology?: string
  q?: string
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<ProjectsSearchParams>
}) {
  const sp = await searchParams

  const statusFilter = typeof sp.status === 'string' ? sp.status : undefined
  const technologyFilter =
    typeof sp.technology === 'string' ? sp.technology : undefined
  const q = typeof sp.q === 'string' ? sp.q.trim().toLowerCase() : undefined

  const projects = await fetchProjects()

  const technologies = Array.from(
    new Set(projects.map((p) => p.technology))
  ).sort()

  const statuses = Object.keys(statusLabels) as ProjectStatus[]

  let filtered = projects

  if (statusFilter) {
    filtered = filtered.filter((p) => p.status === statusFilter)
  }
  if (technologyFilter) {
    filtered = filtered.filter((p) => p.technology === technologyFilter)
  }
  if (q) {
    const haystack = (p: ProjectCardData) =>
      `${p.name} ${p.location} ${p.country} ${p.technology} ${p.summary}`.toLowerCase()
    filtered = filtered.filter((p) => haystack(p).includes(q))
  }

  const hasFilters = Boolean(statusFilter || technologyFilter || q)

  return (
    <>
      <PageHeader
        eyebrow="Projects Platform"
        title="Our Global Energy Projects"
        description={
          <>
            From advanced pressurized water reactors to next-generation small
            modular reactors, discover how our portfolio is delivering clean,
            reliable and affordable power across the world.
          </>
        }
        image={images.grid}
      />

      <section className="section-padding bg-slate-50">
        <div className="container-narrow">
          <form
            method="get"
            action="/projects"
            className="grid grid-cols-1 gap-4 rounded-2xl bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-4"
          >
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                name="q"
                defaultValue={sp.q ?? ''}
                placeholder="Search projects…"
                aria-label="Search projects"
                className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
              />
            </div>

            <select
              name="status"
              defaultValue={statusFilter ?? ''}
              aria-label="Filter by status"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
            >
              <option value="">All Statuses</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {statusLabels[s]}
                </option>
              ))}
            </select>

            <select
              name="technology"
              defaultValue={technologyFilter ?? ''}
              aria-label="Filter by technology"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
            >
              <option value="">All Technologies</option>
              {technologies.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-3">
              <Button type="submit" size="md" className="flex-1">
                Apply Filters
              </Button>
              {hasFilters ? (
                <Link
                  href="/projects"
                  aria-label="Clear filters"
                  className="inline-flex items-center gap-1.5 rounded-lg p-2 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Link>
              ) : null}
            </div>
          </form>

          <div className="mt-14">
            {filtered.length === 0 ? (
              <div className="mx-auto max-w-lg rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <SearchX className="mx-auto h-10 w-10 text-slate-300" />
                <h3 className="mt-6 text-xl font-bold text-navy-900">
                  No projects match your filters
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                  Try adjusting your search terms or removing filters to see
                  the full project portfolio.
                </p>
                <Button href="/projects" variant="outline" className="mt-8">
                  View All Projects
                </Button>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filtered.map((project, i) => (
                  <Reveal key={project.slug} delay={i * 0.08}>
                    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                      <div className="relative">
                        <CardImage
                          src={projectImage(project.slug)}
                          alt={project.name}
                          className="aspect-[16/10]"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>

                      <div className="flex flex-1 flex-col p-8">
                        <span
                          className={`mb-4 inline-flex w-fit items-center rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider ${statusBadgeClasses[project.status]}`}
                        >
                          {statusLabels[project.status]}
                        </span>
                        <h3 className="text-xl font-bold text-navy-900 transition-colors group-hover:text-cyan-600">
                          {project.name}
                        </h3>
                        <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                          <MapPin className="h-4 w-4 shrink-0" />
                          {project.location}
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                          {project.capacityMw != null && (
                            <span className="font-semibold text-navy-900">
                              {project.capacityMw.toLocaleString()} MW
                            </span>
                          )}
                          <span className="text-slate-400">|</span>
                          <span className="text-slate-500">
                            {project.technology}
                          </span>
                        </div>
                        <p className="mt-4 text-sm leading-relaxed text-slate-500">
                          {project.summary}
                        </p>
                        <div className="mt-auto pt-6">
                          <Button
                            href={`/projects/${project.slug}`}
                            variant="outline"
                            size="sm"
                          >
                            View Project
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}