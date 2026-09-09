import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, MapPin } from 'lucide-react'
import Reveal from '@/components/ui/reveal'
import { images } from '@/lib/images'

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
            <p className="mb-16 text-lg leading-relaxed text-slate-300">
              With operations spanning six continents, we bring clean nuclear energy
              to communities worldwide while investing in local talent and infrastructure.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="relative mx-auto mb-16 max-w-4xl overflow-hidden rounded-2xl border border-white/10">
            <Image
              src={images.earth}
              alt="World map highlighting ENEC operations across six continents"
              fill
              sizes="(max-width: 896px) 100vw, 896px"
              className="object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-900/40 to-navy-900/60" />
            <div className="relative grid grid-cols-1 gap-4 p-8 sm:grid-cols-3 sm:p-10">
              {hubs.map((hub) => (
                <div
                  key={hub.city}
                  className="flex items-center gap-3 rounded-xl border border-white/15 bg-navy-950/70 p-4 backdrop-blur-sm transition-colors duration-300 hover:border-cyan-500/40"
                >
                  <MapPin className="h-5 w-5 shrink-0 text-cyan-400" />
                  <div>
                    <div className="text-sm font-semibold text-white">{hub.city}</div>
                    <div className="text-xs text-navy-100/80">{hub.sector}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">15</div>
              <div className="mt-1 text-sm text-slate-300">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">45+</div>
              <div className="mt-1 text-sm text-slate-300">Facilities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">6</div>
              <div className="mt-1 text-sm text-slate-300">Continents</div>
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
