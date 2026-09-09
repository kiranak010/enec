'use client'

import { useRef, useState } from 'react'
import { ChevronDown, Globe, Users } from 'lucide-react'
import CardImage from '@/components/ui/card-image'
import SectionHeading from '@/components/ui/section-heading'
import { portraits } from '@/lib/images'
import { cn } from '@/lib/utils'

interface TeamMember {
  name: string
  role: string
  portrait: string
}

interface CountryAuthority {
  country: string
  authority: string
  head: string
  title: string
  team: TeamMember[]
}

const authorities: CountryAuthority[] = [
  {
    country: 'United Arab Emirates',
    authority: 'Federal Authority for Nuclear Regulation (FANR)',
    head: 'H.E. Mohamed Al Hammadi',
    title: 'Director General',
    team: [
      { name: 'H.E. Mohamed Al Hammadi', role: 'Director General', portrait: portraits.man1 },
      { name: 'Salem Al Kaabi', role: 'Deputy Director General', portrait: portraits.woman1 },
      { name: 'Fatima Al Mazrouei', role: 'Head of Licensing & Assessment', portrait: portraits.woman2 },
      { name: 'Omar Al Suwaidi', role: 'Head of Inspection & Enforcement', portrait: portraits.man2 },
      { name: 'Khalid Al Abdulla', role: 'Senior Nuclear Safety Inspector', portrait: portraits.man3 },
      { name: 'Aisha Al Shamsi', role: 'Nuclear Security Specialist', portrait: portraits.woman3 },
    ],
  },
  {
    country: 'United States',
    authority: 'U.S. Nuclear Regulatory Commission (NRC)',
    head: 'Christopher T. Hanson',
    title: 'Chair',
    team: [
      { name: 'Christopher T. Hanson', role: 'Chair', portrait: portraits.man1 },
      { name: 'Margaret Rowland', role: 'Executive Director for Operations', portrait: portraits.woman1 },
      { name: 'Daniel Reyes', role: 'Director, Office of Nuclear Reactor Regulation', portrait: portraits.man2 },
      { name: 'Nancy Takahashi', role: 'Director, Office of Nuclear Security', portrait: portraits.woman2 },
      { name: 'Robert Alden', role: 'Chief, Regulatory Development', portrait: portraits.man3 },
      { name: 'Evelyn Carter', role: 'Senior Licensing Project Manager', portrait: portraits.woman3 },
    ],
  },
  {
    country: 'United Kingdom',
    authority: 'Office for Nuclear Regulation (ONR)',
    head: 'Mark Foy',
    title: 'Chief Executive',
    team: [
      { name: 'Mark Foy', role: 'Chief Executive', portrait: portraits.man2 },
      { name: 'Sarah Whitfield', role: 'Chief Nuclear Inspector', portrait: portraits.woman1 },
      { name: 'James O’Brien', role: 'Director, Regulation', portrait: portraits.man1 },
      { name: 'Charlotte Hughes', role: 'Head of Safety Assessment', portrait: portraits.woman2 },
      { name: 'David Rimmer', role: 'Head of Site Licensing', portrait: portraits.man3 },
    ],
  },
  {
    country: 'France',
    authority: 'Autorité de Sûreté Nucléaire (ASN)',
    head: 'Bernard Doroszczuk',
    title: 'President',
    team: [
      { name: 'Bernard Doroszczuk', role: 'President', portrait: portraits.man1 },
      { name: 'Marie Dupont', role: 'Commissioner for Operations', portrait: portraits.woman1 },
      { name: 'Philippe Laurent', role: 'Director of Technical Regulation', portrait: portraits.man2 },
      { name: 'Claire Moreau', role: 'Head of International Relations', portrait: portraits.woman2 },
      { name: 'Antoine Roux', role: 'Senior Resident Inspector', portrait: portraits.man3 },
    ],
  },
  {
    country: 'Canada',
    authority: 'Canadian Nuclear Safety Commission (CNSC)',
    head: 'Rumina Velshi',
    title: 'President & CEO',
    team: [
      { name: 'Rumina Velshi', role: 'President & CEO', portrait: portraits.woman1 },
      { name: 'Marcus Leclair', role: 'Executive Vice-President, Operations', portrait: portraits.man1 },
      { name: 'Sonia Delgado', role: 'Director, Regulatory Affairs', portrait: portraits.woman2 },
      { name: 'Peter Kowalski', role: 'Director, Technical Assessment', portrait: portraits.man2 },
      { name: 'Rachel Tremblay', role: 'Senior Licensing Officer', portrait: portraits.woman3 },
    ],
  },
  {
    country: 'China',
    authority: 'National Nuclear Safety Administration (NNSA)',
    head: 'Zhang Kejian',
    title: 'Minister',
    team: [
      { name: 'Zhang Kejian', role: 'Minister', portrait: portraits.man1 },
      { name: 'Li Wei', role: 'Deputy Minister, Safety Regulation', portrait: portraits.man2 },
      { name: 'Chen Hui', role: 'Director, Reactor Safety Division', portrait: portraits.woman1 },
      { name: 'Wang Lei', role: 'Director, Radiological Protection', portrait: portraits.man3 },
      { name: 'Liu Fang', role: 'Senior Inspector, NPP Operations', portrait: portraits.woman2 },
    ],
  },
  {
    country: 'Japan',
    authority: 'Nuclear Regulation Authority (NRA)',
    head: 'Shinsuke Yamanaka',
    title: 'Chairman',
    team: [
      { name: 'Shinsuke Yamanaka', role: 'Chairman', portrait: portraits.man1 },
      { name: 'Keiko Tanaka', role: 'Commissioner', portrait: portraits.woman1 },
      { name: 'Hiroshi Saito', role: 'Director, Regulatory Standards', portrait: portraits.man2 },
      { name: 'Yuki Aoki', role: 'Head of Inspection Division', portrait: portraits.woman2 },
      { name: 'Takeshi Mori', role: 'Senior Safety Analyst', portrait: portraits.man3 },
    ],
  },
  {
    country: 'South Korea',
    authority: 'Nuclear Safety and Security Commission (NSSC)',
    head: 'Lee Eun-cheol',
    title: 'Chair',
    team: [
      { name: 'Lee Eun-cheol', role: 'Chair', portrait: portraits.man2 },
      { name: 'Park Ji-hoon', role: 'Vice Chair', portrait: portraits.man1 },
      { name: 'Kim Min-seo', role: 'Director, Safety Assessment', portrait: portraits.woman1 },
      { name: 'Choi Jung-woo', role: 'Director, Inspection & Enforcement', portrait: portraits.man3 },
      { name: 'Kang Soo-jin', role: 'Senior Nuclear Security Officer', portrait: portraits.woman2 },
    ],
  },
  {
    country: 'Russia',
    authority: 'Rostechnadzor',
    head: 'Alexander Trembitsky',
    title: 'Head',
    team: [
      { name: 'Alexander Trembitsky', role: 'Head', portrait: portraits.man1 },
      { name: 'Sergei Volkov', role: 'Deputy Head, Nuclear Oversight', portrait: portraits.man2 },
      { name: 'Irina Sokolova', role: 'Director, NPP Licensing', portrait: portraits.woman1 },
      { name: 'Dmitry Ivanov', role: 'Chief Safety Inspector', portrait: portraits.man3 },
      { name: 'Olga Petrova', role: 'Head of International Cooperation', portrait: portraits.woman2 },
    ],
  },
  {
    country: 'India',
    authority: 'Atomic Energy Regulatory Board (AERB)',
    head: 'G. Nageswara Rao',
    title: 'Chairman',
    team: [
      { name: 'G. Nageswara Rao', role: 'Chairman', portrait: portraits.man1 },
      { name: 'Dr. Anand Krishnan', role: 'Director, Regulatory Operations', portrait: portraits.man1 },
      { name: 'Meera Deshpande', role: 'Director, Safety Assessment', portrait: portraits.woman1 },
      { name: 'Rajesh Iyer', role: 'Director, Technical Compliance', portrait: portraits.man2 },
      { name: 'Neha Sharma', role: 'Principal Appraiser, Plant Design', portrait: portraits.woman2 },
      { name: 'Vikram Nair', role: 'Appraiser, Siting & Environment', portrait: portraits.man1 },
      { name: 'Arjun Menon', role: 'Appraiser, Quality & Reliability', portrait: portraits.man3 },
      { name: 'Priya Raman', role: 'Lead Test Engineer, Reactor Systems', portrait: portraits.woman1 },
      { name: 'Sanjay Kulkarni', role: 'Test Engineer, I&C', portrait: portraits.man2 },
      { name: 'Divya Pillai', role: 'Test Engineer, Radiation Protection', portrait: portraits.woman3 },
      { name: 'Dr. Suresh Patil', role: 'Senior Reviewer, Operational Safety', portrait: portraits.man3 },
      { name: 'Anita Verghese', role: 'Evaluation Officer, Emergency Preparedness', portrait: portraits.woman2 },
      { name: 'Karthik Rao', role: 'Licensing Officer, New Builds', portrait: portraits.man1 },
    ],
  },
]

