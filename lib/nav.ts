export interface NavChildDef {
  key: string
  href: string
}

export interface NavItemDef {
  key: string
  href: string
  children?: NavChildDef[]
}

export interface NavOverrideChild {
  label?: string
  hidden?: boolean
}

export interface NavOverrideItem {
  label?: string
  hidden?: boolean
  children?: Record<string, NavOverrideChild>
}

export type NavOverrides = Record<string, NavOverrideItem>

export const DEFAULT_NAV: NavItemDef[] = [
  { key: 'home', href: '/' },
  {
    key: 'about',
    href: '/about',
    children: [
      { key: 'aboutStory', href: '/about' },
      { key: 'aboutLeadership', href: '/about/leadership' },
      { key: 'aboutHistory', href: '/about/history' },
    ],
  },
  { key: 'teams', href: '/teams' },
  {
    key: 'nuclear',
    href: '/nuclear-energy',
    children: [
      { key: 'nuclearHow', href: '/nuclear-energy/technology' },
      { key: 'nuclearFleet', href: '/projects' },
      { key: 'nuclearAdvanced', href: '/innovation' },
    ],
  },
  { key: 'projects', href: '/projects' },
  {
    key: 'sustainability',
    href: '/sustainability',
    children: [
      { key: 'sustainabilityNetZero', href: '/sustainability/environment' },
      { key: 'sustainabilityEsg', href: '/sustainability/reports' },
    ],
  },
  {
    key: 'innovation',
    href: '/innovation',
    children: [
      { key: 'innovationResearch', href: '/innovation/research' },
      { key: 'innovationTech', href: '/nuclear-energy/technology' },
    ],
  },
  { key: 'safety', href: '/safety' },
  { key: 'news', href: '/news' },
  {
    key: 'careers',
    href: '/careers',
    children: [
      { key: 'careersOpenings', href: '/careers/jobs' },
      { key: 'careersCulture', href: '/careers' },
    ],
  },
  { key: 'suppliers', href: '/suppliers' },
  { key: 'contact', href: '/contact' },
]