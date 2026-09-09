import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Factory,
  Landmark,
  Leaf,
  MapPin,
  TrendingUp,
} from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import SectionHeading from '@/components/ui/section-heading'
import Button from '@/components/ui/button'
import CardImage from '@/components/ui/card-image'
import Reveal from '@/components/ui/reveal'
import { projectImage } from '@/lib/images'

interface ProjectMilestone {
  date: string
  title: string
  description: string
}

type ProjectStatus =
  | 'PLANNED'
  | 'UNDER_DEVELOPMENT'
  | 'CONSTRUCTION'
  | 'OPERATIONAL'
  | 'COMPLETED'
  | 'DECOMMISSIONED'

interface ProjectDetail {
  name: string
  slug: string
  location: string
  country: string
  latitude: number | null
  longitude: number | null
  capacityMw: number | null
  technology: string
  status: ProjectStatus
  summary: string
  description: string
  heroImage?: string | null
  startDate?: string | null
  completionDate?: string | null
  envImpact: string
  economicImpact: string
  milestones: ProjectMilestone[]
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

const fallbackProjects: ProjectDetail[] = [
  {
    name: 'Meridian Reactor',
    slug: 'meridian-reactor',
    location: 'Southeast US',
    country: 'United States',
    latitude: 33.749,
    longitude: -84.388,
    capacityMw: 1150,
    technology: 'PWR',
    status: 'CONSTRUCTION',
    summary:
      'An advanced 1,150 MWe pressurized water reactor under construction to deliver clean baseline electricity to the Southeastern United States.',
    description:
      'The Meridian Reactor is a modern advanced pressurized water reactor rated at 1,150 megawatts electric (MWe). The project pairs a proven Generation III+ design with digital instrumentation and control systems, enabling highly reliable baseload operation with a design life of more than 60 years.\n\nConstruction is proceeding in close partnership with regional transmission authorities to bring low-carbon, dispatchable power to a region experiencing rapid load growth from data centres, manufacturing and electrified transport.\n\nThe plant is engineered with defence-in-depth safety systems, including passive cooling features, extensive seismic design margins and a fully automated emergency response capability, reflecting our commitment to safety as the foundation of every project.',
    startDate: '2022-04-01',
    completionDate: '2029-06-30',
    envImpact:
      'Once operational, Meridian Reactor is projected to avoid approximately 6.5 million tonnes of CO₂ equivalent each year compared with an equivalent fossil-fuel capacity. The closed-loop cooling design minimises water withdrawal, while a 40-acre onsite habitat restoration programme offsets local land-use impacts. Annual environmental performance data is published in our sustainability report.',
    economicImpact:
      'At peak construction, the project employs more than 3,200 workers, with over 250 long-term operations roles on completion. Cumulative regional investment is estimated at $9 billion, including local supply chain contracts, workforce training programmes and improvements to regional grid infrastructure.',
    milestones: [
      {
        date: '2022-04-01',
        title: 'Limited work authorisation',
        description:
          'Site preparation and enabling works commenced following NRC limited work authorisation.',
      },
      {
        date: '2024-05-14',
        title: 'First nuclear concrete',
        description:
          'First nuclear safety-related concrete pour completed, marking the formal construction start of the reactor foundation.',
      },
      {
        date: '2026-02-20',
        title: 'Reactor pressure vessel installed',
        description:
          'The 500-tonne reactor pressure vessel was lifted into place, a major milestone in the construction schedule.',
      },
      {
        date: '2029-06-30',
        title: 'Commercial operation',
        description:
          'Scheduled commercial operation, adding 1,150 MWe of clean baseload capacity to the Southeast.',
      },
    ],
  },
  {
    name: 'Pacific Clean Energy Plant',
    slug: 'pacific-clean-energy-plant',
    location: 'West Coast',
    country: 'United States',
    latitude: 38.5497,
    longitude: -121.5568,
    capacityMw: 800,
    technology: 'PWR',
    status: 'OPERATIONAL',
    summary:
      'An operational 800 MWe pressurized water reactor providing reliable, carbon-free power along the West Coast.',
    description:
      'The Pacific Clean Energy Plant is an 800 MWe pressurized water reactor that has operated reliably for over a decade, delivering firm, carbon-free electricity to one of the most energy-intensive regions in the nation.\n\nOperating continuously through grid peaks and clean-energy supply shortfalls, the plant has maintained a capacity factor above 92% in recent years. Its dispatchable, always-available output complements intermittent wind and solar generation and provides critical voltage support to the regional grid.\n\nThe station runs one of the most advanced predictive-maintenance programmes in the industry, using sensor data and machine learning models to detect component wear long before failure, maximising safety and availability.',
    startDate: '2009-11-01',
    completionDate: '2014-08-15',
    envImpact:
      'The plant avoids roughly 4.1 million tonnes of CO₂ equivalent annually and operates a comprehensive marine monitoring programme to protect coastal ecosystems. Onsite verified data is reported through our annual sustainability disclosures, and the station meets the region’s strictest cooling-tower water discharge standards.',
    economicImpact:
      'Pacific Clean Energy Plant sustains 480 high-skill local jobs with an average compensation well above the regional median. Annual economic activity attributable to the station is approximately $1.2 billion, anchored by operations payroll, local supply contracts and tax contributions to the surrounding county.',
    milestones: [
      {
        date: '2009-11-01',
        title: 'Construction commencement',
        description:
          'Groundbreaking on the Pacific Clean Energy Plant with an aggressive, high-quality construction programme.',
      },
      {
        date: '2013-10-20',
        title: 'Fuel load',
        description:
          'Initial fuel load completed following a rigorous pre-operational testing campaign.',
      },
      {
        date: '2014-08-15',
        title: 'Commercial operation',
        description:
          'Entered commercial operation, delivering 800 MWe of clean baseload power.',
      },
    ],
  },
  {
    name: 'Northern Energy Hub',
    slug: 'northern-energy-hub',
    location: 'Great Lakes',
    country: 'United States',
    latitude: 41.8781,
    longitude: -87.6298,
    capacityMw: 2200,
    technology: 'Advanced SMR',
    status: 'UNDER_DEVELOPMENT',
    summary:
      'A next-generation 2,200 MWe energy hub pairing advanced small modular reactors with district heating for the Great Lakes region.',
    description:
      'The Northern Energy Hub is an innovative multi-unit development that integrates a fleet of advanced small modular reactors (SMRs) to deliver 2,200 MWe of clean electricity alongside low-grade thermal energy for district heating and industrial processes.\n\nRather than a single monolithic unit, the hub scales incrementally — each modular unit is factory-fabricated and installed to a common turbine island, shortening construction schedules and allowing capacity to come online incrementally as demand grows.\n\nIn addition to electricity, the hub captures waste heat for a regional district-heating network, displacing natural gas for heating across a metropolitan service area and demonstrating how advanced nuclear can decarbonise more than just the electric grid.',
    startDate: '2025-09-01',
    completionDate: null,
    envImpact:
      'At full build-out, the hub is expected to avoid up to 12 million tonnes of CO₂ equivalent annually — equivalent to taking 2.6 million cars off the road. The combined heat-and-power design reduces net energy losses, and the compact, modular footprint preserves more than 70% of the site&apos;s original greenfield land as protected habitat.',
    economicImpact:
      'Using a factory-fabrication model, the hub is projected to create over 4,500 assembly and site jobs and approximately 1,100 permanent operations positions. The project is expected to contribute more than $15 billion in regional economic output over its first decade of operation.',
    milestones: [
      {
        date: '2025-09-01',
        title: 'Development phase launch',
        description:
          'Kick-off of detailed design, permitting and community consenting for the multi-unit hub.',
      },
      {
        date: '2026-04-15',
        title: 'Site characterisation complete',
        description:
          'Geotechnical, hydrological and environmental baseline studies completed ahead of construction planning.',
      },
      {
        date: '2027-03-01',
        title: 'First unit order',
        description:
          'Placement of the first factory-fabricated reactor unit order with our manufacturing supply chain.',
      },
    ],
  },
  {
    name: 'Eastern Seaboard Station',
    slug: 'eastern-seaboard-station',
    location: 'East Coast',
    country: 'United States',
    latitude: 39.2904,
    longitude: -76.6122,
    capacityMw: 1400,
    technology: 'PWR',
    status: 'COMPLETED',
    summary:
      'A completed 1,400 MWe plant strengthening grid resilience across the densely populated Eastern Seaboard.',
    description:
      'The Eastern Seaboard Station is a 1,400 MWe two-unit pressurized water reactor plant that completed its full lifecycle of construction, commissioning and commercial delivery, reinforcing grid reliability across one of the most densely populated corridors in the United States.\n\nCompleted ahead of schedule, the station is a flagship example of disciplined project delivery — applying serial-construction lessons across its two units to drive schedule and cost efficiency without compromising safety or quality.\n\nThe plant’s high-availability design and robust transmission interconnections make it a cornerstone of regional energy security, providing essential voltage support and black-start capability to the wider grid.',
    startDate: '2011-02-01',
    completionDate: '2019-10-30',
    envImpact:
      'The station offsets approximately 7.2 million tonnes of CO₂ equivalent annually. Its cooling system uses a recycled-water supply that eliminates dependence on potable water sources, and ongoing environmental stewardship programmes support wetland restoration and bird-flight-corridor studies across the surrounding region.',
    economicImpact:
      'Over its construction lifecycle the project supported an average of 3,800 jobs and generated $7.5 billion in regional economic output. Today the station anchors long-term careers for more than 600 permanent staff and contributes a stable stream of tax revenue to local schools and public services.',
    milestones: [
      {
        date: '2011-02-01',
        title: 'Construction start',
        description:
          'Excavation and structural concrete commenced across both reactor units.',
      },
      {
        date: '2016-06-12',
        title: 'Unit 1 fuel load',
        description:
          'Unit 1 commenced commercial operation following successful fuel load and power ascension.',
      },
      {
        date: '2019-10-30',
        title: 'Unit 2 commercial operation',
        description:
          'Unit 2 entered service, completing the two-unit station ahead of schedule.',
      },
    ],
  },
  {
    name: 'Central Plains Reactor',
    slug: 'central-plains-reactor',
    location: 'Midwest',
    country: 'United States',
    latitude: 39.0997,
    longitude: -94.5786,
    capacityMw: 950,
    technology: 'Gen III+ PWR',
    status: 'PLANNED',
    summary:
      'A planned 950 MWe Gen III+ pressurized water reactor bringing affordable clean electricity and high-skill jobs to the Midwest.',
    description:
      'The Central Plains Reactor is a planned 950 MWe Generation III+ pressurized water reactor designed to bring secure, affordable and carbon-free power to the heartland of the United States.\n\nLocated to leverage the region’s substantial existing transmission infrastructure and growing industrial and agricultural electrification demand, the project will use a standardised design that has benefitted from more than 15 years of global operating experience.\n\nThe project is currently completing early site permit activities, including geotechnical studies, environmental baseline assessments and engagement with local stakeholders, power purchasers and state and federal regulators. Long-term power purchase negotiations with co-operative and municipal utilities will underpin the investment case.',
    startDate: null,
    completionDate: null,
    envImpact:
      'Once operational, the reactor is projected to avoid approximately 5.1 million tonnes of CO₂ equivalent annually. The design will employ a dry cooling option that reduces water consumption by more than 85% compared with conventional wet cooling towers, protecting regional water resources.',
    economicImpact:
      'Construction is projected to create up to 2,800 jobs at peak with over 350 permanent operations roles. The project expects to deliver $6.5 billion in regional economic impact and anchor affordable power prices for co-operative and municipal utilities serving more than a million customers across the Plains states.',
    milestones: [
      {
        date: '2026-01-15',
        title: 'Early site permit application',
        description:
          'Submission of the early site permit application to the Nuclear Regulatory Commission.',
      },
      {
        date: '2027-08-01',
        title: 'Power purchase agreements',
        description:
          'Finalisation of long-term power purchase agreements with regional utility off-takers.',
      },
      {
        date: '2028-05-01',
        title: 'Construction permit',
        description:
          'Targeted issuance of a construction permit, followed by first nuclear concrete.',
      },
    ],
  },
  {
    name: 'Southern Coastal Project',
    slug: 'southern-coastal-project',
    location: 'Gulf Coast',
    country: 'United States',
    latitude: 29.7604,
    longitude: -95.3698,
    capacityMw: 1800,
    technology: 'Gen III+ PWR',
    status: 'CONSTRUCTION',
    summary:
      'A 1,800 MWe Gen III+ plant under construction on the Gulf Coast, engineered for hurricane resilience and industrial decarbonisation.',
    description:
      'The Southern Coastal Project is an 1,800 MWe Generation III+ pressurized water reactor under construction on the Gulf Coast, engineered specifically for the region’s unique environmental challenges.\n\nThe plant’s design incorporates Category 5 hurricane hardening, elevated structures and flood-resilient grading to meet one of the most demanding siting environments in North America. Seismic isolation bearings and enhanced cooling-system redundancy further reinforce operational reliability.\n\nAlongside power generation, the project is deploying onsite green-hydrogen production capability in partnership with Gulf Coast industrial customers, demonstrating how dedicated nuclear baseload can decarbonise energy-intensive manufacturing, refining and, ultimately, shipping fuels.',
    startDate: '2023-10-01',
    completionDate: '2030-11-01',
    envImpact:
      'The project is expected to avoid as many as 9.3 million tonnes of CO₂ equivalent annually through power and clean-hydrogen production. Site design preserves more than 1,200 acres of coastal wetlands, and construction follows strict sediment and stormwater controls to protect estuarine habitats.',
    economicImpact:
      'At construction peak the project will employ more than 4,100 workers. When operational, it will support approximately 700 permanent jobs and add more than $2 billion in annual regional economic activity, strengthening the Gulf Coast’s position as a hub for clean industrial energy.',
    milestones: [
      {
        date: '2023-10-01',
        title: 'First nuclear concrete',
        description:
          'Construction officially started with the first nuclear concrete pour for the reactor foundation.',
      },
      {
        date: '2025-07-22',
        title: 'Containment vessel placement',
        description:
          'The steel containment vessel lower head was placed, advancing the plant’s safety-architecture build-out.',
      },
      {
        date: '2027-03-01',
        title: 'Turbine building structural completion',
        description:
          'Structural completion of the turbine building, enabling main equipment installation.',
      },
    ],
  },
]

const keyFacts = (p: ProjectDetail) =>
  [
    { label: 'Name', value: p.name },
    { label: 'Location', value: `${p.location}, ${p.country}` },
    { label: 'Status', value: statusLabels[p.status] },
    {
      label: 'Capacity',
      value: p.capacityMw != null ? `${p.capacityMw.toLocaleString()} MW` : '—',
    },
    { label: 'Technology', value: p.technology },
    {
      label: 'Start date',
      value: p.startDate ? formatDate(p.startDate) : 'TBA',
    },
    {
      label: 'Completion',
      value: p.completionDate ? formatDate(p.completionDate) : 'TBA',
    },
    {
      label: 'Country',
      value: p.country,
    },
  ]

async function fetchProject(
  slug: string
): Promise<ProjectDetail | null> {
  try {
    const row = await prisma.project.findUnique({
      where: { slug },
      include: { milestones: { orderBy: { date: 'asc' } } },
    })

    if (row) {
      return {
        name: row.name,
        slug: row.slug,
        location: row.location,
        country: row.country,
        latitude: row.latitude,
        longitude: row.longitude,
        capacityMw: row.capacityMw,
        technology: row.technology,
        status: row.status as ProjectStatus,
        summary: row.summary,
        description: row.description,
        heroImage: row.heroImage,
        startDate: row.startDate?.toISOString() ?? null,
        completionDate: row.completionDate?.toISOString() ?? null,
        envImpact: row.envImpact ?? fallbackEnvImpact,
        economicImpact: row.economicImpact ?? fallbackEconomicImpact,
        milestones: row.milestones.map((m) => ({
          date: m.date.toISOString(),
          title: m.title,
          description: m.description ?? '',
        })),
      }
    }
  } catch {
    // Database not available — fall back to static
  }

  return fallbackProjects.find((p) => p.slug === slug) ?? null
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const rows = await prisma.project.findMany({
      where: { published: true },
      select: { slug: true },
    })
    const dbSlugs = rows.map((r) => r.slug)
    const all = Array.from(
      new Set([...fallbackProjects.map((p) => p.slug), ...dbSlugs])
    )
    return all.map((slug) => ({ slug }))
  } catch {
    return fallbackProjects.map((p) => ({ slug: p.slug }))
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = await fetchProject(slug)

  if (!project) {
    return { title: 'Project Not Found' }
  }

  return {
    title: project.name,
    description: project.summary,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: {
      title: project.name,
      description: project.summary,
      type: 'website',
      url: `/projects/${slug}`,
    },
  }
}

const fallbackEnvImpact =
  'This project is designed to avoid millions of tonnes of CO₂ equivalent each year compared with equivalent fossil-fuel generation. Detailed environmental performance metrics, including emissions avoidance, water stewardship and land-use commitments, will be published in our annual sustainability disclosures as the project progresses.'

const fallbackEconomicImpact =
  'The project supports hundreds of skilled, long-term careers and generates substantial regional economic activity through payroll, local supply contracts, property taxes and workforce development partnerships. Final figures are updated as construction and operations milestones are reached.'

function MilestoneTimeline({ milestones }: { milestones: ProjectMilestone[] }) {
  if (milestones.length === 0) {
    return (
      <p className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-sm leading-relaxed text-slate-500">
        Detailed project milestones will be published as the project advances
        through each phase of development.
      </p>
    )
  }

  return (
    <ol className="relative space-y-8 border-l-2 border-cyan-500/30 pl-8">
      {milestones.map((m) => (
        <li key={m.title} className="relative">
          <span className="absolute -left-[41px] top-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-cyan-500 bg-white">
            <span className="h-2 w-2 rounded-full bg-cyan-500" />
          </span>
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-600">
            {formatDate(m.date)}
          </p>
          <h4 className="mt-1 text-lg font-bold text-navy-900">{m.title}</h4>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {m.description}
          </p>
        </li>
      ))}
    </ol>
  )
}

interface ProjectDetailParams {
  slug: string
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<ProjectDetailParams>
}) {
  const { slug } = await params
  const project = await fetchProject(slug)

  if (!project) {
    return (
      <section className="gradient-navy">
        <div className="container-narrow px-4 py-24 sm:px-6 md:py-32">
          <div className="mx-auto max-w-lg text-center">
            <h1 className="text-3xl font-bold text-white">
              Project not found
            </h1>
            <p className="mt-4 text-navy-100/80">
              The project you are looking for could not be located.
            </p>
            <Button href="/projects" className="mt-8">
              Back to Projects
            </Button>
          </div>
        </div>
      </section>
    )
  }

  const facts = keyFacts(project)

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={projectImage(project.slug)}
            alt={project.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-navy-hero" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-navy-950/90 to-transparent" />
        </div>

        <div className="container-narrow relative z-10 px-4 py-24 sm:px-6 md:py-28">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-navy-100/80 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            All Projects
          </Link>

          <div className="mt-10 max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {project.name}
            </h1>
            <p className="mt-6 flex items-start gap-3 text-lg leading-relaxed text-navy-100/80">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-cyan-400" />
              {project.location}, {project.country}
            </p>
            <p className="mt-8 max-w-2xl text-xl font-medium leading-relaxed text-white">
              {project.summary}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm">
              {project.capacityMw != null && (
                <span className="text-3xl font-bold text-cyan-400">
                  {project.capacityMw.toLocaleString()}{' '}
                  <span className="text-base font-semibold text-navy-100/80">
                    MW
                  </span>
                </span>
              )}
              <span className="text-navy-100/80">{project.technology}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-narrow">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-6">
                <span
                  className={`inline-flex w-fit items-center rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider ${statusBadgeClasses[project.status]}`}
                >
                  {statusLabels[project.status]}
                </span>
              </div>
              <SectionHeading title="Project Overview" />
              <Reveal className="space-y-5 text-base leading-relaxed text-slate-600">
                {project.description.split('\n\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </Reveal>
            </div>

            <aside className="h-fit rounded-2xl border border-slate-200 bg-slate-50 p-6 lg:sticky lg:top-24">
              <h3 className="flex items-center gap-2 text-lg font-bold text-navy-900">
                <Factory className="h-5 w-5 text-cyan-600" />
                Key Facts
              </h3>
              <dl className="mt-6 divide-y divide-slate-200">
                {facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="flex items-start justify-between gap-4 py-3"
                  >
                    <dt className="text-sm font-medium text-slate-500">
                      {fact.label}
                    </dt>
                    <dd className="text-right text-sm font-semibold text-navy-900">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <Button href="/contact" variant="secondary" className="mt-6 w-full">
                Enquire About This Project
              </Button>
            </aside>
          </div>
        </div>
      </section>

      <section className="section-padding bg-slate-50">
        <div className="container-narrow">
          <CardImage
            src={projectImage(project.slug)}
            alt={`${project.name} — ${project.technology}`}
            className="aspect-[21/9] rounded-2xl"
            sizes="100vw"
            priority
          />
        </div>
        <div className="container-narrow mt-14 grid gap-14 lg:grid-cols-2">
          <Reveal>
            <div className="flex items-center gap-3">
              <Leaf className="h-6 w-6 text-emerald-600" />
              <h3 className="text-2xl font-bold text-navy-900">
                Environmental Impact
              </h3>
            </div>
            <p className="mt-5 text-base leading-relaxed text-slate-600">
              {project.envImpact}
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-cyan-600" />
              <h3 className="text-2xl font-bold text-navy-900">
                Economic Impact
              </h3>
            </div>
            <p className="mt-5 text-base leading-relaxed text-slate-600">
              {project.economicImpact}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-narrow">
          <div className="flex items-center gap-3">
            <Calendar className="h-6 w-6 text-cyan-600" />
            <h3 className="text-3xl font-bold text-navy-900">
              Project Timeline
            </h3>
          </div>
          <div className="mt-12 grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <MilestoneTimeline milestones={project.milestones} />
            </div>
            <div className="h-fit rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h4 className="text-lg font-bold text-navy-900">
                Programme Highlights
              </h4>
              <ul className="mt-4 space-y-4 text-sm leading-relaxed text-slate-600">
                <li className="flex gap-3">
                  <Landmark className="mt-0.5 h-4 w-4 shrink-0 text-cyan-600" />
                  Regulated under the highest international safety standards,
                  with continuous regulatory engagement from first concrete to
                  commercial operation.
                </li>
                <li className="flex gap-3">
                  <Leaf className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  Carbon-free generation supporting national and regional net
                  zero commitments.
                </li>
                <li className="flex gap-3">
                  <Factory className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                  Long-term power purchase agreements securing clean baseload
                  capacity for utilities and industry.
                </li>
              </ul>
              <Button
                href="/contact"
                variant="outline"
                size="sm"
                className="mt-6 w-full"
              >
                Talk to Us
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}