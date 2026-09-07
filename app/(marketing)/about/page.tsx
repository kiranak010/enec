import { prisma } from '@/lib/prisma'
import PageHeader from '@/components/ui/page-header'
import Reveal from '@/components/ui/reveal'
import SectionHeading from '@/components/ui/section-heading'
import Button from '@/components/ui/button'
import { Globe, Users, Zap, Shield, ArrowRight, Target, Eye } from 'lucide-react'
import { images } from '@/lib/images'

const staticLeaders = [
  {
    name: 'Dr. Eleanor Vasquez',
    title: 'Chief Executive Officer',
    bio: 'Dr. Vasquez brings over 25 years of experience in nuclear engineering and energy policy. She holds a Ph.D. in Nuclear Engineering from MIT and has led major initiatives in advanced reactor development.',
  },
  {
    name: 'James Chen',
    title: 'Chief Technology Officer',
    bio: 'James leads our technology division, overseeing research and development of next-generation reactor designs. He has published over 40 peer-reviewed papers on nuclear safety systems.',
  },
  {
    name: 'Sarah Mitchell',
    title: 'Chief Financial Officer',
    bio: 'Sarah has driven ENEC\'s financial strategy through three major growth phases. She holds an MBA from Wharton and previously served as CFO of a Fortune 500 energy company.',
  },
  {
    name: 'Dr. Robert Okonkwo',
    title: 'Chief Operating Officer',
    bio: 'Dr. Okonkwo oversees day-to-day operations across our global fleet. His expertise in operational excellence has been instrumental in achieving industry-leading capacity factors.',
  },
]

const milestones = [
  { year: 1974, title: 'Foundation', description: 'Emirates Nuclear Energy Corporation established with a mission to advance peaceful nuclear energy.' },
  { year: 1982, title: 'First Reactor', description: 'Commissioning of our first pressurized water reactor, marking entry into commercial nuclear generation.' },
  { year: 1995, title: 'International Expansion', description: 'Secured first international partnership, extending our operational footprint beyond domestic borders.' },
  { year: 2010, title: '10GW Milestone', description: 'Reached 10 gigawatts of installed nuclear capacity across our global fleet.' },
  { year: 2024, title: '25GW Milestone', description: 'Achieved 25 gigawatts of installed capacity, with advanced reactor programs underway.' },
]

export default async function AboutPage() {
  let leaders = staticLeaders
  try {
    const dbLeaders = await prisma.leadershipProfile.findMany({
      where: { published: true },
      orderBy: { sortOrder: 'asc' },
      take: 4,
    })
    if (dbLeaders.length > 0) {
      leaders = dbLeaders.map((l) => ({
        name: l.name,
        title: l.title,
        bio: l.biography,
      }))
    }
  } catch {
    // Use static fallback
  }

  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title="About ENEC"
        description={
          <>
            For five decades, we have been at the forefront of nuclear energy — delivering safe, reliable
            power that lights homes, fuels industries, and drives economic growth across the globe.
          </>
        }
        image={images.reactors}
      />

      {/* Mission & Vision */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2">
            <Reveal>
              <div className="rounded-2xl border border-slate-200 bg-white p-8 md:p-10 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10">
                  <Target className="h-6 w-6 text-cyan-500" />
                </div>
                <h2 className="mt-6 text-2xl font-bold text-navy-900">Our Mission</h2>
                <p className="mt-4 text-slate-600 leading-relaxed">
                  To deliver safe, reliable, and clean nuclear energy that powers communities and drives
                  economic prosperity for current and future generations.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-slate-200 bg-white p-8 md:p-10 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10">
                  <Eye className="h-6 w-6 text-cyan-500" />
                </div>
                <h2 className="mt-6 text-2xl font-bold text-navy-900">Our Vision</h2>
                <p className="mt-4 text-slate-600 leading-relaxed">
                  To be the world&apos;s most trusted partner in nuclear energy, setting the standard for
                  safety, innovation, and sustainability.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="bg-slate-50 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            title="Our Journey"
            subtitle="From a bold vision in 1974 to a global leader in clean energy."
            centered
          />
          <div className="mt-16 relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-cyan-200 md:left-1/2" />
            <div className="space-y-12">
              {milestones.map((m, i) => (
                <Reveal key={m.year} delay={i * 0.08}>
                  <div
                    className={`relative flex flex-col md:flex-row ${
                      i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    } items-start gap-6 md:gap-12`}
                  >
                    <div className={`md:w-1/2 ${i % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                      <span className="inline-block rounded-full bg-cyan-500 px-4 py-1 text-sm font-bold text-white shadow-md">
                        {m.year}
                      </span>
                      <h3 className="mt-4 text-xl font-bold text-navy-900">{m.title}</h3>
                      <p className="mt-2 text-slate-600 leading-relaxed">{m.description}</p>
                    </div>
                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 h-4 w-4 rounded-full border-2 border-cyan-500 bg-white shadow" />
                    <div className="md:w-1/2" />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <div className="mt-12 text-center">
            <Button href="/about/history" variant="ghost">
              View Full History <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            title="Leadership Team"
            subtitle="Experienced leaders driving our mission forward."
            centered
          />
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {leaders.map((leader, i) => (
              <Reveal key={leader.name} delay={i * 0.08}>
                <div className="group h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-cyan-200">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-navy-900 text-2xl font-bold text-white">
                    {leader.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-navy-900">{leader.name}</h3>
                  <p className="text-sm font-medium text-cyan-500">{leader.title}</p>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed line-clamp-3">{leader.bio}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button href="/about/leadership" variant="ghost">
              Meet the Full Team <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Global Presence */}
      <section className="bg-navy-900 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            title="Global Presence"
            subtitle="Operating across multiple continents with projects in key energy markets worldwide."
            centered
            light
          />
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Globe, stat: '12+', label: 'Countries' },
              { icon: Zap, stat: '25 GW', label: 'Installed Capacity' },
              { icon: Users, stat: '15,000+', label: 'Employees' },
              { icon: Shield, stat: '50+', label: 'Years of Operation' },
            ].map((item, i) => (
              <Reveal key={item.label} delay={i * 0.08}>
                <div className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-500/10">
                    <item.icon className="h-7 w-7 text-cyan-400" />
                  </div>
                  <p className="mt-4 text-3xl font-bold text-white">{item.stat}</p>
                  <p className="mt-1 text-sm text-navy-100/60">{item.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button href="/projects" variant="outline">
              View Our Projects <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
