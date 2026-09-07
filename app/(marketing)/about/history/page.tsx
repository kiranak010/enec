import PageHeader from '@/components/ui/page-header'
import Reveal from '@/components/ui/reveal'
import Button from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { images } from '@/lib/images'

const decades = [
  {
    period: '1974 – 1984',
    title: 'The Founding Era',
    description:
      'Emirates Nuclear Energy Corporation was established in 1974 with a bold vision: to harness the power of the atom for peaceful, productive purposes. Our founders — a coalition of nuclear physicists, engineers, and forward-thinking policymakers — recognized that nuclear energy represented the most viable path to large-scale, carbon-free electricity generation.',
    milestones: [
      { year: 1974, event: 'Emirates Nuclear Energy Corporation incorporated in Abu Dhabi, United Arab Emirates.' },
      { year: 1976, event: 'Secured federal licensing for first reactor site selection.' },
      { year: 1978, event: 'Construction began on the ENEC-1 facility.' },
      { year: 1982, event: 'ENEC-1, our first pressurized water reactor, achieved commercial operation.' },
      { year: 1984, event: 'First full year of operation; capacity factor exceeded 70%.' },
    ],
  },
  {
    period: '1985 – 1994',
    title: 'Building the Foundation',
    description:
      'Through the late 1980s and early 1990s, we expanded our domestic fleet and refined our operational practices. This era saw the development of our standardized reactor design philosophy and the establishment of our rigorous safety culture framework.',
    milestones: [
      { year: 1986, event: 'Established the ENEC Safety Review Board as an independent oversight body.' },
      { year: 1988, event: 'ENEC-2 reactor achieved first criticality and entered commercial service.' },
      { year: 1990, event: 'Introduced standardized operating procedures across the fleet.' },
      { year: 1992, event: 'Opened the ENEC Training Center for workforce development.' },
      { year: 1994, event: 'Achieved fleet-wide capacity factor of 82%, leading the industry.' },
    ],
  },
  {
    period: '1995 – 2004',
    title: 'International Expansion',
    description:
      'The mid-1990s marked a turning point as ENEC extended its expertise beyond domestic borders. Strategic partnerships and international contracts established the company as a trusted global nuclear operator and technology provider.',
    milestones: [
      { year: 1995, event: 'Signed first international operations agreement.' },
      { year: 1997, event: 'Deployed ENEC technical advisory teams to partner nations.' },
      { year: 1999, event: 'Established European operations hub in London.' },
      { year: 2001, event: 'Received international safety certification from the IAEA.' },
      { year: 2003, event: 'Launched the Advanced Reactor Research Initiative (ARRI).' },
    ],
  },
  {
    period: '2005 – 2014',
    title: 'Growth and Innovation',
    description:
      'This decade witnessed aggressive capacity growth and the launch of our Gen III+ reactor program. We invested heavily in advanced digital instrumentation, automation, and next-generation safety systems, positioning ENEC at the cutting edge of nuclear technology.',
    milestones: [
      { year: 2006, event: 'Broke ground on two new reactor units simultaneously.' },
      { year: 2008, event: 'Completed acquisition of regional energy partner, expanding our fleet.' },
      { year: 2010, event: 'Surpassed 10 GW of installed nuclear capacity worldwide.' },
      { year: 2012, event: 'Commissioned first Gen III+ reactor with passive safety systems.' },
      { year: 2014, event: 'Launched the ENEC Digital Twin program for predictive maintenance.' },
    ],
  },
  {
    period: '2015 – Present',
    title: 'Leading the Energy Transition',
    description:
      'Today, ENEC is at the forefront of the global energy transition. With 25 GW of installed capacity and a pipeline of advanced reactor projects, we are scaling clean baseload power to meet growing demand while supporting decarbonization goals worldwide.',
    milestones: [
      { year: 2016, event: 'Established the Small Modular Reactor (SMR) development program.' },
      { year: 2018, event: 'Signed long-term power purchase agreements across three continents.' },
      { year: 2020, event: 'Achieved record capacity factor of 93.5% across the fleet.' },
      { year: 2022, event: 'Announced partnership for first commercial Gen IV reactor demonstration.' },
      { year: 2024, event: 'Reached 25 GW milestone — enough to power 18 million homes.' },
      { year: 2025, event: 'Selected for three new-build projects in emerging nuclear markets.' },
    ],
  },
]

export default async function HistoryPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title="Our History"
        description={
          <>
            Over fifty years of building trust through performance. From a single reactor to a global
            fleet powering millions of homes and businesses.
          </>
        }
        image={images.city}
      >
        <Button href="/about" variant="ghost" className="mt-8">
          <ArrowLeft className="h-4 w-4" /> Back to About
        </Button>
      </PageHeader>

      {decades.map((decade, i) => (
        <section
          key={decade.period}
          className={i % 2 === 0 ? 'py-24 md:py-32' : 'bg-slate-50 py-24 md:py-32'}
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Reveal>
              <div className="grid gap-12 lg:grid-cols-5">
                <div className="lg:col-span-2">
                  <span className="inline-block rounded-full bg-cyan-500 px-4 py-1 text-sm font-bold text-white mb-4">
                    {decade.period}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-navy-900 tracking-tight">
                    {decade.title}
                  </h2>
                  <p className="mt-4 text-slate-600 leading-relaxed">{decade.description}</p>
                </div>
                <div className="lg:col-span-3">
                  <div className="relative border-l-2 border-cyan-200 pl-8 space-y-8">
                    {decade.milestones.map((m) => (
                      <div key={m.year} className="relative">
                        <div className="absolute -left-10 top-1 h-4 w-4 rounded-full border-2 border-cyan-500 bg-white" />
                        <p className="text-sm font-bold text-cyan-500">{m.year}</p>
                        <p className="mt-1 text-navy-900 leading-relaxed">{m.event}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      ))}

      <section className="bg-navy-900 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              The Next Chapter Begins
            </h2>
            <p className="mt-4 text-navy-100/70 max-w-2xl mx-auto">
              As we look ahead, ENEC remains committed to advancing nuclear technology for
              a cleaner, more sustainable energy future.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href="/about/leadership" variant="primary">
                Meet Our Leaders
              </Button>
              <Button href="/innovation" variant="outline">
                Explore Our Innovation
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
