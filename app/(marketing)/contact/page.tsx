import type { Metadata } from 'next'
import {
  Building2,
  Clock,
  Mail,
  MapPin,
} from 'lucide-react'
import SectionHeading from '@/components/ui/section-heading'
import PageHeader from '@/components/ui/page-header'
import Reveal from '@/components/ui/reveal'
import CardImage from '@/components/ui/card-image'
import ContactForm from './contact-form'
import { site } from '@/config/site'
import { images } from '@/lib/images'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contact Emirates Nuclear Energy Corporation. Reach our headquarters, media office or dedicated departmental teams through our online contact form.',
}

const departments = [
  {
    name: 'General Enquiries',
    email: site.email.general,
    description:
      'Questions about our company, projects and clean-energy services.',
  },
  {
    name: 'Media',
    email: site.email.media,
    description:
      'Press enquiries, interviews and imagery requests from our newsroom.',
  },
  {
    name: 'Careers',
    email: site.email.careers,
    description:
      'Job applications, graduate programmes and HR support.',
  },
  {
    name: 'Investors',
    email: site.email.investors,
    description:
      'Investor relations, financial reporting and shareholder services.',
  },
  {
    name: 'Suppliers',
    email: site.email.suppliers,
    description:
      'Vendor registration, procurement and supplier development.',
  },
]

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Get in Touch"
        description={
          <>
            Whether you are a future partner, a future colleague, a member
            of the media or simply curious about clean nuclear energy — we
            would love to hear from you.
          </>
        }
        image={images.city}
      />

      <section className="section-padding bg-slate-50">
        <div className="container-narrow grid gap-12 lg:grid-cols-5">
          <Reveal className="lg:col-span-3">
            <SectionHeading
              title="Send Us a Message"
              subtitle="Fill in the form and the right team will get back to you within two business days."
            />
            <ContactForm />
          </Reveal>

          <aside className="lg:col-span-2">
            <div className="h-fit space-y-6 lg:sticky lg:top-24">
              <Reveal>
                <div className="rounded-2xl gradient-navy p-8">
                <div className="flex items-center gap-3">
                  <Building2 className="h-6 w-6 text-cyan-400" />
                  <h3 className="text-xl font-bold text-white">
                    Global Headquarters
                  </h3>
                </div>
                <div className="mt-6 space-y-5 text-sm text-navy-100/80">
                  <p className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                    {site.headquarters.address}
                  </p>
                  <p className="flex items-center gap-3">
                    <Mail className="h-4 w-4 shrink-0 text-cyan-400" />
                    {site.email.general}
                  </p>
                </div>
                <div className="mt-6 border-t border-white/10 pt-6">
                  <p className="flex items-center gap-3 text-sm text-navy-100/80">
                    <Clock className="h-4 w-4 shrink-0 text-cyan-400" />
                    Monday – Friday, 8:00 AM – 6:00 PM (GST)
                  </p>
                  <p className="mt-3 text-xs leading-relaxed text-navy-200/70">
                    Emergency and media lines are available 24/7 for
                    time-sensitive matters.
                  </p>
                </div>
              </div>
              </Reveal>

              <Reveal>
                <div className="rounded-2xl border border-slate-200 bg-white p-7">
                  <h3 className="text-lg font-bold text-navy-900">
                    Department Contacts
                  </h3>
                <div className="mt-5 space-y-4">
                  {departments.map((dept) => (
                    <a
                      key={dept.name}
                      href={`mailto:${dept.email}`}
                      className="group block rounded-xl border border-slate-200 bg-slate-50 p-4 transition-all duration-200 hover:border-cyan-500/50 hover:bg-white hover:shadow-md"
                    >
                      <span className="flex items-center gap-2 text-sm font-semibold text-navy-900">
                        <Mail className="h-4 w-4 text-cyan-600" />
                        {dept.name}
                      </span>
                      <span className="mt-1 block text-sm text-cyan-600 group-hover:underline">
                        {dept.email}
                      </span>
                      <span className="mt-1 block text-xs text-slate-500">
                        {dept.description}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
              </Reveal>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="section-padding">
          <div className="container-narrow">
            <Reveal>
              <div className="group relative overflow-hidden rounded-3xl border border-slate-200">
                <CardImage
                  src={images.city}
                  alt="ENEC Global Headquarters"
                  className="min-h-80"
                  sizes="(max-width: 768px) 100vw, 1200px"
                >
                  <div className="absolute inset-0 bg-navy-950/70" />
                  <div className="relative flex min-h-80 flex-col items-center justify-center gap-4 p-12 text-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-cyan-300 shadow-lg backdrop-blur">
                      <MapPin className="h-7 w-7" />
                    </span>
                    <h3 className="text-2xl font-bold text-white">
                      Visit Our Headquarters
                    </h3>
                    <p className="max-w-md text-sm text-navy-100/90">
                      {site.headquarters.name}
                      <br />
                      {site.headquarters.address}
                    </p>
                    <p className="mt-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/90 shadow-sm backdrop-blur">
                      Visitor appointments are arranged via the general contact
                      line.
                    </p>
                  </div>
                </CardImage>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}