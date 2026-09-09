import { prisma } from '@/lib/prisma'
import PageHeader from '@/components/ui/page-header'
import Reveal from '@/components/ui/reveal'
import SectionHeading from '@/components/ui/section-heading'
import Button from '@/components/ui/button'
import { ArrowLeft, Linkedin } from 'lucide-react'
import { images } from '@/lib/images'

const staticLeaders = [
  {
    name: 'Dr. Eleanor Vasquez',
    title: 'Chief Executive Officer',
    bio: 'Dr. Vasquez has led ENEC since 2018, spearheading the company\'s transition to advanced reactor technologies and global expansion. She holds a Ph.D. in Nuclear Engineering from MIT and has over 25 years of experience in energy policy and nuclear technology development. Under her leadership, ENEC has grown its installed capacity by 40%.',
    responsibilities: 'Corporate strategy, stakeholder relations, and board governance.',
  },
  {
    name: 'James Chen',
    title: 'Chief Technology Officer',
    bio: 'James leads ENEC\'s technology division, overseeing the development of next-generation reactor designs, digital twin programs, and advanced safety systems. He has published over 40 peer-reviewed papers and holds 12 patents in nuclear instrumentation and control systems.',
    responsibilities: 'Technology strategy, R&D programs, and innovation initiatives.',
  },
  {
    name: 'Sarah Mitchell',
    title: 'Chief Financial Officer',
    bio: 'Sarah has driven ENEC\'s financial strategy through three major growth phases, securing over $15 billion in capital for new-build projects. She holds an MBA from Wharton and previously served as CFO of a Fortune 500 energy company, bringing deep expertise in project finance and risk management.',
    responsibilities: 'Financial planning, capital allocation, and investor relations.',
  },
  {
    name: 'Dr. Robert Okonkwo',
    title: 'Chief Operating Officer',
    bio: 'Dr. Okonkwo oversees day-to-day operations across ENEC\'s global fleet. His focus on operational excellence has been instrumental in achieving industry-leading capacity factors. He holds a doctorate in Nuclear Engineering from Georgia Tech and has managed nuclear operations on three continents.',
    responsibilities: 'Fleet operations, performance optimization, and supply chain.',
  },
  {
    name: 'Dr. Maria Santos',
    title: 'Vice President, Safety & Regulatory Affairs',
    bio: 'Dr. Santos leads our comprehensive safety program and regulatory compliance efforts. With a background in health physics and nuclear regulation, she ensures ENEC meets and exceeds all safety standards across every jurisdiction in which we operate.',
    responsibilities: 'Nuclear safety, radiation protection, and regulatory compliance.',
  },
  {
    name: 'David Park',
    title: 'Vice President, Engineering',
    bio: 'David leads the engineering teams responsible for reactor design, construction oversight, and lifecycle management. His expertise spans both traditional large-scale reactors and emerging small modular reactor technologies.',
    responsibilities: 'Reactor engineering, construction management, and design optimization.',
  },
]

export default async function LeadershipPage() {
  let leaders = staticLeaders
  try {
    const dbLeaders = await prisma.leadershipProfile.findMany({
      where: { published: true },
      orderBy: { sortOrder: 'asc' },
    })
    if (dbLeaders.length > 0) {
      leaders = dbLeaders.map((l) => ({
        name: l.name,
        title: l.title,
        bio: l.biography,
        responsibilities: l.responsibilities ?? '',
        linkedinUrl: l.linkedinUrl ?? undefined,
      }))
    }
  } catch {
    // Use static fallback
  }

  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title="Leadership"
        description={
          <>
            Our leadership team combines deep technical expertise with strategic vision to guide
            ENEC&apos;s mission of delivering safe, clean energy at scale.
          </>
        }
        image={images.team}
      >
        <Button href="/about" variant="ghost" className="mt-8">
          <ArrowLeft className="h-4 w-4" /> Back to About
        </Button>
      </PageHeader>

      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            title="Executive Team"
            subtitle="Meet the individuals leading ENEC into the future."
            centered
          />
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {leaders.map((leader, i) => (
              <Reveal key={leader.name} delay={i * 0.08}>
                <div className="group h-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-md hover:border-cyan-200">
                <h3 className="text-center text-xl font-bold text-navy-900">{leader.name}</h3>
                <p className="mt-1 text-center text-sm font-semibold text-cyan-500">{leader.title}</p>
                <p className="mt-4 text-sm text-slate-600 leading-relaxed">{leader.bio}</p>
                {leader.responsibilities && (
                  <div className="mt-4 rounded-lg bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Key Responsibilities
                    </p>
                    <p className="mt-1 text-sm text-slate-700">{leader.responsibilities}</p>
                  </div>
                )}
                {'linkedinUrl' in leader && (leader as { linkedinUrl?: string }).linkedinUrl && (
                  <a
                    href={(leader as { linkedinUrl: string }).linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm text-cyan-500 hover:text-cyan-600"
                  >
                    <Linkedin className="h-4 w-4" /> Connect
                  </a>
                )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-bold text-navy-900 tracking-tight">
              Interested in Joining Our Team?
            </h2>
            <p className="mt-4 text-slate-600 max-w-xl mx-auto">
              We are always looking for exceptional talent to help us build the future of energy.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button href="/careers" variant="primary">
                View Open Positions
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
