import PageHeader from '@/components/ui/page-header'
import Reveal from '@/components/ui/reveal'
import SectionHeading from '@/components/ui/section-heading'
import Button from '@/components/ui/button'
import { ArrowLeft, Shield, Scale, Users, BookOpen, CheckCircle2 } from 'lucide-react'
import { images } from '@/lib/images'

const committees = [
  {
    name: 'Audit Committee',
    icon: Scale,
    description:
      'Oversees financial reporting integrity, internal controls, and compliance with accounting standards. Reviews and recommends the appointment of external auditors and monitors the independence and performance of the audit function.',
    responsibilities: [
      'Review financial statements and disclosures',
      'Oversee internal audit function',
      'Assess internal controls and risk management',
      'Evaluate external auditor independence',
      'Monitor regulatory compliance',
    ],
  },
  {
    name: 'Safety Committee',
    icon: Shield,
    description:
      'Provides Board-level oversight of nuclear safety, operational safety performance, and safety culture across all facilities. Reviews significant safety events and ensures adequate resources are allocated to safety programs.',
    responsibilities: [
      'Review safety performance metrics and trends',
      'Oversee nuclear safety culture initiatives',
      'Monitor regulatory compliance and inspections',
      'Review significant safety events and corrective actions',
      'Assess emergency preparedness readiness',
    ],
  },
  {
    name: 'Technology Committee',
    icon: BookOpen,
    description:
      'Guides the Board on technology strategy, research and development priorities, and the adoption of advanced technologies including digital twins, AI applications, and next-generation reactor designs.',
    responsibilities: [
      'Review R&D strategy and investment priorities',
      'Assess technology risks and opportunities',
      'Oversee digital transformation initiatives',
      'Monitor advanced reactor development progress',
      'Evaluate technology partnerships and acquisitions',
    ],
  },
  {
    name: 'Ethics & Compliance Committee',
    icon: Users,
    description:
      'Ensures adherence to the highest standards of corporate ethics, legal compliance, and responsible business conduct across all operations. Oversees the company\'s code of conduct and whistleblower programs.',
    responsibilities: [
      'Oversee code of conduct and ethics programs',
      'Review compliance with anti-corruption regulations',
      'Monitor whistleblower and reporting mechanisms',
      'Assess corporate social responsibility initiatives',
      'Evaluate supply chain ethics and standards',
    ],
  },
]

const boardMembers = [
  { name: 'Margaret Liu', role: 'Chair of the Board', background: 'Former U.S. Deputy Secretary of Energy' },
  { name: 'Dr. William Hartley', role: 'Vice Chair', background: 'Retired Admiral, Nuclear Navy Program' },
  { name: 'Catherine Dubois', role: 'Independent Director', background: 'Former CEO, European Energy Association' },
  { name: 'Dr. Ahmed El-Sayed', role: 'Independent Director', background: 'Professor of Nuclear Policy, Georgetown University' },
  { name: 'Patricia Yamamoto', role: 'Independent Director', background: 'Former Commissioner, Nuclear Regulatory Commission' },
  { name: 'Dr. Eleanor Vasquez', role: 'CEO & Director', background: 'Emirates Nuclear Energy Corporation' },
  { name: 'Thomas Brennan', role: 'Independent Director', background: 'Former CFO, Major Infrastructure Fund' },
]

export default async function GovernancePage() {
  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title="Corporate Governance"
        description={
          <>
            Strong governance is the foundation of trust. Our Board and committee structure ensures
            accountability, transparency, and responsible stewardship across all operations.
          </>
        }
        image={images.mediaBriefing}
      >
        <Button href="/about" variant="ghost" className="mt-8">
          <ArrowLeft className="h-4 w-4" /> Back to About
        </Button>
      </PageHeader>

      {/* Governance Principles */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            title="Governance Principles"
            subtitle="Our governance framework is built on transparency, accountability, and the highest standards of corporate conduct."
            centered
          />
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Board Independence',
                description:
                  'A majority of our Board members are independent directors with no material relationship to the company, ensuring unbiased oversight.',
              },
              {
                title: 'Transparent Reporting',
                description:
                  'We publish comprehensive annual reports and comply with all disclosure requirements, providing shareholders and stakeholders with clear, accurate information.',
              },
              {
                title: 'Risk Oversight',
                description:
                  'Our Board maintains active oversight of enterprise risk management, including nuclear safety, cybersecurity, financial, and strategic risks.',
              },
              {
                title: 'Ethical Conduct',
                description:
                  'All employees, officers, and directors are bound by a rigorous Code of Conduct that governs business practices, conflicts of interest, and professional integrity.',
              },
              {
                title: 'Stakeholder Engagement',
                description:
                  'We maintain open dialogue with regulators, investors, communities, and other stakeholders to ensure our operations reflect their interests and concerns.',
              },
              {
                title: 'Continuous Improvement',
                description:
                  'Our governance practices are regularly reviewed and updated to reflect evolving best practices, regulatory requirements, and stakeholder expectations.',
              },
            ].map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div
                  className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
                >
                  <CheckCircle2 className="h-6 w-6 text-cyan-500" />
                  <h3 className="mt-4 text-lg font-bold text-navy-900">{p.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{p.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Board of Directors */}
      <section className="bg-slate-50 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            title="Board of Directors"
            subtitle="Our Board provides strategic guidance and independent oversight of the company's operations and governance."
            centered
          />
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {boardMembers.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.08}>
                <div
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-navy-900 text-xl font-bold text-white">
                    {m.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-navy-900">{m.name}</h3>
                  <p className="text-sm font-semibold text-cyan-500">{m.role}</p>
                  <p className="mt-2 text-sm text-slate-600">{m.background}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Committees */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            title="Board Committees"
            subtitle="Specialized committees provide focused oversight on critical areas of governance."
            centered
          />
          <div className="mt-16 space-y-8">
            {committees.map((c, i) => (
              <Reveal key={c.name} delay={i * 0.08}>
                <div
                  className="rounded-2xl border border-slate-200 bg-white p-8 md:p-10 shadow-sm"
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10">
                      <c.icon className="h-7 w-7 text-cyan-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-navy-900">{c.name}</h3>
                      <p className="mt-3 text-slate-600 leading-relaxed">{c.description}</p>
                      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                        {c.responsibilities.map((r) => (
                          <li key={r} className="flex items-start gap-2 text-sm text-slate-700">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-500" />
                            {r}
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
    </>
  )
}
