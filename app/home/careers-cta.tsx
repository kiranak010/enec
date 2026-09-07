import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import Reveal from '@/components/ui/reveal'
import { images } from '@/lib/images'

export function CareersCTA() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={images.team}
          alt="ENEC engineering team collaborating"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/95 via-cyan-800/85 to-cyan-900/95" />
      </div>

      <div className="container-narrow section-padding relative z-10 text-center text-white">
        <Reveal>
          <h2 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
            Build the Energy Systems of Tomorrow
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-cyan-100">
            Join our team of world-class engineers, scientists, and professionals
            working to power the world sustainably.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mx-auto mb-12 grid max-w-3xl grid-cols-1 gap-8 sm:grid-cols-3">
            <div>
              <div className="text-3xl font-bold">12,000+</div>
              <div className="mt-1 text-sm text-cyan-100">Professionals</div>
            </div>
            <div>
              <div className="text-3xl font-bold">30+</div>
              <div className="mt-1 text-sm text-cyan-100">Countries</div>
            </div>
            <div>
              <div className="text-3xl font-bold">500+</div>
              <div className="mt-1 text-sm text-cyan-100">Open Positions</div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/careers/jobs"
              className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-sm font-semibold uppercase tracking-wider text-cyan-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-xl hover:shadow-black/10"
            >
              Explore Careers
            </Link>
            <Link
              href="/careers"
              className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:text-cyan-100"
            >
              Join Our Graduate Program
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
