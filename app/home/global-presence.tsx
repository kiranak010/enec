import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, MapPin } from 'lucide-react'
import Reveal from '@/components/ui/reveal'
import { images } from '@/lib/images'

const dotGrid = Array.from({ length: 120 }, (_, i) => ({
  id: i,
  active: [5, 12, 18, 22, 27, 35, 41, 48, 55, 62, 70, 78, 85, 92, 100, 108, 115].includes(i),
}))

const hubs = [
  { city: 'Houston, TX', sector: 'Headquarters & Americas' },
  { city: 'London, UK', sector: 'Europe & Middle East' },
  { city: 'Tokyo, JP', sector: 'Asia-Pacific' },
]

export function GlobalPresence() {
  return (
    <section className="gradient-navy section-padding overflow-hidden text-white">
      <div className="container-narrow relative z-10">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Global Reach
            </p>
            <h2 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
              Global Impact, Local Commitment
            </h2>
            <p className="mb-16 text-lg leading-relaxed text-slate-400">
              With operations spanning six continents, we bring clean nuclear energy
              to communities worldwide while investing in local talent and infrastructure.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="relative mx-auto mb-16 max-w-4xl overflow-hidden rounded-2xl border border-white/10">
            <div className="absolute inset-0 bg-navy-900" />
            <Image
              src={images.earth}
              alt="World map highlighting ENEC operations across six continents"
              fill
              sizes="(max-width: 896px) 100vw, 896px"
              className="object-cover opacity-40"
            />
            <div className="relative grid grid-cols-12 gap-1.5 p-8 backdrop-blur-sm sm:gap-2">
              {dotGrid.map((dot, i) => (
                <div
                  key={dot.id}
                  className={`aspect-square rounded-sm transition-all duration-500 ${
                    dot.active
                      ? 'bg-cyan-400 shadow-sm shadow-cyan-500/40'
                      : 'bg-white/10'
                  }`}
                  style={{ transitionDelay: `${i * 2}ms` }}
                />
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mx-auto mb-14 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
            {hubs.map((hub) => (
              <div
                key={hub.city}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-colors duration-300 hover:border-cyan-500/30"
              >
                <MapPin className="h-5 w-5 shrink-0 text-cyan-400" />
                <div>
                  <div className="text-sm font-semibold text-white">{hub.city}</div>
                  <div className="text-xs text-slate-400">{hub.sector}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">15</div>
              <div className="mt-1 text-sm text-slate-400">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">45+</div>
              <div className="mt-1 text-sm text-slate-400">Facilities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">6</div>
              <div className="mt-1 text-sm text-slate-400">Continents</div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-16 text-center">
            <Link
              href="/about#global"
              className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-cyan-400 transition-colors hover:text-cyan-300"
            >
              Explore Our Global Network
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
