import SectionHeading from '@/components/ui/section-heading'
import Button from '@/components/ui/button'
import PageHeader from '@/components/ui/page-header'
import Reveal from '@/components/ui/reveal'
import CardImage from '@/components/ui/card-image'
import { images } from '@/lib/images'
import {
  ArrowLeft,
  Building2,
  FlaskConical,
  GraduationCap,
  Atom,
  Microscope,
} from 'lucide-react'

const partnerships = [
  {
    name: 'University Partnership Programs',
    description:
      'We fund research chairs, doctoral fellowships, and cutting-edge laboratory programs at 25 leading universities worldwide. These partnerships advance nuclear science while developing the next generation of researchers and engineers.',
    examples: ['MIT Department of Nuclear Science', 'Georgia Tech Nuclear Engineering', 'Imperial College London Centre for Nuclear Engineering', 'Tokyo Institute of Technology'],
    image: images.lab,
  },
  {
    name: 'National Laboratory Collaborations',
    description:
      'Together with national laboratories, we conduct fundamental materials research, fuel cycle studies, and advanced reactor concept validation — sharing knowledge for the benefit of the entire industry.',
    examples: ['Materials irradiation programs', 'Advanced fuel cycle research', 'Severe accident phenomenology studies', 'High-temperature materials testing'],
    image: images.engineers,
  },
  {
    name: 'International Partnerships',
    description:
      'We participate in international research consortia under the IAEA and Generation IV International Forum, contributing to pre-competitive research that accelerates the global development of next-generation reactors.',
    examples: ['Generation IV International Forum', 'IAEA Coordinated Research Projects', 'OECD/NEA data sharing programs', 'EU framework research projects'],
    image: images.earth,
  },
]

const focusAreas = [
  {
    icon: Atom,
    title: 'Advanced Reactor Designs',
    description:
      'R&D on high-temperature, gas-cooled, molten-salt, and fast reactor concepts, focusing on safety margins, fuel efficiency, and structural integrity at extreme conditions.',
    image: images.reactors,
  },
  {
    icon: Microscope,
    title: 'Fuel Cycle Innovations',
    description:
      'Research into accident-tolerant fuels, higher burnup uranium fuel, and recycling technologies that extract more energy from used nuclear fuel while reducing waste volumes.',
    image: images.lab,
  },
  {
    icon: FlaskConical,
    title: 'Materials & Component Reliability',
    description:
      'Studying how radiation, heat, and corrosion affect structural materials over 80-year design lives, and developing new alloys, coatings, and inspection techniques.',
    image: images.workshop,
  },
  {
    icon: GraduationCap,
    title: 'Simulation & Modeling',
    description:
      'Developing high-fidelity multi-physics codes that simulate reactor behavior in unprecedented detail, reducing the need for expensive experimental campaigns.',
    image: images.controlRoom,
  },
]

const facilities = [
  {
    name: 'ENEC Research Center',
    location: 'Washington, DC',
    description:
      'Our flagship research campus, hosting the SMR test systems, thermal-hydraulic laboratories, and the digital twin development center.',
    features: ['Zero-power SMR criticality test facility', 'High-pressure thermal-hydraulics rigs', 'Digital twin development laboratory'],
    image: images.lab,
  },
  {
    name: 'Advanced Materials Laboratory',
    location: 'Oak Ridge, TN',
    description:
      'Focused on radiation effects in materials, this facility is equipped with ion accelerators and post-irradiation examination cells for advanced alloys and fuels.',
    features: ['Multiple ion-beam accelerator facilities', 'Hot cell post-irradiation examination', 'Mechanical and corrosion testing suites'],
    image: images.engineers,
  },
  {
    name: 'Center for Simulation & AI',
    location: 'Denver, CO',
    description:
      'Home to our high-performance computing cluster and AI development teams building the digital twin platform used across the fleet.',
    features: ['Exascale-class simulation cluster', 'AI model training and inference infrastructure', 'Operator training simulators'],
    image: images.controlRoom,
  },
]

