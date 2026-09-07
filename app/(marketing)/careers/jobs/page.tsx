import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  Briefcase,
  MapPin,
  RotateCcw,
  Search,
  SearchX,
} from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import Button from '@/components/ui/button'
import PageHeader from '@/components/ui/page-header'
import Reveal from '@/components/ui/reveal'
import { images } from '@/lib/images'

export const metadata: Metadata = {
  title: 'Open Positions',
  description:
    'Browse current job openings at Emirates Nuclear Energy Corporation across engineering, nuclear science, operations, technology and corporate teams.',
}

type EmploymentType =
  | 'FULL_TIME'
  | 'PART_TIME'
  | 'CONTRACT'
  | 'INTERNSHIP'
  | 'GRADUATE'

interface JobCardData {
  title: string
  slug: string
  department: string
  location: string
  employmentType: EmploymentType
  summary: string
  publishedAt: string
}

const employmentTypeLabels: Record<EmploymentType, string> = {
  FULL_TIME: 'Full Time',
  PART_TIME: 'Part Time',
  CONTRACT: 'Contract',
  INTERNSHIP: 'Internship',
  GRADUATE: 'Graduate Program',
}

const employmentTypeColors: Record<EmploymentType, string> = {
  FULL_TIME: 'bg-emerald-500/10 text-emerald-700',
  PART_TIME: 'bg-blue-500/10 text-blue-700',
  CONTRACT: 'bg-amber-500/10 text-amber-700',
  INTERNSHIP: 'bg-cyan-500/10 text-cyan-700',
  GRADUATE: 'bg-purple-500/10 text-purple-700',
}

const fallbackJobs: JobCardData[] = [
  {
    title: 'Senior Nuclear Engineer',
    slug: 'senior-nuclear-engineer',
    department: 'Engineering',
    location: 'Atlanta, GA',
    employmentType: 'FULL_TIME',
    summary:
      'Lead reactor-system design reviews and safety assessments across our new-build and operating plant portfolio, working with multidisciplinary teams to deliver safe, reliable nuclear power.',
    publishedAt: '2025-12-01T09:00:00Z',
  },
  {
    title: 'Reactor Systems Analyst',
    slug: 'reactor-systems-analyst',
    department: 'Technology',
    location: 'Remote',
    employmentType: 'FULL_TIME',
    summary:
      'Develop and maintain plant performance models and digital twins, working at the intersection of nuclear engineering and advanced data science.',
    publishedAt: '2025-11-25T09:00:00Z',
  },
  {
    title: 'Safety Culture Specialist',
    slug: 'safety-culture-specialist',
    department: 'Safety',
    location: 'Chicago, IL',
    employmentType: 'FULL_TIME',
    summary:
      'Support fleet-wide safety culture programmes, leading psychological safety assessments and continuous improvement initiatives that embed best practice across the organisation.',
    publishedAt: '2025-11-20T09:00:00Z',
  },
  {
    title: 'Graduate Nuclear Science Program',
    slug: 'graduate-nuclear-science-program',
    department: 'Engineering',
    location: 'Multiple Locations',
    employmentType: 'GRADUATE',
    summary:
      'A structured two-year rotation through reactor physics, safety analysis and design engineering — with a senior mentor, real projects and clear progression to a permanent technical role.',
    publishedAt: '2025-11-10T09:00:00Z',
  },
  {
    title: 'Summer Engineering Internship',
    slug: 'summer-engineering-internship',
    department: 'Engineering',
    location: 'Various',
    employmentType: 'INTERNSHIP',
    summary:
      'Paid summer placement for undergraduates, pairing classroom learning with hands-on work at one of our operating stations or innovation labs.',
    publishedAt: '2025-10-15T09:00:00Z',
  },
]

async function fetchJobs(): Promise<JobCardData[]> {
  try {
    const rows = await prisma.job.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: 30,
    })

    if (rows.length > 0) {
      return rows.map((j) => ({
        title: j.title,
        slug: j.slug,
        department: j.department,
        location: j.location,
        employmentType: j.employmentType as EmploymentType,
        summary: j.summary,
        publishedAt: (j.publishedAt ?? j.createdAt).toISOString(),
      }))
    }
  } catch {
    // Database not available — use fallback
  }

  return fallbackJobs
}

