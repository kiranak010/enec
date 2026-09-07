import Link from 'next/link'
import { Building2, Atom, Handshake, ArrowRight } from 'lucide-react'
import Reveal from '@/components/ui/reveal'

const actions = [
  {
    icon: Building2,
    title: 'Explore Projects',
    description:
      'Discover our portfolio of nuclear power plants and advanced energy facilities across the globe.',
    href: '/projects',
  },
  {
    icon: Atom,
    title: 'Discover Our Technology',
    description:
      'Learn about cutting-edge reactor designs, safety systems, and clean energy innovations.',
    href: '/nuclear-energy',
  },
  {
    icon: Handshake,
    title: 'Partner With Us',
    description:
      'Join our global network of suppliers, contractors, and strategic partners.',
    href: '/suppliers',
  },
]

export function FinalCTA() {
  return (
    <section className="section-padding bg-slate-50">
      <div className="container-narrow">
        <div className="grid gap-6 md:grid-cols-3">
          {actions.map((action, i) => {
            const Icon = action.icon
            return (
              <Reveal key={action.title} delay={i * 0.12}>
                <Link
                  href={action.href}
                  className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-10 transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-300 hover:shadow-xl hover:shadow-cyan-500/5"
                >
                  <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-900 text-white transition-all duration-300 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:shadow-lg group-hover:shadow-cyan-500/30">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="mb-4 text-2xl font-bold text-navy-900 transition-colors group-hover:text-cyan-600">
                    {action.title}
                  </h3>
                  <p className="mb-8 flex-1 text-base leading-relaxed text-slate-500">
                    {action.description}
                  </p>
                  <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-cyan-600">
                    Get Started
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
