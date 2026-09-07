import type { Metadata } from 'next'
import {
  ArrowRight,
  Atom,
  Award,
  Brain,
  FlaskConical,
  GraduationCap,
  HeartHandshake,
  Lightbulb,
  Rocket,
  ShieldCheck,
  TrendingUp,
  Users,
  Wrench,
} from 'lucide-react'
import PageHeader from '@/components/ui/page-header'
import Reveal from '@/components/ui/reveal'
import SectionHeading from '@/components/ui/section-heading'
import Button from '@/components/ui/button'
import { images } from '@/lib/images'

export const metadata: Metadata = {
  title: 'Careers',
  description:
    'Build the energy systems of tomorrow at Emirates Nuclear Energy Corporation. Explore rewarding careers in engineering, nuclear science, operations and technology.',
}

const cultureValues = [
  {
    icon: ShieldCheck,
    title: 'Safety First',
    description:
      'Every decision starts with safety. We empower every employee to stop work and raise concerns without hesitation. It is our licence to operate and the foundation of trust with the communities we serve.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description:
      'We invest in research, advanced reactor technologies and digital tools that make clean power safer and more affordable. Good ideas are welcomed from every job family and every level.',
  },
  {
    icon: Users,
    title: 'Collaboration',
    description:
      'Big challenges need diverse teams. Engineers, scientists, operators and commercial colleagues work side by side — because the best engineering happens around one table.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description:
      'We hold ourselves to the highest standards in the industry. Rigorous training, continuous improvement and world-class performance are the habits that define our people.',
  },
]

const benefits = [
  'Competitive compensation and performance bonus',
  'Comprehensive health, dental and vision coverage',
  'Generous retirement plans with company matching',
  'Paid parental leave and flexible working arrangements',
  'Structured development plans and tuition support',
  'Professional registration and certification sponsorship',
  'Relocation assistance for site-based roles',
  'Employee well-being and mental health programmes',
]

const departments = [
  {
    icon: Wrench,
    name: 'Engineering',
    description:
      'Design, build and improve the systems that turn nuclear energy into reliable clean power.',
  },
  {
    icon: FlaskConical,
    name: 'Nuclear Science',
    description:
      'Advance reactor physics, materials science and safety analysis at the frontier of the field.',
  },
  {
    icon: Atom,
    name: 'Operations',
    description:
      'Run our plants with world-class safety and reliability — the heart of our company.',
  },
  {
    icon: Brain,
    name: 'Technology',
    description:
      'Build the digital, data and automation capabilities that make nuclear smarter every year.',
  },
  {
    icon: Users,
    name: 'Corporate',
    description:
      'Finance, legal, communications, HR and strategy — the teams that keep the mission moving.',
  },
]

const earlyCareers = [
  {
    icon: GraduationCap,
    title: 'Graduate Programs',
    description:
      'Two-year structured rotations across engineering, project delivery and operations, with a senior mentor and a real project to own from week one.',
    slug: '/careers/jobs/graduate-nuclear-science-program',
  },
  {
    icon: Rocket,
    title: 'Internships',
    description:
      'Paid summer placements for undergraduates that pair classroom learning with hands-on work at operating stations and our innovation labs.',
    slug: '/careers/jobs/summer-engineering-internship',
  },
]

export default function CareersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Careers"
        title="Build the Energy Systems of Tomorrow"
        description={
          <>
            Join a global team of engineers, scientists, operators and
            problem-solvers delivering reliable clean power to millions of
            people — and shaping the future of energy for generations.
          </>
        }
        image={images.team}
      >
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button href="/careers/jobs" size="lg">
            View Open Positions
            <ArrowRight className="h-5 w-5" />
          </Button>
          <Button
            href="/careers/jobs/summer-engineering-internship"
            variant="outline"
            size="lg"
            className="border-white/40 text-white hover:bg-white/10 hover:text-white"
          >
            Early Careers
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            { value: '12,000+', label: 'Employees worldwide' },
            { value: '40+', label: 'Nationalities represented' },
            { value: '96%', label: 'Safety culture engagement' },
            { value: '48', label: 'Countries in our value chain' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-white/5 p-6">
              <p className="text-3xl font-bold text-cyan-400">{stat.value}</p>
              <p className="mt-2 text-sm text-navy-100/80">{stat.label}</p>
            </div>
          ))}
        </div>
      </PageHeader>

      <section className="section-padding bg-white">
        <div className="container-narrow">
          <SectionHeading
            title="Why Work With Us"
            subtitle="Working at ENEC means doing the most consequential work of your career — with people who bring out the best in you. We are guided by a single mission: powering a cleaner energy future, safely and reliably."
            centered
          />

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: 'Purposeful Work',
                description:
                  'Your projects will help deliver clean, reliable power and fight climate change — work you can explain to your family and be proud of.',
              },
              {
                icon: Users,
                title: 'Real Responsibility',
                description:
                  'From day one you will own meaningful work, supported by structured mentoring, transparent development frameworks and a leadership team that listens.',
              },
              {
                icon: TrendingUp,
                title: 'Grow With Us',
                description:
                  'With a growing global portfolio and a healthy pipeline of new-build activity, there is always a next step for people who deliver.',
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08}>
                <div className="rounded-2xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600">
                    <item.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-6 text-xl font-bold text-navy-900">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-slate-50">
        <div className="container-narrow">
          <SectionHeading
            title="Our Culture Values"
            subtitle="Four principles guide how we show up every day — to each other, to our regulators and to the communities that host us."
            centered
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {cultureValues.map((value, i) => (
              <Reveal key={value.title} delay={i * 0.08}>
                <div className="rounded-2xl bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-navy-700 text-white shadow-md shadow-cyan-500/25">
                    <value.icon className="h-7 w-7" />
                  </span>
                  <h3 className="mt-6 text-lg font-bold text-navy-900">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {value.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-narrow grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              title="Benefits & Reward"
              subtitle="We invest in our people because our mission depends on them. Beyond competitive pay, we offer a total reward package designed around your wellbeing and growth."
            />
            <Reveal>
              <ul className="grid gap-3 sm:grid-cols-2">
                {benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium text-slate-700"
                  >
                    <HeartHandshake className="mt-0.5 h-4 w-4 shrink-0 text-cyan-600" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div>
            <SectionHeading
              title="Departments"
              subtitle="Explore teams across the business — each discipline brings something essential to delivering clean power at scale."
            />
            <div className="space-y-4">
              {departments.map((dept, i) => (
                <Reveal key={dept.name} delay={i * 0.08}>
                  <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-lg">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-white">
                      <dept.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-bold text-navy-900">{dept.name}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">
                        {dept.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-slate-50">
        <div className="container-narrow">
          <SectionHeading
            title="Early Careers"
            subtitle="Start your career with a programme designed to give you real responsibility, real mentors and a real future in clean energy."
            centered
          />

          <div className="grid gap-8 md:grid-cols-2">
            {earlyCareers.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08}>
                <div className="flex flex-col rounded-2xl gradient-navy p-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-400">
                    <item.icon className="h-7 w-7" />
                  </span>
                  <h3 className="mt-6 text-2xl font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-navy-100/80">
                    {item.description}
                  </p>
                  <Button
                    href={item.slug}
                    variant="outline"
                    size="sm"
                    className="mt-8 w-fit border-cyan-400/50 text-cyan-300 hover:bg-cyan-500/10"
                  >
                    Learn More
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-navy-900">
              Ready to make your move?
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600">
              Browse current openings across engineering, science, operations,
              technology and corporate teams.
            </p>
            <Button href="/careers/jobs" size="lg" className="mt-8">
              View Open Positions
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  )
}