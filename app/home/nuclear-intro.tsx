import Link from 'next/link'
import Image from 'next/image'
import { Zap, Leaf, Shield, ArrowRight } from 'lucide-react'
import Reveal from '@/components/ui/reveal'
import { images } from '@/lib/images'

const benefits = [
  {
    icon: Zap,
    title: 'Baseload Power',
    description:
      'Nuclear provides consistent, around-the-clock electricity generation regardless of weather conditions.',
  },
  {
    icon: Leaf,
    title: 'Clean Electricity',
    description:
      'Nuclear power plants produce zero direct carbon emissions during operation.',
  },
  {
    icon: Shield,
    title: 'Energy Security',
    description:
      'Nuclear energy reduces dependence on imported fossil fuels and strengthens national energy independence.',
  },
]

export function NuclearIntro() {
  return (
    <section className="relative overflow-hidden text-white">
      <div className="absolute inset-0">
        <Image
          src={images.controlRoom}
          alt="Nuclear control room operators"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-navy-hero" />
      </div>

      <div className="container-narrow section-padding relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Nuclear Energy
            </p>
            <h2 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
              Why Nuclear Energy Matters
            </h2>
            <p className="mb-16 text-lg leading-relaxed text-slate-300">
              Nuclear energy is the backbone of a carbon-free energy future. It is the
              most reliable, scalable, and efficient source of clean baseload power available today.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon
            return (
              <Reveal key={benefit.title} delay={i * 0.15}>
                <div className="group h-full rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:bg-white/10 hover:shadow-xl hover:shadow-cyan-500/10">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 transition-all duration-300 group-hover:scale-110 group-hover:bg-cyan-500/20">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-4 text-xl font-bold text-white">
                    {benefit.title}
                  </h3>
                  <p className="leading-relaxed text-slate-300">
                    {benefit.description}
                  </p>
                </div>
              </Reveal>
            )
          })}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-16 text-center">
            <Link
              href="/nuclear-energy"
              className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-cyan-400 transition-colors hover:text-cyan-300"
            >
              Learn More About Nuclear
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}