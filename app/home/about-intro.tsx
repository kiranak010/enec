import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import Reveal from '@/components/ui/reveal'
import { images } from '@/lib/images'

export function AboutIntro() {
  return (
    <section className="section-padding overflow-hidden bg-white">
      <div className="container-narrow">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <Reveal>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-500">
              About Us
            </p>
            <h2 className="line-accent mb-8 text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl">
              Shaping the Future of Energy
            </h2>
            <p className="mb-6 text-lg leading-relaxed text-slate-600">
              For over five decades, Emirates Nuclear Energy Corporation has been at the forefront
              of the global energy transition. We design, build, and operate advanced nuclear
              power plants that deliver clean, reliable electricity to millions of people
              across five continents.
            </p>
            <p className="mb-10 text-lg leading-relaxed text-slate-600">
              Our mission is to accelerate the world&apos;s transition to sustainable energy
              by making nuclear power safer, more efficient, and more accessible than ever before.
            </p>
            <Link
              href="/about"
              className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-cyan-600 transition-colors hover:text-cyan-500"
            >
              Discover Who We Are
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>

          <Reveal delay={0.2} direction="right">
            <div className="group relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-cyan-500/20 via-transparent to-amber-500/20 opacity-0 blur-xl transition-opacity duration-700 group-hover:opacity-100" />
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
                <Image
                  src={images.reactors}
                  alt="ENEC advanced reactor facility"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-4 p-8">
                  <div>
                    <span className="text-5xl font-bold text-white">1974</span>
                    <div className="mt-2 inline-flex items-center rounded-full bg-cyan-500/25 px-4 py-1.5 backdrop-blur-sm">
                      <span className="text-sm font-semibold uppercase tracking-wider text-cyan-300">
                        50+ Years of Excellence
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}