import SectionHeading from '@/components/ui/section-heading'
import Button from '@/components/ui/button'
import PageHeader from '@/components/ui/page-header'
import Reveal from '@/components/ui/reveal'
import CardImage from '@/components/ui/card-image'
import { images } from '@/lib/images'
import {
  ArrowRight,
  Atom,
  BrainCircuit,
  Bot,
  FlaskConical,
  ShieldCheck,
  Factory,
} from 'lucide-react'

const innovationAreas = [
  {
    icon: Atom,
    title: 'Advanced Reactors',
    description:
      'We are developing next-generation reactor designs that go beyond conventional water-cooled technology. Our advanced reactor program — spanning Generation IV concepts and transportable micro-reactors — focuses on higher thermal efficiency, reduced waste, and enhanced inherent safety. These systems promise to expand the applications of nuclear energy beyond electricity to industrial heat, hydrogen production, and district heating.',
    highlights: [
      'Gen IV reactor concepts with passive safety and high-temperature operation',
      'Small Modular Reactor (SMR) program progressing through licensing',
      'Micro-reactor concepts for remote and military applications',
    ],
    image: images.reactors,
  },
  {
    icon: BrainCircuit,
    title: 'AI & Digital Twins',
    description:
      'Artificial intelligence and digital twin technology are transforming how we operate and maintain our fleet. Full-fidelity digital replicas of our plants allow us to simulate operations, predict maintenance needs, and optimize performance — all without disturbing live systems. Our AI systems analyze millions of data points to identify anomalies before they develop into operational issues.',
    highlights: [
      'Full-plant digital twins deployed across the fleet',
      'Predictive maintenance models reducing unplanned outages',
      'AI-assisted operator decision support tools',
    ],
    image: images.controlRoom,
  },
  {
    icon: Bot,
    title: 'Robotics & Automation',
    description:
      'Robotics and automation are enhancing safety and efficiency in environments that are challenging for humans — from in-vessel inspection to remote site monitoring. Our robotics programs reduce worker radiation exposure while enabling more thorough, faster inspections and maintenance.',
    highlights: [
      'Robotic inspection systems for reactor internals',
      'Autonomous drones for site and facility monitoring',
      'Remote handling systems for challenging maintenance tasks',
    ],
    image: images.workshop,
  },
  {
    icon: FlaskConical,
    title: 'Materials Science',
    description:
      'Advances in materials science are enabling longer plant life, higher performance, and safer operation. Our materials research focuses on radiation-resistant alloys, advanced fuel cladding, and concrete technologies that extend the design life of our facilities and improve the economics of new construction.',
    highlights: [
      'Next-generation zirconium alloys with higher burnup capability',
      'Advanced concrete formulations for accelerated construction',
      'Materials testing programs for 80-year design lives',
    ],
    image: images.lab,
  },
  {
    icon: ShieldCheck,
    title: 'Cybersecurity',
    description:
      'In an increasingly connected world, cybersecurity is integral to nuclear safety. Our cyber defense program combines layered network security, real-time threat intelligence, and continuous testing to protect critical plant systems from evolving threats.',
    highlights: [
      'Defense-in-depth network architecture',
      'Continuous penetration testing and red team exercises',
      'Active threat intelligence and information sharing partnerships',
    ],
    image: images.safety,
  },
  {
    icon: Factory,
    title: 'Advanced Manufacturing',
    description:
      'We are reimagining how nuclear plants are built. Advanced manufacturing techniques — including modular construction, 3D printing of complex components, and robotic welding — are reducing construction costs, improving quality, and dramatically shortening project timelines.',
    highlights: [
      'Factory-fabricated modules reducing on-site work by 60%',
      'Qualified 3D-printed components in nuclear service',
      'Digital work packages enabling fully paperless construction',
    ],
    image: images.engineers,
  },
]

export default async function InnovationPage() {
  return (
    <>
      <PageHeader
        eyebrow="Innovation"
        title="Pioneering the Future of Energy"
        description={
          <>
            For 50 years, we have pushed the boundaries of what nuclear technology can achieve.
            Today, our innovation programs are building the reactors, systems, and manufacturing
            techniques that will power the next century of clean energy.
          </>
        }
        image={images.lab}
      >
        <div className="mt-8 flex flex-wrap gap-4">
          <Button href="/innovation/research" variant="primary">
            Explore Our Research
          </Button>
          <Button href="/nuclear-energy/technology" variant="outline">
            Reactor Technology
          </Button>
        </div>
      </PageHeader>

      {/* Innovation Areas */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            title="Innovation Focus Areas"
            subtitle="Six strategic areas where we are investing to advance the future of nuclear energy."
            centered
          />
          <div className="mt-16 space-y-8">
            {innovationAreas.map((area, i) => (
              <Reveal key={area.title} delay={(i % 3) * 0.08}>
                <div
                  className="grid gap-8 lg:grid-cols-5 rounded-2xl border border-slate-200 bg-white p-8 md:p-10 shadow-sm transition-all hover:shadow-md hover:border-cyan-200"
                >
                  <div className="lg:col-span-2">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-500/10">
                      <area.icon className="h-7 w-7 text-cyan-500" />
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="text-sm font-bold text-cyan-500">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-navy-900 tracking-tight">
                      {area.title}
                    </h2>
                    <div className="group mt-6 overflow-hidden rounded-2xl">
                      <CardImage
                        src={area.image}
                        alt={area.title}
                        className="aspect-[16/10]"
                        sizes="(max-width: 768px) 100vw, 40vw"
                      />
                    </div>
                  </div>
                  <div className="lg:col-span-3">
                    <p className="text-slate-600 leading-relaxed">{area.description}</p>
                    <div className="mt-6 rounded-xl bg-slate-50 p-6">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Program Highlights
                      </p>
                      <ul className="mt-3 space-y-2">
                        {area.highlights.map((h) => (
                          <li key={h} className="flex items-start gap-2 text-sm text-slate-700">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="bg-navy-900 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <SectionHeading
            title="Our Innovation Approach"
            subtitle="Our innovation approach combines disciplined engineering, deep scientific research, and strategic partnerships to turn bold ideas into reliable, deployable technology."
            centered
            light
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {[
              { step: '01', title: 'Discover', description: 'Fundamental research and early-stage concept exploration.' },
              { step: '02', title: 'Develop', description: 'Prototyping, simulation, and rigorous testing.' },
              { step: '03', title: 'Demonstrate', description: 'Pilot deployments and full-scale validation.' },
              { step: '04', title: 'Deploy', description: 'Commercial scaling with quality and safety assurance.' },
            ].map((s, i) => (
              <Reveal key={s.step} delay={i * 0.08}>
                <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-left">
                  <p className="text-cyan-400 font-bold">{s.step}</p>
                  <h3 className="mt-2 text-lg font-bold text-white">{s.title}</h3>
                  <p className="mt-2 text-sm text-navy-100/90">{s.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-12">
            <Reveal>
              <Button href="/innovation/research" variant="primary">
                Explore Research & Facilities
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}