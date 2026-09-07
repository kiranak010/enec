import Button from '@/components/ui/button'
import PageHeader from '@/components/ui/page-header'
import Reveal from '@/components/ui/reveal'
import CardImage from '@/components/ui/card-image'
import { images } from '@/lib/images'
import { ArrowLeft, GraduationCap, DollarSign, Briefcase, Heart } from 'lucide-react'

const programs = [
  {
    icon: GraduationCap,
    title: 'Education & Workforce Development',
    description:
      'We invest heavily in building the nuclear workforce of the future. Through university partnerships, scholarship programs, vocational training, and internship opportunities, we help develop the skilled professionals that the nuclear industry needs to thrive.',
    initiatives: [
      'ENEC Scholarship Program — funding 200+ students annually in nuclear engineering and related fields',
      'Partnerships with 25 universities worldwide for research and education',
      'Vocational training programs for local communities near our facilities',
      'Summer internship and co-op programs for undergraduate and graduate students',
    ],
    image: images.lab,
  },
  {
    icon: DollarSign,
    title: 'Economic Impact',
    description:
      'Nuclear power plants are significant economic engines for their host communities. They create high-quality jobs, generate substantial tax revenue, and attract secondary economic development. Our operations support thousands of direct and indirect jobs in every region where we operate.',
    initiatives: [
      'Average annual economic impact of $1.2 billion per plant in local and regional economies',
      'Tax contributions supporting schools, infrastructure, and public services',
      'Supply chain partnerships with thousands of local and regional businesses',
      'Long-term employment stability with average employee tenure of 15+ years',
    ],
    image: images.city,
  },
  {
    icon: Briefcase,
    title: 'Local Hiring & Procurement',
    description:
      'We are committed to hiring locally and sourcing from regional suppliers wherever possible. Our procurement policies prioritize local businesses and create opportunities for small and medium enterprises to participate in the nuclear supply chain.',
    initiatives: [
      'Local hiring targets of 60%+ for plant construction and operations',
      'Annual supplier diversity spend exceeding $500 million',
      'Small business development programs and mentoring initiatives',
      'Regional supplier qualification and certification support',
    ],
    image: images.engineers,
  },
  {
    icon: Heart,
    title: 'Community Engagement',
    description:
      'We believe in being a good neighbor. Through ongoing community advisory panels, facility tours, public information programs, and charitable partnerships, we maintain open, transparent relationships with the communities that host our operations.',
    initiatives: [
      'Community Advisory Panels at every operating facility',
      'Annual community open days attracting thousands of visitors',
      'Charitable foundation supporting local health, education, and arts programs',
      'Emergency preparedness partnerships with local first responders',
    ],
    image: images.team,
  },
]

export default async function CommunityPage() {
  return (
    <>
      <PageHeader
        eyebrow="Sustainability"
        title="Community Impact"
        description={
          <>
            We are committed to being a positive force in every community where we operate. Through
            education, economic development, and genuine partnership, we create lasting value beyond
            the electricity we generate.
          </>
        }
        image={images.team}
      >
        <Button href="/sustainability" variant="ghost" className="mt-8">
          <ArrowLeft className="h-4 w-4" /> Back to Sustainability
        </Button>
      </PageHeader>

      {programs.map((p, i) => (
        <section key={p.title} className={i % 2 === 0 ? 'py-24 md:py-32' : 'bg-slate-50 py-24 md:py-32'}>
          <Reveal className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="lg:w-1/3">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-500/10">
                  <p.icon className="h-7 w-7 text-cyan-500" />
                </div>
                <h2 className="mt-6 text-3xl md:text-4xl font-bold text-navy-900 tracking-tight">
                  {p.title}
                </h2>
                <p className="mt-4 text-slate-600 leading-relaxed">{p.description}</p>
                <div className="group mt-8 overflow-hidden rounded-2xl">
                  <CardImage
                    src={p.image}
                    alt={p.title}
                    className="aspect-[16/10]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              </div>
              <div className="lg:w-2/3">
                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                  <h3 className="text-lg font-bold text-navy-900 mb-4">Key Initiatives</h3>
                  <ul className="space-y-4">
                    {p.initiatives.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed">
                        <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-white">
                          ✓
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      ))}

      <section className="bg-navy-900 py-20">
        <Reveal className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Partner With Us
          </h2>
          <p className="mt-4 text-navy-100/70 max-w-xl mx-auto">
            We welcome opportunities to collaborate with organizations that share our commitment
            to community development and education.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button href="/contact" variant="primary">
              Get in Touch
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  )
}
