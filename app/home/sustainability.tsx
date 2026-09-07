import Link from 'next/link'
import Image from 'next/image'
import { TreePine, Droplets, Users, ArrowRight } from 'lucide-react'
import Reveal from '@/components/ui/reveal'
import { images } from '@/lib/images'

const pillars = [
  {
    icon: TreePine,
    title: 'Climate Action',
    description:
      'Our nuclear fleet prevents over 92 million tonnes of CO₂ emissions annually — equivalent to removing 20 million cars from the road.',
  },
  {
    icon: Droplets,
    title: 'Environmental Stewardship',
    description:
      'We protect local ecosystems through rigorous water management, habitat conservation, and progressive waste reduction programmes.',
  },
  {
    icon: Users,
    title: 'Community Impact',
    description:
      'We invest in local economies, education, and infrastructure — creating lasting value for the communities where we operate.',
  },
]

export function Sustainability() {
  return (
    <section className="relative overflow-hidden">
      <div className="container-narrow section-padding">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <Reveal direction="right" className="order-2 lg:order-1">
            <div className="group relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-emerald-500/20 via-transparent to-cyan-500/20 opacity-0 blur-xl transition-opacity duration-700 group-hover:opacity-100" />
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
                <Image
                  src={images.nature}
                  alt="Aerial view of clean energy generation among natural landscapes"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <div className="absolute -bottom-6 left-6 right-6 rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-lg backdrop-blur-sm">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-navy-900">92M+</div>
                    <div className="mt-1 text-xs text-slate-500">Tonnes CO₂ Avoided</div>
                  </div>
                  <div className="border-x border-slate-200">
                    <div className="text-2xl font-bold text-navy-900">20M</div>
                    <div className="mt-1 text-xs text-slate-500">Cars Equivalent</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-emerald-600">2050</div>
                    <div className="mt-1 text-xs text-slate-500">Net Zero Target</div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="order-1 lg:order-2">
            <Reveal>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                Sustainability
              </p>
              <h2 className="mb-6 text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl">
                Committed to a Sustainable Future
              </h2>
              <p className="mb-12 text-lg leading-relaxed text-slate-600">
                Environmental stewardship is at the core of everything we do. From zero-emission
                power generation to community investment, we are building a legacy of sustainable impact
                for future generations.
              </p>
            </Reveal>

            <div className="space-y-6">
              {pillars.map((pillar, i) => {
                const Icon = pillar.icon
                return (
                  <Reveal key={pillar.title} delay={i * 0.12}>
                    <div className="group flex gap-5 rounded-2xl border border-slate-200 bg-white/80 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-transform duration-300 group-hover:scale-110">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="mb-2 text-lg font-bold text-navy-900">
                          {pillar.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-slate-600">
                          {pillar.description}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                )
              })}
            </div>

            <Reveal delay={0.3}>
              <Link
                href="/sustainability"
                className="group mt-10 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-emerald-600 transition-colors hover:text-emerald-500"
              >
                Explore Our Sustainability Commitments
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
