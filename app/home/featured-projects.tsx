import Link from 'next/link'
import { MapPin, ArrowRight } from 'lucide-react'
import Reveal from '@/components/ui/reveal'
import CardImage from '@/components/ui/card-image'
import { prisma } from '@/lib/prisma'
import { projectImage } from '@/lib/images'

interface FeaturedProject {
  name: string
  slug: string
  status: string
  capacityMw: number | null
  location: string
  technology: string
}

const fallbackProjects: FeaturedProject[] = [
  {
    name: 'Meridian Reactor',
    slug: 'meridian-reactor',
    status: 'CONSTRUCTION',
    capacityMw: 1150,
    location: 'Southeast',
    technology: 'Gen III+ PWR',
  },
  {
    name: 'Pacific Fusion Plant',
    slug: 'pacific-fusion-plant',
    status: 'OPERATIONAL',
    capacityMw: 800,
    location: 'West Coast',
    technology: 'Advanced Modular',
  },
  {
    name: 'Northern Energy Hub',
    slug: 'northern-energy-hub',
    status: 'UNDER_DEVELOPMENT',
    capacityMw: 2200,
    location: 'Great Lakes',
    technology: 'Gen IV SMR',
  },
]

const statusColors: Record<string, string> = {
  OPERATIONAL: 'bg-emerald-100 text-emerald-700',
  CONSTRUCTION: 'bg-amber-100 text-amber-700',
  UNDER_DEVELOPMENT: 'bg-blue-100 text-blue-700',
  PLANNED: 'bg-slate-100 text-slate-700',
  COMPLETED: 'bg-cyan-100 text-cyan-700',
  DECOMMISSIONED: 'bg-red-100 text-red-700',
}

const statusLabels: Record<string, string> = {
  OPERATIONAL: 'Operational',
  CONSTRUCTION: 'Construction',
  UNDER_DEVELOPMENT: 'Under Development',
  PLANNED: 'Planned',
  COMPLETED: 'Completed',
  DECOMMISSIONED: 'Decommissioned',
}

export async function FeaturedProjects() {
  let projects = fallbackProjects

  try {
    const dbProjects = await prisma.project.findMany({
      where: { featured: true, published: true },
      take: 3,
      orderBy: { updatedAt: 'desc' },
    })

    if (dbProjects.length > 0) {
      projects = dbProjects.map((p) => ({
        name: p.name,
        slug: p.slug,
        status: p.status,
        capacityMw: p.capacityMw,
        location: p.location,
        technology: p.technology,
      }))
    }
  } catch {
    // Database not seeded yet — use fallback
  }

  return (
    <section className="section-padding bg-slate-50">
      <div className="container-narrow">
        <Reveal>
          <div className="mb-16 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-500">
                Our Portfolio
              </p>
              <h2 className="text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl">
                Global Energy Projects
              </h2>
            </div>
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-cyan-600 transition-colors hover:text-cyan-500"
            >
              View All Projects
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-3">
          {projects.map((project, i) => (
            <Reveal key={project.slug} delay={i * 0.15}>
<Link
                  href={`/projects/${project.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                >
                  <CardImage
                    src={projectImage(project.slug)}
                    alt={project.name}
                    className="aspect-[16/10]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="flex flex-1 flex-col p-8">
                    <span
                      className={`mb-4 inline-flex w-fit items-center rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider ${statusColors[project.status] ?? 'bg-slate-100 text-slate-700'}`}
                    >
                      {statusLabels[project.status] ?? project.status}
                    </span>
                    <h3 className="mb-3 text-xl font-bold text-navy-900 transition-colors group-hover:text-cyan-600">
                    {project.name}
                  </h3>
                  <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
                    <MapPin className="h-4 w-4" />
                    {project.location}
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    {project.capacityMw && (
                      <span className="font-semibold text-navy-900">
                        {project.capacityMw.toLocaleString()} MW
                      </span>
                    )}
                    <span className="text-slate-400">|</span>
                    <span className="text-slate-500">{project.technology}</span>
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
