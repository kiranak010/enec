'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'

const areas = [
  {
    title: 'Advanced Reactors',
    description:
      'Next-generation reactor designs including small modular reactors, molten salt reactors, and Generation IV concepts.',
  },
  {
    title: 'Digital Transformation',
    description:
      'AI-powered operations, digital twins for real-time simulation, and predictive analytics for maintenance optimisation.',
  },
  {
    title: 'Robotics',
    description:
      'Automated inspection, maintenance, and decommissioning systems operating in extreme radiation environments.',
  },
  {
    title: 'Materials Science',
    description:
      'Advanced alloys, ceramics, and composites engineered for extreme temperatures, pressures, and radiation fields.',
  },
]

export function Innovation() {
  return (
    <section className="section-padding gradient-navy text-white">
      <div className="container-narrow">
        <div className="mb-16 max-w-2xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Innovation
          </p>
          <h2 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
            Pioneering the Future of Energy
          </h2>
          <p className="text-lg leading-relaxed text-slate-400">
            Our research and development programmes push the boundaries of nuclear science
            and clean energy technology.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {areas.map((area, i) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }}
              className="group rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/30 hover:bg-white/10"
            >
              <div className="mb-4 text-5xl font-bold text-cyan-500/20">
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="mb-4 text-xl font-bold text-white">
                {area.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-400">
                {area.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-16">
          <Link
            href="/innovation"
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-cyan-400 transition-colors hover:text-cyan-300"
          >
            Explore Our Innovation
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
