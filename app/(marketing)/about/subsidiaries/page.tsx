import Image from 'next/image'
import PageHeader from '@/components/ui/page-header'
import Reveal from '@/components/ui/reveal'
import SectionHeading from '@/components/ui/section-heading'
import Button from '@/components/ui/button'
import { ArrowLeft, Building2, Factory, Globe2, MapPin, Users, Zap } from 'lucide-react'
import { images } from '@/lib/images'

const subsidiaries = [
  {
    logo: '/logos/shree-shyam-devay.svg',
    name: 'Shree Shyam Devay Power Infra Pvt Ltd',
    location: 'Mumbai, Maharashtra',
    sector: 'Power Infrastructure & EPC',
    description:
      'Integrated power infrastructure company delivering EPC, transmission, distribution and renewable energy solutions across India, with a focus on reliable, high-quality power delivery.',
    flagship: true,
  },
  {
    logo: '/logos/vaidik-power.svg',
    name: 'Vaidik Power Corporation Ltd',
    location: 'Mumbai, Maharashtra',
    sector: 'Integrated Power Company',
    description:
      'An integrated power company with operations spanning generation, transmission, distribution and renewable energy across India.',
  },
  {
    logo: '/logos/surya-vayu.svg',
    name: 'SuryaVayu Renewables Pvt Ltd',
    location: 'Jaipur, Rajasthan',
    sector: 'Solar & Wind Energy',
    description:
      'A renewable energy developer building large-scale solar parks and wind farms across India\'s high-resource regions.',
  },
  {
    logo: '/logos/agni-thermal.svg',
    name: 'Agni Thermal Powergen Ltd',
    location: 'Raipur, Chhattisgarh',
    sector: 'Thermal Power Generation',
    description:
      'A thermal power producer operating supercritical coal plants that deliver reliable baseload electricity to utilities and industries.',
  },
  {
    logo: '/logos/neer-hydro.svg',
    name: 'Neer Hydro Energies Ltd',
    location: 'Shimla, Himachal Pradesh',
    sector: 'Hydropower Generation',
    description:
      'A hydropower developer and operator contributing large-scale clean and renewable generation capacity from India\'s river basins.',
  },
  {
    logo: '/logos/tarang-grid.svg',
    name: 'TarangGrid Transmission Ltd',
    location: 'Gurugram, Haryana',
    sector: 'Transmission Network',
    description:
      'A transmission utility operating an interconnected national grid that connects generation to every corner of the country.',
  },
  {
    logo: '/logos/prabhat-distribution.svg',
    name: 'Prabhat Distribution Networks Ltd',
    location: 'Lucknow, Uttar Pradesh',
    sector: 'Power Distribution Utility',
    description:
      'A power distribution utility delivering reliable electricity to millions of residential, commercial and industrial customers.',
  },
  {
    logo: '/logos/ujjwal-energy.svg',
    name: 'Ujjwal Energy Ventures Ltd',
    location: 'Pune, Maharashtra',
    sector: 'Clean Power Ventures',
    description:
      'A clean-energy venture builder investing in energy storage, EV infrastructure and advanced grid technologies.',
  },
]

const stats = [
  { icon: Zap, stat: '120+ GW', label: 'Group Generation Capacity' },
  { icon: Globe2, stat: '55,000+', label: 'Transmission Circuit kms' },
  { icon: Factory, stat: '25+', label: 'Power Plants Nationwide' },
  { icon: Users, stat: '40,000+', label: 'Employees in India' },
]

export default async function SubsidiariesPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title="Subsidiaries & Group Companies"
        description={
          <>
            Our group companies in India bring together some of the country&apos;s strongest names in
            power generation, transmission, distribution and infrastructure — working together to keep
            homes, industries and communities powered.
          </>
        }
        image={images.city}
      >
        <Button href="/about" variant="ghost" className="mt-8">
          <ArrowLeft className="h-4 w-4" /> Back to About
        </Button>
      </PageHeader>

      {/* Subsidiaries */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            title="Our Group Companies in India"
            subtitle="A network of power companies united by a single mission — reliable, affordable and clean energy for India."
            centered
          />
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {subsidiaries.map((company, i) => (
              <Reveal key={company.name} delay={i * 0.06}>
                <div className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-cyan-200 hover:shadow-md">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-[72px] items-center rounded-xl border border-slate-100 bg-slate-50 px-3">
                      <Image
                        src={company.logo}
                        alt={`${company.name} logo`}
                        width={260}
                        height={112}
                        className="h-12 w-auto"
                      />
                    </div>
                    {company.flagship ? (
                      <span className="shrink-0 rounded-full bg-cyan-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                        Flagship
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-6">
                    <h3 className="text-xl font-bold text-navy-900">{company.name}</h3>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                      <p className="font-medium text-cyan-500">{company.sector}</p>
                    </div>
                    <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                      <MapPin className="h-4 w-4 shrink-0" />
                      {company.location}
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-slate-600">
                      {company.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-navy-900 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            title="One Group, Powering India"
            subtitle="Combined, our group companies form one of the largest power networks in the country."
            centered
            light
          />
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item, i) => (
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
          <div className="mt-14 text-center">
            <div className="mx-auto flex max-w-3xl items-start gap-4 rounded-2xl border border-navy-700/50 bg-navy-950/60 p-6 text-left">
              <Building2 className="mt-1 h-5 w-5 shrink-0 text-cyan-400" />
              <p className="text-sm leading-relaxed text-navy-100/85">
                From generation and transmission to infrastructure and EPC, every group company
                operates to the same standards of safety, reliability and excellence. Together, we
                help power India&apos;s growth — one megawatt at a time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight text-navy-900 md:text-4xl">
              Want to Work With Our Group?
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Whether you are a customer, partner or supplier, our group companies are ready to
              power the next chapter with you.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href="/contact" variant="primary">
                Get in Touch
              </Button>
              <Button href="/about" variant="ghost">
                Back to About
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}