import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import SectionHeading from '@/components/ui/section-heading'
import Button from '@/components/ui/button'
import PageHeader from '@/components/ui/page-header'
import Reveal from '@/components/ui/reveal'
import CardImage from '@/components/ui/card-image'
import { images } from '@/lib/images'
import { ArrowRight, Leaf, Users, Shield } from 'lucide-react'

const fallbackMetrics = [
  { label: 'CO₂ Avoided', value: '36', unit: 'million', suffix: 'tons annually' },
  { label: 'Fleet Capacity Factor', value: '93.5', unit: '%', suffix: 'in 2024' },
  { label: 'Water Recycled', value: '97', unit: '%', suffix: 'of process water' },
  { label: 'Employees Worldwide', value: '15,000', unit: '+', suffix: 'across 12 countries' },
]

const esgPillars = [
  {
    icon: Leaf,
    title: 'Environmental',
    description:
      'Nuclear energy is one of the cleanest sources of electricity available. Our operations produce zero direct carbon emissions, and we are committed to minimizing our environmental footprint through water stewardship, biodiversity conservation, and responsible waste management.',
    link: '/sustainability/environment',
    image: images.nature,
  },
  {
    icon: Users,
    title: 'Social',
    description:
      'We invest in the communities where we operate through education programs, local hiring initiatives, economic development partnerships, and community engagement. Our goal is to create lasting, positive impact that extends beyond energy generation.',
    link: '/sustainability/community',
    image: images.team,
  },
  {
    icon: Shield,
    title: 'Governance',
    description:
      'Strong governance underpins everything we do. Our Board, committees, and corporate policies ensure transparency, ethical conduct, regulatory compliance, and responsible stewardship of nuclear technology and resources.',
    link: '/about/governance',
    image: images.documentArchive,
  },
]

export default async function SustainabilityPage() {
  let metrics = fallbackMetrics
  try {
    const dbMetrics = await prisma.sustainabilityMetric.findMany({
      where: { published: true },
      orderBy: { sortOrder: 'asc' },
      take: 4,
    })
    if (dbMetrics.length > 0) {
      metrics = dbMetrics.map((m) => ({
        label: m.label,
        value: String(m.value),
        unit: m.unit,
        suffix: m.suffix ?? '',
      }))
    }
  } catch {
    // Use static fallback
  }

  return (
    <>
      <PageHeader
        eyebrow="Sustainability"
        title="Sustainability"
        description={
          <>
            Sustainability is embedded in our strategy, operations, and culture. We are committed
            to delivering clean energy while creating value for our stakeholders, communities, and
            the planet.
          </>
        }
        image={images.nature}
      />

      {/* Key Metrics */}
      <section className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((m, i) => (
              <Reveal key={m.label} delay={i * 0.08}>
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-center">
                  <p className="text-3xl font-bold text-cyan-500">
                    {m.value}{m.unit}
                  </p>
                  <p className="mt-2 text-sm font-bold text-navy-900">{m.label}</p>
                  <p className="mt-1 text-xs text-slate-500">{m.suffix}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ESG Pillars */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            title="Our ESG Pillars"
            subtitle="We structure our sustainability approach around three pillars: Environmental stewardship, Social responsibility, and strong Governance."
            centered
          />
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {esgPillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <Link
                  href={p.link}
                  className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:border-cyan-200 hover:shadow-md"
                >
                  <CardImage
                    src={p.image}
                    alt={p.title}
                    className="aspect-[16/9]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="p-8">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-500/10">
                      <p.icon className="h-7 w-7 text-cyan-500" />
                    </div>
                    <h3 className="mt-6 text-xl font-bold text-navy-900 group-hover:text-cyan-500 transition-colors">
                      {p.title}
                    </h3>
                    <p className="mt-3 text-sm text-slate-600 leading-relaxed">{p.description}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-cyan-500">
                      Learn More <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="bg-navy-900 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <SectionHeading
            title="Our Approach"
            subtitle="We integrate sustainability into every aspect of our business — from reactor design and construction to operations, community engagement, and long-term planning."
            centered
            light
          />
          <Reveal>
            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <Button href="/sustainability/environment" variant="primary">
                Environmental Impact
              </Button>
              <Button href="/sustainability/community" variant="outline">
                Community Programs
              </Button>
              <Button href="/sustainability/reports" variant="outline">
                View Reports
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
