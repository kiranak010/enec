import type { Metadata } from 'next'
import {
  ArrowLeft,
  Award,
  Building2,
  ClipboardCheck,
  Cog,
  FileSearch,
  FlaskConical,
  Gauge,
  Globe,
  Landmark,
  Microscope,
  ShieldCheck,
  UserCog,
} from 'lucide-react'
import PageHeader from '@/components/ui/page-header'
import Reveal from '@/components/ui/reveal'
import CardImage from '@/components/ui/card-image'
import SectionHeading from '@/components/ui/section-heading'
import Button from '@/components/ui/button'
import { images, portraits } from '@/lib/images'

export const metadata: Metadata = {
  title: 'Global Authorities & Teams',
  description:
    'Meet the nuclear regulatory authorities and technical teams that govern and support safe nuclear operations across the world, including ENEC teams in India.',
}

const authorities = [
  {
    country: 'United Arab Emirates',
    authority: 'Federal Authority for Nuclear Regulation (FANR)',
    head: 'H.E. Mohamed Al Hammadi',
    title: 'Director General',
  },
  {
    country: 'United States',
    authority: 'U.S. Nuclear Regulatory Commission (NRC)',
    head: 'Christopher T. Hanson',
    title: 'Chair',
  },
  {
    country: 'United Kingdom',
    authority: 'Office for Nuclear Regulation (ONR)',
    head: 'Mark Foy',
    title: 'Chief Executive',
  },
  {
    country: 'France',
    authority: 'Autorité de Sûreté Nucléaire (ASN)',
    head: 'Bernard Doroszczuk',
    title: 'President',
  },
  {
    country: 'Canada',
    authority: 'Canadian Nuclear Safety Commission (CNSC)',
    head: 'Rumina Velshi',
    title: 'President & CEO',
  },
  {
    country: 'China',
    authority: 'National Nuclear Safety Administration (NNSA)',
    head: 'Zhang Kejian',
    title: 'Minister',
  },
  {
    country: 'Japan',
    authority: 'Nuclear Regulation Authority (NRA)',
    head: 'Shinsuke Yamanaka',
    title: 'Chairman',
  },
  {
    country: 'South Korea',
    authority: 'Nuclear Safety and Security Commission (NSSC)',
    head: 'Lee Eun-cheol',
    title: 'Chair',
  },
  {
    country: 'Russia',
    authority: 'Rostechnadzor',
    head: 'Alexander Trembitsky',
    title: 'Head',
  },
  {
    country: 'India',
    authority: 'Atomic Energy Regulatory Board (AERB)',
    head: 'G. Nageswara Rao',
    title: 'Chairman',
  },
]

const indiaTeams: {
  group: string
  icon: typeof Globe
  members: { name: string; role: string; portrait: string }[]
}[] = [
  {
    group: 'Board of Directors',
    icon: Landmark,
    members: [
      { name: 'Dr. Anand Krishnan', role: 'Director, Regulatory Operations', portrait: portraits.man1 },
      { name: 'Meera Deshpande', role: 'Director, Safety Assessment', portrait: portraits.woman1 },
      { name: 'Rajesh Iyer', role: 'Director, Technical Compliance', portrait: portraits.man2 },
    ],
  },
  {
    group: 'Appraisal & Assessment Division',
    icon: ClipboardCheck,
    members: [
      { name: 'Neha Sharma', role: 'Principal Appraiser, Plant Design', portrait: portraits.woman2 },
      { name: 'Vikram Nair', role: 'Appraiser, Siting & Environment', portrait: portraits.man1 },
      { name: 'Arjun Menon', role: 'Appraiser, Quality & Reliability', portrait: portraits.man3 },
    ],
  },
  {
    group: 'Testing & Evaluation Division',
    icon: Cog,
    members: [
      { name: 'Priya Raman', role: 'Lead Test Engineer, Reactor Systems', portrait: portraits.woman1 },
      { name: 'Sanjay Kulkarni', role: 'Test Engineer, Instrumentation & Control', portrait: portraits.man2 },
      { name: 'Divya Pillai', role: 'Test Engineer, Radiation Protection', portrait: portraits.woman3 },
    ],
  },
  {
    group: 'Advisory & Review Division',
    icon: ShieldCheck,
    members: [
      { name: 'Dr. Suresh Patil', role: 'Senior Reviewer, Operational Safety', portrait: portraits.man3 },
      { name: 'Anita Verghese', role: 'Evaluation Officer, Emergency Preparedness', portrait: portraits.woman2 },
      { name: 'Karthik Rao', role: 'Licensing Officer, New Builds', portrait: portraits.man1 },
    ],
  },
]

const badgeIcon: Record<string, typeof Globe> = {
  Director: UserCog,
  Appraiser: FileSearch,
  'Test Engineer': Gauge,
  Reviewer: Microscope,
  Evaluator: FlaskConical,
  Licensing: Award,
}

function iconForRole(role: string) {
  for (const key of Object.keys(badgeIcon)) {
    if (role.includes(key)) {
      return badgeIcon[key]
    }
  }
  return Building2
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
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            title="Country Nuclear Authorities"
            subtitle="The independent regulators that license, inspect and oversee every nuclear facility in their home nation."
            centered
          />
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {authorities.map((a, i) => (
              <Reveal key={a.country} delay={i * 0.05}>
                <div className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-cyan-200 hover:shadow-md">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-cyan-400">
                      <Globe className="h-5 w-5" />
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                      {i + 1 < 10 ? `0${i + 1}` : i + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-navy-900">{a.country}</h3>
                  <p className="mt-1 text-sm font-semibold text-cyan-600">{a.authority}</p>
                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <p className="text-sm font-bold text-navy-800">{a.head}</p>
                    <p className="text-xs text-slate-500">{a.title}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            title="Atomic Energy Regulatory Board — Team"
            subtitle="The AERB delegation works hand-in-hand with ENEC to appraise, test and review every design before, during and after commissioning."
            centered
          />
          <div className="mt-16 space-y-10">
            {indiaTeams.map((team, i) => {
              const GroupIcon = team.icon
              return (
                <Reveal key={team.group} delay={i * 0.05}>
                  <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-600 text-white">
                        <GroupIcon className="h-5 w-5" />
                      </span>
                      <h3 className="text-lg font-bold text-navy-900">{team.group}</h3>
                    </div>
                    <div className="mt-6 grid gap-5 md:grid-cols-3">
                      {team.members.map((m) => {
                        const Badge = iconForRole(m.role)
                        return (
                          <div
                            key={m.name}
                            className="rounded-xl border border-slate-200 bg-slate-50 p-5 transition-colors hover:border-cyan-200 hover:bg-white"
                          >
                            <CardImage
                              src={m.portrait}
                              alt={`Portrait of ${m.name}`}
                              className="h-16 w-16 rounded-full shadow"
                            />
                            <h4 className="mt-4 text-sm font-bold text-navy-900">{m.name}</h4>
                            <p className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-cyan-600">
                              <Badge className="h-3.5 w-3.5" />
                              {m.role}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
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