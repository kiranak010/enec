import PageHeader from '@/components/ui/page-header'
import Reveal from '@/components/ui/reveal'
import SectionHeading from '@/components/ui/section-heading'
import Button from '@/components/ui/button'
import { ArrowLeft, Layers, Eye, FileCheck, Users, CheckCircle2 } from 'lucide-react'
import { images } from '@/lib/images'

const safetyPrinciples = [
  {
    icon: Layers,
    title: 'Defense in Depth',
    description:
      'Our safety philosophy is built on defense in depth — multiple independent and redundant layers of protection, each designed to prevent, detect, or mitigate failures. No single barrier is relied upon for safety; instead, overlapping systems ensure that the failure of any one layer does not compromise overall protection.',
    layers: [
      'Robust fuel design and quality control',
      'Reactor coolant pressure boundary',
      'Containment structure',
      'Emergency response and mitigation',
      'Off-site emergency planning',
    ],
  },
  {
    icon: Eye,
    title: 'ALARA Principle',
    description:
      'All radiation exposures are kept As Low As Reasonably Achievable (ALARA), consistent with proper functioning of the plant and in consideration of economic and social factors. This principle drives continuous improvement in radiation protection practices across our operations.',
    layers: [
      'Time, distance, and shielding controls',
      'Continuous radiation monitoring',
      'Work planning and exposure optimization',
      'Regular employee training and awareness',
      'Annual ALARA performance reviews',
    ],
  },
  {
    icon: Users,
    title: 'Safety Culture',
    description:
      'A strong safety culture is the foundation of nuclear safety. It encompasses the attitudes, behaviors, and organizational practices that ensure safety remains the overriding priority. We foster an environment where every individual feels empowered to raise safety concerns without fear of reprisal.',
    layers: [
      'Leadership commitment to safety',
      'Open communication and reporting',
      'Continuous learning and improvement',
      'Questioning attitude and peer checking',
      'Respectful and collaborative workplace',
    ],
  },
]

const barriers = [
  { layer: 'Fuel Matrix', description: 'Ceramic uranium dioxide pellets are designed to retain radioactive fission products within the fuel structure itself.' },
  { layer: 'Fuel Cladding', description: 'Zirconium alloy tubes enclose the fuel pellets, forming the first physical barrier against the release of radioactive material.' },
  { layer: 'Reactor Coolant System', description: 'The high-pressure reactor coolant boundary contains the radioactive coolant and prevents its release into the environment.' },
  { layer: 'Containment Building', description: 'A reinforced, pre-stressed concrete structure with steel liner designed to contain any release of radioactive material under accident conditions.' },
  { layer: 'Emergency Systems', description: 'Backup safety systems, including emergency core cooling and hydrogen management, provide additional protection during beyond-design-basis events.' },
]

const safetyMetrics = [
  { metric: 'Fleet Capacity Factor', value: '93%+', period: '2024' },
  { metric: 'Industrial Safety Rate', value: '< 0.5', period: 'incidents per 200,000 hours' },
  { metric: 'Security Events', value: 'Zero', period: 'significant events since founding' },
  { metric: 'Regulatory Compliance', value: '100%', period: 'of licensed operations in compliance' },
  { metric: 'Emergency Drills', value: 'Quarterly', period: 'full-scale exercises' },
  { metric: 'Safety Training', value: '80+', period: 'hours per employee annually' },
]

