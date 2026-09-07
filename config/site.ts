export const site = {
  name: 'Emirates Nuclear Energy Corporation',
  shortName: 'ENEC',
  tagline: 'Powering a Cleaner Energy Future',
  description:
    'Emirates Nuclear Energy Corporation is a global leader in nuclear energy and advanced clean power technologies, delivering reliable baseload electricity and driving the transition to a sustainable energy future.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  email: {
    general: 'info@enec.in',
    media: 'media@enec.gov.ae',
    careers: 'careers@enec.gov.ae',
    investors: 'investors@enec.gov.ae',
    suppliers: 'suppliers@enec.gov.ae',
  },
  phone: {
    general: '+971 2 555 0100',
    media: '+971 2 555 0101',
  },
  headquarters: {
    name: 'Emirates Nuclear Energy Corporation — Global Headquarters',
    address: 'Abu Dhabi, United Arab Emirates',
  },
  social: {
    twitter: 'https://twitter.com/enec',
    linkedin: 'https://linkedin.com/company/enec',
    youtube: 'https://youtube.com/@enec',
  },
  brand: {
    primaryColor: '#0B1D3A',     // deep navy
    secondaryColor: '#00A3E0',   // electric cyan
    accentColor: '#F5A623',      // amber highlight
    neutralLight: '#F4F6F8',
    neutralDark: '#1A1A2E',
  },
  legal: {
    companyName: 'Emirates Nuclear Energy Corporation',
    registrationNumber: 'ENEC-2024-0001',
    copyrightYear: new Date().getFullYear(),
  },
} as const

export type SiteConfig = typeof site