interface JobSearchParams {
  q?: string
  department?: string
  location?: string
  employmentType?: string
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<JobSearchParams>
}) {
  const sp = await searchParams
  const q = typeof sp.q === 'string' ? sp.q.trim().toLowerCase() : undefined
  const deptFilter =
    typeof sp.department === 'string' ? sp.department : undefined
  const locFilter =
    typeof sp.location === 'string' ? sp.location : undefined
  const typeFilter =
    typeof sp.employmentType === 'string' ? sp.employmentType : undefined

  const jobs = await fetchJobs()

  const departments = Array.from(new Set(jobs.map((j) => j.department))).sort()
  const locations = Array.from(new Set(jobs.map((j) => j.location))).sort()
  const types = Array.from(
    new Set(jobs.map((j) => j.employmentType))
  ) as EmploymentType[]

  let filtered = jobs

  if (q) {
    filtered = filtered.filter((j) =>
      `${j.title} ${j.department} ${j.location} ${j.summary}`
        .toLowerCase()
        .includes(q)
    )
  }
  if (deptFilter) {
    filtered = filtered.filter((j) => j.department === deptFilter)
  }
  if (locFilter) {
    filtered = filtered.filter((j) => j.location === locFilter)
  }
  if (typeFilter) {
    filtered = filtered.filter((j) => j.employmentType === typeFilter)
  }

  const hasFilters = Boolean(q || deptFilter || locFilter || typeFilter)

  return (
    <>
      <PageHeader
        eyebrow="Careers"
        title="Open Positions"
        description={
          <>
            Find your place in a team delivering the world&apos;s most
            important work — reliable, clean nuclear energy for future
            generations.
          </>
        }
        image={images.engineers}
      />

      <section className="section-padding bg-slate-50">
        <div className="container-narrow">
          <Reveal>
            <form
              method="get"
              action="/careers/jobs"
              className="grid grid-cols-1 gap-4 rounded-2xl bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-5"
            >
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                name="q"
                defaultValue={sp.q ?? ''}
                placeholder="Search positions…"
                aria-label="Search positions"
                className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
              />
            </div>

            <select
              name="department"
              defaultValue={deptFilter ?? ''}
              aria-label="Filter by department"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <select
              name="location"
              defaultValue={locFilter ?? ''}
              aria-label="Filter by location"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
            >
              <option value="">All Locations</option>
              {locations.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>

            <select
              name="employmentType"
              defaultValue={typeFilter ?? ''}
              aria-label="Filter by employment type"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
            >
              <option value="">All Types</option>
              {types.map((t) => (
                <option key={t} value={t}>
                  {employmentTypeLabels[t]}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-3 lg:col-span-5">
              <Button type="submit" size="md" className="flex-1 sm:flex-none">
                Search
                <Search className="h-4 w-4" />
              </Button>
              {hasFilters ? (
                <Link
                  href="/careers/jobs"
                  aria-label="Clear filters"
                  className="inline-flex items-center gap-1.5 rounded-lg p-2 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Link>
              ) : null}
            </div>
          </form>
          </Reveal>

          <Reveal>
            <div className="mt-10 flex items-center gap-2 text-sm text-slate-500">
              <Briefcase className="h-4 w-4" />
              <span>
                <strong className="text-navy-900">{filtered.length}</strong>{' '}
                {filtered.length === 1 ? 'position' : 'positions'} found
              </span>
            </div>
          </Reveal>

          <div className="mt-8">
            {filtered.length === 0 ? (
              <Reveal>
                <div className="mx-auto max-w-lg rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                  <SearchX className="mx-auto h-10 w-10 text-slate-300" />
                  <h3 className="mt-6 text-xl font-bold text-navy-900">
                    No positions match your search
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-500">
                    Try broadening your search terms or removing filters.
                  </p>
                  <Button href="/careers/jobs" variant="outline" className="mt-8">
                    View All Positions
                  </Button>
                </div>
              </Reveal>
            ) : (
              <div className="space-y-4">
                {filtered.map((job, i) => (
                  <Reveal key={job.slug} delay={i * 0.08}>
                    <Link
                      href={`/careers/jobs/${job.slug}`}
                      className="group flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-7 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-500/50 hover:shadow-lg sm:flex-row sm:items-center"
                    >
                    <div className="max-w-xl">
                      <h3 className="text-lg font-bold text-navy-900 transition-colors group-hover:text-cyan-600">
                        {job.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
                        {job.summary}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs sm:flex-col sm:items-end sm:gap-2">
                      <span className="flex items-center gap-1.5 font-medium text-slate-600">
                        <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                        {job.department}
                      </span>
                      <span className="flex items-center gap-1.5 font-medium text-slate-600">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        {job.location}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${employmentTypeColors[job.employmentType]}`}
                      >
                        {employmentTypeLabels[job.employmentType]}
                      </span>
                      <time className="mt-1 text-xs text-slate-400">
                        Posted {formatDate(job.publishedAt)}
                      </time>
                      <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-cyan-600">
                        View Details
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                    </Link>
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