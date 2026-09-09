import type { Metadata } from 'next'
import { ArrowLeft } from 'lucide-react'
import PageHeader from '@/components/ui/page-header'
import Reveal from '@/components/ui/reveal'
import Button from '@/components/ui/button'
import TeamDirectory from './team-directory'
import { images } from '@/lib/images'

export const metadata: Metadata = {
  title: 'Global Authorities & Teams',
  description:
    'Meet the nuclear regulatory authorities and technical teams that govern and support safe nuclear operations across the world, including ENEC teams in India.',
}

export default function TeamsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our Network"
        title="Global Authorities & Teams"
        description={
          <>
            From the regulators who uphold our safety standards to the specialized teams who
            appraise, test and review every system, meet the people safeguarding nuclear
            operations around the world.
          </>
        }
        image={images.team}
      >
        <Button href="/about" variant="ghost" className="mt-8">
          <ArrowLeft className="h-4 w-4" /> Back to About
        </Button>
      </PageHeader>

      <section className="py-24 md:py-32">
        <TeamDirectory />
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-bold text-navy-900 tracking-tight">
              Transparent Operations, Worldwide
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-600">
              Every ENEC facility is reviewed by its national authority, and we make
              the results publicly available.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  )
}