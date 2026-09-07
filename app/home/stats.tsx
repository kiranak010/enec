import { StatCounter } from '@/components/ui/stat-counter'
import Reveal from '@/components/ui/reveal'
import { prisma } from '@/lib/prisma'

interface StatItem {
  label: string
  value: number
  suffix: string
  decimals?: number
}

const fallbackStats: StatItem[] = [
  { label: 'Clean Energy Capacity', value: 24.8, suffix: 'GW', decimals: 1 },
  { label: 'Annual Electricity Generation', value: 185, suffix: 'TWh' },
  { label: 'Homes Powered', value: 55, suffix: 'Million' },
  { label: 'CO₂ Emissions Avoided Annually', value: 92, suffix: 'Million Tonnes' },
  { label: 'Years of Operational Excellence', value: 45, suffix: '+' },
  { label: 'Skilled Professionals', value: 12000, suffix: '+' },
  { label: 'Countries & Regions Served', value: 15, suffix: '' },
]

export async function Stats() {
  let stats = fallbackStats

  try {
    const metrics = await prisma.sustainabilityMetric.findMany({
      where: { published: true },
      orderBy: { sortOrder: 'asc' },
    })

    if (metrics.length > 0) {
      stats = metrics.map((m) => ({
        label: m.label,
        value: m.value,
        suffix: m.suffix ?? '',
        decimals: m.value % 1 !== 0 ? 1 : 0,
      }))
    }
  } catch {
    // Database not seeded yet — use fallback
  }

  return (
    <section className="gradient-navy section-padding">
      <div className="container-narrow">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.1}>
              <div className="group rounded-2xl bg-white/5 px-6 py-10 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-xl hover:shadow-cyan-500/5">
                <div className="mb-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  <StatCounter
                    end={stat.value}
                    suffix={stat.suffix}
                    decimals={stat.decimals}
                  />
                </div>
                <p className="text-sm leading-relaxed text-slate-400 transition-colors group-hover:text-slate-300">
                  {stat.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
