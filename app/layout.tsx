import type { Metadata, Viewport } from 'next'
import { cookies } from 'next/headers'
import { Inter, Noto_Sans_Arabic } from 'next/font/google'
import './globals.css'
import { site } from '@/config/site'
import { SiteProvider } from '@/lib/i18n/provider'
import { getLocaleMeta, LOCALE_COOKIE, resolveLocale } from '@/lib/i18n/locales'
import { DEFAULT_SITE_CONTENT, getSiteSettings } from '@/lib/site-content'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const notoArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  variable: '--font-arabic',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: `${site.shortName} | ${site.tagline}`,
    template: `%s | ${site.shortName}`,
  },
  description: site.description,
  metadataBase: new URL(site.url),
  openGraph: {
    siteName: site.name,
    title: `${site.shortName} | ${site.tagline}`,
    description: site.description,
    url: site.url,
    locale: 'en_AE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.shortName} | ${site.tagline}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: site.brand.primaryColor,
  width: 'device-width',
  initialScale: 1,
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: site.name,
  url: site.url,
  logo: `${site.url}/icon.svg`,
  description: site.description,
  email: site.email.general,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Abu Dhabi',
    addressLocality: 'Abu Dhabi',
    postalCode: '',
    addressCountry: 'AE',
  },
  sameAs: [site.social.twitter, site.social.linkedin, site.social.youtube],
}

interface LayoutProps {
  children: React.ReactNode
}

export default async function RootLayout({ children }: LayoutProps) {
  const cookieStore = await cookies()
  const locale = resolveLocale(cookieStore.get(LOCALE_COOKIE)?.value)
  const meta = getLocaleMeta(locale)
  let settings: Awaited<ReturnType<typeof getSiteSettings>> = {
    content: DEFAULT_SITE_CONTENT,
    navOverrides: {},
  }
  try {
    settings = await getSiteSettings()
  } catch {
    // Fall back to defaults if settings are unavailable.
  }

  return (
    <html
      lang={locale}
      dir={meta.dir}
      suppressHydrationWarning
      className={`${inter.variable} ${notoArabic.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-white antialiased">
        <SiteProvider
          locale={locale}
          content={settings.content}
          navOverrides={settings.navOverrides}
        >
          {children}
        </SiteProvider>
      </body>
    </html>
  )
}