const publications = [
  { title: 'Passive Safety System Performance in Advanced PWR Designs Under Station Blackout Conditions', journal: 'Nuclear Engineering and Design', year: 2025, type: 'Peer-Reviewed Journal' },
  { title: 'Machine Learning Approaches for Anomaly Detection in Nuclear Power Plant Sensor Networks', journal: 'Annals of Nuclear Energy', year: 2025, type: 'Peer-Reviewed Journal' },
  { title: 'Radiation Effects on Additively Manufactured Components for Nuclear Service', journal: 'Journal of Nuclear Materials', year: 2024, type: 'Peer-Reviewed Journal' },
  { title: 'A Digital Twin Framework for Predictive Maintenance in Nuclear Generation', journal: 'Nuclear Technology', year: 2024, type: 'Peer-Reviewed Journal' },
  { title: 'Fuel Cycle Economics of Small Modular Reactors in Decarbonized Energy Systems', journal: 'Energy Policy', year: 2023, type: 'Peer-Reviewed Journal' },
  { title: 'Advanced Spatial Kinetics Methods for SMR Licensing Simulations', journal: 'Progress in Nuclear Energy', year: 2023, type: 'Peer-Reviewed Journal' },
]

export default async function ResearchPage() {
  return (
    <>
      <PageHeader
        eyebrow="Innovation"
        title="Research & Development"
        description={
          <>
            Our research programs bridge the gap between scientific discovery and commercial nuclear
            technology — advancing safety, efficiency, and sustainability for the entire industry.
          </>
        }
        image={images.controlRoom}
      >
        <Button href="/innovation" variant="ghost" className="mt-8">
          <ArrowLeft className="h-4 w-4" /> Back to Innovation
        </Button>
      </PageHeader>

      {/* Research Partnerships */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            title="Research Partnerships"
            subtitle="We believe the future of nuclear energy will be built through open collaboration. Our partnerships span academia, national laboratories, and international consortia."
            centered
          />
          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {partnerships.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.08}>
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <CardImage
                    src={p.image}
                    alt={p.name}
                    className="aspect-[16/9]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="p-8">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10">
                      <GraduationCap className="h-6 w-6 text-cyan-500" />
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-navy-900">{p.name}</h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">{p.description}</p>
                    <ul className="mt-4 space-y-2">
                      {p.examples.map((e) => (
                        <li key={e} className="flex items-start gap-2 text-sm text-slate-700">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" />
                          {e}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* R&D Focus Areas */}
      <section className="bg-slate-50 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            title="R&D Focus Areas"
            subtitle="Our research portfolio concentrates on four areas with the greatest potential to transform nuclear energy."
            centered
          />
          <div className="mt-16 grid gap-6 sm:grid-cols-2">
            {focusAreas.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.08}>
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <CardImage
                    src={f.image}
                    alt={f.title}
                    className="aspect-[16/9]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="p-8">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10">
                      <f.icon className="h-6 w-6 text-cyan-500" />
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-navy-900">{f.title}</h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">{f.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Research Facilities */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            title="Research Facilities"
            subtitle="World-class facilities where our scientists and engineers push the boundaries of nuclear technology."
            centered
          />
          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {facilities.map((f, i) => (
              <Reveal key={f.name} delay={i * 0.08}>
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col">
                  <CardImage
                    src={f.image}
                    alt={f.name}
                    className="aspect-[16/9]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="flex flex-1 flex-col p-8">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900">
                      <Building2 className="h-6 w-6 text-cyan-400" />
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-navy-900">{f.name}</h3>
                    <p className="text-sm font-semibold text-cyan-500">{f.location}</p>
                    <p className="mt-3 text-sm text-slate-600 leading-relaxed">{f.description}</p>
                    <ul className="mt-4 space-y-2">
                      {f.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2 text-sm text-slate-700">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" />
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Publications */}
      <section className="bg-navy-900 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            title="Publication Highlights"
            subtitle="Selected peer-reviewed publications from our research teams."
            centered
            light
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {publications.map((pub, i) => (
              <Reveal key={pub.title} delay={i * 0.08}>
                <div
                  className="rounded-xl border border-white/10 bg-white/5 p-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                      {pub.type}
                    </span>
                    <span className="text-sm font-bold text-white">{pub.year}</span>
                  </div>
                  <p className="mt-3 font-semibold text-white leading-relaxed">{pub.title}</p>
                  <p className="mt-2 text-sm text-navy-100/60">{pub.journal}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}