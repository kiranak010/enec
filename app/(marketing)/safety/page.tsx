import PageHeader from '@/components/ui/page-header'
import Reveal from '@/components/ui/reveal'
import SectionHeading from '@/components/ui/section-heading'
import Button from '@/components/ui/button'
import {
  ArrowRight,
  Shield,
  ShieldCheck,
  Siren,
  Lock,
  Radiation,
  Users,
  FileCheck,
  Heart,
} from 'lucide-react'
import { images } from '@/lib/images'

const pillars = [
  {
    icon: Radiation,
    title: 'Nuclear Safety',
    description: 'Reactor and fuel safety engineered through defense-in-depth principles and redundant, diverse protective systems.',
  },
  {
    icon: ShieldCheck,
    title: 'Operational Safety',
    description: 'Rigorous procedures, human performance tools, and work management practices that prevent incidents in day-to-day operations.',
  },
  {
    icon: Siren,
    title: 'Emergency Preparedness',
    description: 'Continuous planning, training, and exercises from the site level to off-site response organizations, tested regularly.',
  },
  {
    icon: Lock,
    title: 'Security',
    description: 'Physical, cyber, and personnel security programs protecting facilities, assets, and information against evolving threats.',
  },
  {
    icon: Shield,
    title: 'Radiation Protection',
    description: 'Comprehensive monitoring and dose control programs ensuring radiation exposure stays well below regulatory limits.',
  },
  {
    icon: Users,
    title: 'Safety Culture',
    description: 'An organizational culture where safety is the senior priority, and every employee is empowered to speak up.',
  },
  {
    icon: FileCheck,
    title: 'Regulatory Compliance',
    description: 'Full adherence to national and international regulatory requirements, verified through continuous oversight and audit.',
  },
]

const performanceAreas = [
  {
    metric: 'Fleet Capacity Factor',
    value: '93%+',
    note: 'Reflecting reliable, stable operations',
  },
  {
    metric: 'Regulatory Findings',
    value: 'Minimal',
    note: 'Consistently strong inspection results',
  },
  {
    metric: 'Dose Exposure',
    value: 'Well below limits',
    note: 'ALARA practices at all sites',
  },
  {
    metric: 'Security Events',
    value: 'None',
    note: 'No significant security events recorded',
  },
]

export default async function SafetyCenterPage() {
  return (
    <>
      <PageHeader
        title="Safety is Our Highest Priority"
        description={
          <>
            Everything we do — from plant design and construction to daily operations and
            decommissioning — is governed by an uncompromising commitment to safety.
          </>
        }
        image={images.safety}
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10">
          <Shield className="h-8 w-8 text-cyan-400" />
        </div>
      </PageHeader>

      {/* Safety Pillars */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            title="Seven Safety Pillars"
            subtitle="Our comprehensive safety framework organizes protection across seven integrated domains."
            centered
          />
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.06}>
                <div
                  className="h-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-md hover:border-cyan-200"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10">
                    <p.icon className="h-6 w-6 text-cyan-500" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-navy-900">{p.title}</h3>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">{p.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Performance */}
      <section className="bg-slate-50 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            title="Safety Performance Overview"
            subtitle="We continuously monitor and report our safety performance. The following figures reflect our operational results and are subject to ongoing regulatory oversight."
            centered
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {performanceAreas.map((a, i) => (
              <Reveal key={a.metric} delay={i * 0.08}>
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                  <p className="text-3xl font-bold text-cyan-500">{a.value}</p>
                  <p className="mt-2 font-bold text-navy-900">{a.metric}</p>
                  <p className="mt-1 text-xs text-slate-500">{a.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Culture */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-5 items-start">
            <div className="lg:col-span-2">
              <SectionHeading
                title="Our Safety Culture"
                subtitle="Our safety culture is built on a set of shared values that every employee — from the boardroom to the control room — lives every day."
              />
            </div>
            <div className="lg:col-span-3">
              <div className="space-y-4">
                {[
                  {
                    title: 'It Starts with Leadership',
                    description:
                      'Our executives and managers demonstrate safety leadership in every decision and action, setting the tone for the entire organization.',
                  },
                  {
                    title: 'Everyone is Empowered',
                    description:
                      'Every employee has the authority and the obligation to stop work when they see an unsafe condition. Speaking up is celebrated, not penalized.',
                  },
                  {
                    title: 'We Learn from Experience',
                    description:
                      'We systematically capture, analyze, and share lessons from our own operations and the broader industry to prevent recurrence of any event.',
                  },
                  {
                    title: 'Continuous Self-Assessment',
                    description:
                      'Every facility conducts regular self-assessments and international peer reviews to identify improvement opportunities proactively.',
                  },
                ].map((v, i) => (
                  <Reveal key={v.title} delay={i * 0.08}>
                    <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10">
                        <Heart className="h-5 w-5 text-cyan-500" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-cyan-500">PRINCIPLE {i + 1}</span>
                        <h3 className="mt-1 font-bold text-navy-900">{v.title}</h3>
                        <p className="mt-1 text-sm text-slate-600 leading-relaxed">{v.description}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-900 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Explore Safety in Technical Depth
            </h2>
            <p className="mt-2 text-navy-100/70 max-w-xl">
              Learn about defense in depth, multi-barrier containment, and our regulatory framework.
            </p>
          </Reveal>
          <div className="flex flex-wrap gap-4 shrink-0">
            <Button href="/nuclear-energy/safety" variant="primary">
              Nuclear Safety Details
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/sustainability/community" variant="outline">
              Community Programs
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}