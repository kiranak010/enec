import SectionHeading from '@/components/ui/section-heading'
import Button from '@/components/ui/button'
import PageHeader from '@/components/ui/page-header'
import Reveal from '@/components/ui/reveal'
import CardImage from '@/components/ui/card-image'
import { images } from '@/lib/images'
import { ArrowLeft, Leaf, Droplets, TreePine, Recycle } from 'lucide-react'

const focusAreas = [
  {
    icon: Leaf,
    title: 'Decarbonization Impact',
    description:
      'Nuclear energy is one of the largest sources of clean electricity globally. Our fleet of reactors avoids the emission of approximately 36 million metric tons of carbon dioxide annually — equivalent to removing nearly 8 million cars from the road. Every kilowatt-hour of nuclear electricity displaces fossil fuel generation and its associated greenhouse gas emissions.',
    stats: [
      { label: 'Annual CO₂ Avoided', value: '36M tons' },
      { label: 'Equivalent Cars Removed', value: '~8 million' },
      { label: 'Zero Direct Emissions', value: 'During operation' },
    ],
    image: images.grid,
  },
  {
    icon: Droplets,
    title: 'Water Stewardship',
    description:
      'We recognize our responsibility to manage water resources sustainably. Our plants are designed with closed-loop cooling systems that minimize freshwater withdrawal. We continuously invest in advanced water treatment technologies and monitor aquatic ecosystems around our facilities to ensure environmental protection.',
    stats: [
      { label: 'Water Recycled', value: '97%' },
      { label: 'Closed-Loop Systems', value: 'All plants' },
      { label: 'Aquatic Monitoring', value: 'Continuous' },
    ],
    image: images.earth,
  },
  {
    icon: TreePine,
    title: 'Biodiversity',
    description:
      'Nuclear facilities have a remarkably small land footprint compared to other energy sources, which helps preserve natural habitats. We conduct regular environmental impact assessments, maintain biodiversity monitoring programs, and partner with conservation organizations to protect local ecosystems around our sites.',
    stats: [
      { label: 'Land Use per GWh', value: '1/400th of solar' },
      { label: 'Environmental Assessments', value: 'Annual' },
      { label: 'Conservation Partners', value: '12+' },
    ],
    image: images.nature,
  },
  {
    icon: Recycle,
    title: 'Waste Management',
    description:
      'Nuclear waste volumes are remarkably small compared to other energy sources. All spent fuel is safely stored and managed under strict regulatory oversight. We support the development of advanced fuel cycle technologies and long-term geological disposal solutions to ensure responsible waste management for future generations.',
    stats: [
      { label: 'Total Spent Fuel (All Time)', value: '< 1% of original ore' },
      { label: 'Storage Method', value: 'Dry cask / pool' },
      { label: 'Regulatory Compliance', value: '100%' },
    ],
    image: images.lab,
  },
]

const environmentalMetrics = [
  { label: 'Fleet Capacity Factor', value: '93.5%', description: 'Maximizing clean energy output' },
  { label: 'Land Footprint', value: '1 sq mile per 1,000 MW', description: 'Among the lowest of any energy source' },
  { label: 'Cooling Water Temperature', value: '< 3°F above ambient', description: 'Minimal thermal impact' },
  { label: 'Air Emissions', value: 'Zero direct', description: 'No NOx, SOx, or particulates' },
  { label: 'Radioactive Discharge', value: '< 1% of regulatory limits', description: 'Consistently well below limits' },
  { label: 'Waste per GWh', value: '~20 grams', description: 'Compared to ~500,000g for coal' },
]

export default async function EnvironmentPage() {
  return (
    <>
      <PageHeader
        eyebrow="Sustainability"
        title="Environmental Impact"
        description={
          <>
            Nuclear energy is inherently low-carbon. Our operations produce zero direct air emissions
            while generating reliable baseload electricity at scale — making a measurable contribution
            to global decarbonization.
          </>
        }
        image={images.earth}
      >
        <Button href="/sustainability" variant="ghost" className="mt-8">
          <ArrowLeft className="h-4 w-4" /> Back to Sustainability
        </Button>
      </PageHeader>

      {focusAreas.map((area, i) => (
        <section key={area.title} className={i % 2 === 0 ? 'py-24 md:py-32' : 'bg-slate-50 py-24 md:py-32'}>
          <Reveal className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 items-start">
              <div>
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-500/10">
                  <area.icon className="h-7 w-7 text-cyan-500" />
                </div>
                <h2 className="mt-6 text-3xl md:text-4xl font-bold text-navy-900 tracking-tight">
                  {area.title}
                </h2>
                <p className="mt-4 text-slate-600 leading-relaxed">{area.description}</p>
                <div className="group mt-8 overflow-hidden rounded-2xl">
                  <CardImage
                    src={area.image}
                    alt={area.title}
                    className="aspect-[16/10]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <h3 className="text-lg font-bold text-navy-900 mb-4">Key Metrics</h3>
                <div className="space-y-4">
                  {area.stats.map((s) => (
                    <div key={s.label} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                      <span className="text-sm text-slate-600">{s.label}</span>
                      <span className="text-sm font-bold text-navy-900">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      ))}

      {/* Environmental Metrics Grid */}
      <section className="bg-navy-900 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            title="Environmental Performance"
            subtitle="Key indicators demonstrating our commitment to environmental responsibility."
            centered
            light
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {environmentalMetrics.map((m, i) => (
              <Reveal key={m.label} delay={i * 0.08}>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <p className="text-2xl font-bold text-cyan-400">{m.value}</p>
                  <p className="mt-2 font-bold text-white">{m.label}</p>
                  <p className="mt-1 text-sm text-navy-100/60">{m.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