export default async function SafetyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Nuclear Energy"
        title="Nuclear Safety"
        description={
          <>
            Safety is the foundational value upon which every aspect of our operations is built. Our
            multi-layered approach to nuclear safety reflects decades of engineering excellence and
            an unwavering commitment to protecting people and the environment.
          </>
        }
        image={images.safety}
      >
        <Button href="/nuclear-energy" variant="ghost" className="mt-8">
          <ArrowLeft className="h-4 w-4" /> Back to Nuclear Energy
        </Button>
      </PageHeader>

      {/* Safety Principles */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            title="Safety Principles"
            subtitle="Three core principles guide every decision we make."
            centered
          />
          <div className="mt-16 space-y-8">
            {safetyPrinciples.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div
                  className="rounded-2xl border border-slate-200 bg-white p-8 md:p-10 shadow-sm"
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10">
                      <p.icon className="h-7 w-7 text-cyan-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-navy-900">{p.title}</h3>
                      <p className="mt-3 text-slate-600 leading-relaxed">{p.description}</p>
                      <ul className="mt-4 space-y-2">
                        {p.layers.map((l) => (
                          <li key={l} className="flex items-start gap-2 text-sm text-slate-700">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-500" />
                            {l}
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

      {/* Multi-Barrier Containment */}
      <section className="bg-slate-50 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            title="Multi-Barrier Containment"
            subtitle="Radioactive material is contained by multiple independent barriers, each designed to prevent its release to the environment."
            centered
          />
          <div className="mt-12 relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-cyan-200 hidden md:block" />
            <div className="space-y-6">
              {barriers.map((b, i) => (
                <Reveal key={b.layer} delay={i * 0.08}>
                  <div className="flex gap-6 items-start">
                    <div className="hidden md:flex relative z-10 shrink-0 h-16 w-16 items-center justify-center rounded-full border-4 border-cyan-500 bg-white shadow-md">
                      <span className="text-lg font-bold text-navy-900">{i + 1}</span>
                    </div>
                    <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                      <h3 className="text-lg font-bold text-navy-900">{b.layer}</h3>
                      <p className="mt-2 text-sm text-slate-600 leading-relaxed">{b.description}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Safety Performance */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            title="Safety Performance"
            subtitle="We track and report our safety performance across key indicators to drive continuous improvement."
            centered
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {safetyMetrics.map((m, i) => (
              <Reveal key={m.metric} delay={i * 0.08}>
                <div
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-center"
                >
                  <p className="text-3xl font-bold text-cyan-500">{m.value}</p>
                  <p className="mt-2 text-lg font-bold text-navy-900">{m.metric}</p>
                  <p className="mt-1 text-sm text-slate-500">{m.period}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Culture */}
      <section className="bg-navy-900 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <SectionHeading
            title="Our Safety Culture"
            subtitle="Our safety culture is built on the belief that every incident is preventable and every employee has the responsibility and authority to stop work if they observe an unsafe condition."
            centered
            light
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
            {[
              { title: 'Integrity', description: 'We are honest and transparent about safety performance.' },
              { title: 'Accountability', description: 'Every individual is accountable for safety outcomes.' },
              { title: 'Vigilance', description: 'We maintain a questioning attitude at all times.' },
              { title: 'Continuous Learning', description: 'We learn from experience and share knowledge openly.' },
            ].map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08}>
                <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                  <h3 className="text-lg font-bold text-white">{v.title}</h3>
                  <p className="mt-2 text-sm text-navy-100/70">{v.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Standards & Regulations */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            title="Standards & Regulations"
            subtitle="Our operations comply with international safety standards and are subject to rigorous regulatory oversight."
            centered
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'IAEA Safety Standards', description: 'We align with the International Atomic Energy Agency\'s safety standards and conduct regular peer reviews.' },
              { title: 'National Regulatory Bodies', description: 'Our plants are licensed and inspected by the relevant national nuclear regulatory authority in each jurisdiction.' },
              { title: 'ISO Standards', description: 'Our management systems are certified to ISO 9001 (Quality), ISO 14001 (Environment), and ISO 45001 (Occupational Health & Safety).' },
              { title: 'WANO Membership', description: 'We participate in the World Association of Nuclear Operators, benefiting from peer reviews and best-practice sharing.' },
              { title: 'INPO Evaluation', description: 'Our U.S. plants are subject to evaluation by the Institute of Nuclear Power Operations.' },
              { title: 'NPT Treaty Compliance', description: 'We fully comply with all nuclear non-proliferation obligations and safeguards agreements.' },
            ].map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <FileCheck className="h-5 w-5 text-cyan-500" />
                  <h3 className="mt-3 text-lg font-bold text-navy-900">{s.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{s.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
