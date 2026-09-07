import PageHeader from '@/components/ui/page-header'
import Reveal from '@/components/ui/reveal'
import SectionHeading from '@/components/ui/section-heading'
import Button from '@/components/ui/button'
import { ArrowLeft, Zap } from 'lucide-react'
import { images } from '@/lib/images'

const reactorTypes = [
  {
    name: 'Pressurized Water Reactor (PWR)',
    generation: 'Gen II / Gen III+',
    description:
      'The most widely deployed reactor type globally. A pressurized water reactor uses ordinary water as both coolant and neutron moderator. The primary loop maintains high pressure to prevent boiling, transferring heat to a secondary loop that generates steam for electricity production.',
    features: ['Positive void coefficient', 'Separate primary and secondary loops', 'Robust containment structures', 'Proven track record with 60+ year operational history'],
    capacity: '1,000 – 1,700 MWe',
    countries: '30+ countries',
  },
  {
    name: 'Boiling Water Reactor (BWR)',
    generation: 'Gen II / Gen III+',
    description:
      'In a boiling water reactor, water boils directly in the reactor core, and the resulting steam drives the turbine. This simpler design eliminates the need for steam generators, reducing complexity while maintaining excellent safety characteristics.',
    features: ['Direct steam cycle', 'Simpler design with fewer components', 'Excellent operational flexibility', 'Advanced variants include passive safety systems'],
    capacity: '600 – 1,400 MWe',
    countries: '10+ countries',
  },
  {
    name: 'Gen III+ Advanced Reactors',
    generation: 'Gen III+',
    description:
      'Gen III+ reactors represent the latest evolution in large-scale nuclear plants. They incorporate passive safety systems that rely on natural forces — gravity, convection, and natural circulation — to maintain safety without operator intervention or external power.',
    features: ['Passive safety systems', '60-year design life', 'Enhanced seismic and flood protection', 'Simplified construction with modular techniques'],
    capacity: '1,100 – 1,750 MWe',
    countries: 'Select new-build markets',
  },
  {
    name: 'Generation IV Reactors',
    generation: 'Gen IV',
    description:
      'Generation IV reactors are advanced designs currently in development that promise significant improvements in safety, sustainability, economics, and proliferation resistance. These reactors can use alternative coolants such as molten salt, sodium, or gas, and can operate at much higher temperatures.',
    features: ['Operating temperatures above 700°C', 'Potential for hydrogen production', 'Reduced nuclear waste volume', 'Enhanced fuel utilization'],
    capacity: '100 – 1,500 MWe',
    countries: 'International R&D consortia',
  },
  {
    name: 'Small Modular Reactors (SMR)',
    generation: 'Gen III+ / Gen IV',
    description:
      'Small Modular Reactors are compact nuclear plants designed for factory fabrication and modular deployment. Their smaller size allows for incremental capacity additions, remote site deployment, and integration with industrial processes beyond electricity generation.',
    features: ['Factory-built modules', 'Flexible siting options', 'Load-following capability', 'Potential for district heating and desalination'],
    capacity: '50 – 300 MWe',
    countries: 'Multiple licensing programs',
  },
]

const comparisonMetrics = [
  { metric: 'Typical Capacity', pwr: '1,000–1,700 MWe', bwr: '600–1,400 MWe', genIII: '1,100–1,750 MWe', smr: '50–300 MWe' },
  { metric: 'Coolant', pwr: 'Light Water', bwr: 'Light Water', genIII: 'Light Water', smr: 'Varies' },
  { metric: 'Passive Safety', pwr: 'In Gen III+', bwr: 'In Gen III+', genIII: 'Standard', smr: 'Standard' },
  { metric: 'Design Life', pwr: '40–60 years', bwr: '40–60 years', genIII: '60+ years', smr: '40–60 years' },
  { metric: 'Construction', pwr: 'On-site', bwr: 'On-site', genIII: 'On-site / Modular', smr: 'Factory / Modular' },
  { metric: 'Deployment Scale', pwr: 'Large Grid', bwr: 'Large Grid', genIII: 'Large Grid', smr: 'Flexible / Remote' },
]

export default async function TechnologyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Nuclear Energy"
        title="Reactor Technology"
        description={
          <>
            From proven Gen II designs to cutting-edge Generation IV concepts, we operate and develop
            a portfolio of reactor technologies suited to diverse energy needs.
          </>
        }
        image={images.controlRoom}
      >
        <Button href="/nuclear-energy" variant="ghost" className="mt-8">
          <ArrowLeft className="h-4 w-4" /> Back to Nuclear Energy
        </Button>
      </PageHeader>

      {/* Reactor Types */}
      {reactorTypes.map((r, i) => (
        <section key={r.name} className={i % 2 === 0 ? 'py-24 md:py-32' : 'bg-slate-50 py-24 md:py-32'}>
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal delay={i * 0.05}>
            <div className="grid gap-12 lg:grid-cols-2 items-start">
              <div>
                <span className="inline-block rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-500 mb-4">
                  {r.generation}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-navy-900 tracking-tight">
                  {r.name}
                </h2>
                <p className="mt-4 text-slate-600 leading-relaxed">{r.description}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <h3 className="text-lg font-bold text-navy-900 mb-4">Key Features</h3>
                <ul className="space-y-3">
                  {r.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                      <Zap className="mt-0.5 h-4 w-4 shrink-0 text-cyan-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Capacity</p>
                    <p className="mt-1 text-sm font-bold text-navy-900">{r.capacity}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Deployment</p>
                    <p className="mt-1 text-sm font-bold text-navy-900">{r.countries}</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
          </div>
        </section>
      ))}

      {/* Comparison Table */}
      <section className="bg-navy-900 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            title="Technology Comparison"
            subtitle="A side-by-side view of key reactor technologies."
            centered
            light
          />
          <Reveal>
          <div className="mt-12 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-4 pr-4 font-semibold text-white">Metric</th>
                  <th className="py-4 px-4 font-semibold text-white">PWR</th>
                  <th className="py-4 px-4 font-semibold text-white">BWR</th>
                  <th className="py-4 px-4 font-semibold text-white">Gen III+</th>
                  <th className="py-4 pl-4 font-semibold text-white">SMR</th>
                </tr>
              </thead>
              <tbody>
                {comparisonMetrics.map((m) => (
                  <tr key={m.metric} className="border-b border-white/5">
                    <td className="py-4 pr-4 font-medium text-cyan-400">{m.metric}</td>
                    <td className="py-4 px-4 text-navy-100/80">{m.pwr}</td>
                    <td className="py-4 px-4 text-navy-100/80">{m.bwr}</td>
                    <td className="py-4 px-4 text-navy-100/80">{m.genIII}</td>
                    <td className="py-4 pl-4 text-navy-100/80">{m.smr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-bold text-navy-900 tracking-tight">
              Interested in Our Technology?
            </h2>
            <p className="mt-4 text-slate-600 max-w-xl mx-auto">
              Learn about the advanced reactors we are developing for the next generation of clean energy.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button href="/innovation" variant="primary">
                Explore Innovation
              </Button>
              <Button href="/projects" variant="outline">
                View Projects
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
