'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Check, Linkedin, Twitter, Youtube } from 'lucide-react'
import { site } from '@/config/site'
import { useSite } from '@/lib/i18n/provider'
import type { TKey } from '@/lib/i18n/translations'
import { VisitorCounter } from './visitor-counter'

const navigationColumns: { titleKey: TKey; links: { labelKey: TKey; href: string }[] }[] = [
  {
    titleKey: 'nav.nuclear',
    links: [
      { labelKey: 'nav.nuclearHow', href: '/nuclear-energy/technology' },
      { labelKey: 'nav.nuclearFleet', href: '/projects' },
      { labelKey: 'nav.nuclearAdvanced', href: '/innovation' },
      { labelKey: 'nav.projects', href: '/projects' },
      { labelKey: 'nav.safety', href: '/safety' },
    ],
  },
  {
    titleKey: 'footer.company',
    links: [
      { labelKey: 'nav.about', href: '/about' },
      { labelKey: 'nav.aboutLeadership', href: '/about/leadership' },
      { labelKey: 'nav.sustainability', href: '/sustainability' },
      { labelKey: 'nav.innovation', href: '/innovation' },
      { labelKey: 'nav.careers', href: '/careers' },
      { labelKey: 'nav.careersOpenings', href: '/careers/jobs' },
      { labelKey: 'nav.suppliers', href: '/suppliers' },
    ],
  },
  {
    titleKey: 'footer.resources',
    links: [
      { labelKey: 'nav.news', href: '/news' },
      { labelKey: 'nav.sustainabilityEsg', href: '/sustainability/reports' },
      { labelKey: 'nav.aboutHistory', href: '/about/history' },
      { labelKey: 'common.search', href: '/search' },
    ],
  },
  {
    titleKey: 'footer.connect',
    links: [
      { labelKey: 'nav.contact', href: '/contact' },
      { labelKey: 'footer.generalEnquiries', href: `/contact?subject=${site.email.general}` },
      { labelKey: 'footer.mediaEnquiries', href: `/contact?subject=${site.email.media}` },
      { labelKey: 'footer.investorRelations', href: `/contact?subject=${site.email.investors}` },
    ],
  },
]

const legalLinks = [
  { labelKey: 'footer.privacy', href: '/privacy' },
  { labelKey: 'footer.terms', href: '/terms' },
  { labelKey: 'footer.accessibility', href: '/accessibility' },
] satisfies { labelKey: TKey; href: string }[]

const socialLinks = [
  { label: 'Twitter', href: site.social.twitter, icon: Twitter },
  { label: 'LinkedIn', href: site.social.linkedin, icon: Linkedin },
  { label: 'YouTube', href: site.social.youtube, icon: Youtube },
]

function NewsletterForm() {
  const { t } = useSite()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error('bad')
      setStatus('done')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-sm flex-col gap-3 sm:flex-row">
      <label htmlFor="newsletter-email" className="sr-only">
        {t('footer.emailPlaceholder')}
      </label>
      <input
        id="newsletter-email"
        name="email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t('footer.emailPlaceholder')}
        className="w-full flex-1 rounded-lg border border-navy-700 bg-navy-800/60 px-4 py-3 text-sm text-white placeholder:text-navy-300 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="rounded-lg bg-cyan-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan-600 disabled:pointer-events-none disabled:opacity-50"
      >
        {t('footer.subscribe')}
      </button>

      {status === 'done' ? (
        <p className="flex items-center gap-1.5 text-sm text-emerald-400">
          <Check className="h-4 w-4" /> Thank you for subscribing.
        </p>
      ) : status === 'error' ? (
        <p className="text-sm text-red-400">Something went wrong. Please try again.</p>
      ) : null}
    </form>
  )
}

export default function SiteFooter() {
  const { t, content } = useSite()

  return (
    <footer className="bg-navy-950 text-navy-100">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/images/enec-mark.svg"
                alt="ENEC logo"
                width={48}
                height={26}
                className="h-8 w-auto shrink-0"
              />
              <span className="flex flex-col">
                <span className="text-xl font-extrabold leading-none tracking-tight text-white">
                  {site.shortName}
                </span>
                <span className="mt-1 text-[10px] font-medium uppercase tracking-widest text-cyan-400">
                  {site.name}
                </span>
              </span>
            </Link>

            <p className="mt-5 text-sm leading-relaxed text-navy-200/80">
              {content.footerIntro || DEFAULT_INTRO}
            </p>

            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-navy-700 text-navy-200 transition-colors hover:border-cyan-500 hover:bg-cyan-500/10 hover:text-cyan-400"
                >
                  <Icon className="h-4.5 w-4.5" />
                </a>
              ))}
            </div>
          </div>

          {navigationColumns.map((column) => (
            <div key={column.titleKey}>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                {t(column.titleKey)}
              </h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-navy-200/80 transition-colors hover:text-cyan-400"
                    >
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-navy-800 bg-navy-900/60 p-8">
          <h3 className="text-lg font-bold text-white">{t('footer.stayInformed')}</h3>
          <p className="mt-2 max-w-2xl text-sm text-navy-200/80">{t('footer.newsletter')}</p>
          <div className="mt-5">
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-navy-800 pt-8 sm:flex-row">
          <p className="text-sm text-navy-300">
            &copy; {site.legal.copyrightYear} {site.legal.companyName}. {t('footer.rights')} Reg. No.{' '}
            {site.legal.registrationNumber}.
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-navy-300 transition-colors hover:text-cyan-400"
                >
                  {t(link.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
          <VisitorCounter />
        </div>
      </div>
    </footer>
  )
}

const DEFAULT_INTRO = 'Powering a Cleaner Energy Future. Abu Dhabi, United Arab Emirates.'