export default function TeamDirectory() {
  const [selected, setSelected] = useState<CountryAuthority | null>(null)
  const rosterRef = useRef<HTMLDivElement | null>(null)

  const selectCountry = (country: CountryAuthority) => {
    setSelected(country)
    if (selected?.country === country.country) {
      setSelected(null)
      return
    }
    requestAnimationFrame(() => {
      rosterRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  return (
    <>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          title="Country Nuclear Authorities"
          subtitle="Select a country to open its full team roster — the independent regulators that license, inspect and oversee every nuclear facility in their home nation."
          centered
        />
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {authorities.map((a, i) => {
            const isSelected = selected?.country === a.country
            return (
              <button
                key={a.country}
                type="button"
                onClick={() => selectCountry(a)}
                aria-expanded={isSelected}
                className={cn(
                  'group flex h-full flex-col rounded-2xl border bg-white p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-500/50 hover:shadow-md',
                  isSelected
                    ? 'border-cyan-500 ring-2 ring-cyan-500/20'
                    : 'border-slate-200'
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={cn(
                      'flex h-11 w-11 items-center justify-center rounded-xl text-cyan-400 transition-colors',
                      isSelected ? 'bg-cyan-600 text-white' : 'bg-navy-900'
                    )}
                  >
                    <Globe className="h-5 w-5" />
                  </span>
                  <span className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                    {a.team.length} members
                    <Users className="h-3 w-3" />
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-bold text-navy-900">{a.country}</h3>
                <p className="mt-1 text-sm font-semibold text-cyan-600">{a.authority}</p>
                <div className="mt-5 border-t border-slate-100 pt-4">
                  <p className="text-sm font-bold text-navy-800">{a.head}</p>
                  <p className="text-xs text-slate-500">{a.title}</p>
                </div>
                <span
                  className={cn(
                    'mt-5 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider transition-colors',
                    isSelected ? 'text-cyan-600' : 'text-slate-500 group-hover:text-cyan-600'
                  )}
                >
                  {isSelected ? 'Close Roster' : 'Open Team Roster'}
                  <ChevronDown
                    className={cn('h-3.5 w-3.5 transition-transform duration-300', isSelected && 'rotate-180')}
                  />
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div ref={rosterRef} className="scroll-mt-24 pt-24" aria-live="polite">
        {selected ? (
          <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-cyan-600">
                    Team Roster
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-navy-900">
                    {selected.country}
                  </h2>
                  <p className="mt-1 text-sm font-semibold text-slate-600">
                    {selected.authority}
                  </p>
                </div>
                <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-navy-800">
                  {selected.team.length} team members
                </div>
              </div>
            </div>

            <div className="grid gap-5 p-8 sm:grid-cols-2 lg:grid-cols-3">
              {selected.team.map((m) => (
                <div
                  key={`${selected.country}-${m.name}`}
                  className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:border-cyan-200 hover:bg-white"
                >
                  <CardImage src={m.portrait} alt={`Portrait of ${m.name}`} className="h-14 w-14 shrink-0 rounded-full shadow" />
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold text-navy-900">{m.name}</h3>
                    <p className="mt-0.5 text-xs font-semibold text-cyan-600">{m.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
            <Users className="mx-auto h-10 w-10 text-slate-300" />
            <h2 className="mt-4 text-xl font-bold text-navy-900">Select a country above</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
              Choose any country card to see the full roster of people keeping nuclear
              operations safe and transparent within that nation.
            </p>
          </div>
        )}
      </div>
    </>
  )
}