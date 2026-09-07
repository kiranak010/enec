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
      { key: 'aboutStory', href: '/about/our-story' },
      { key: 'aboutLeadership', href: '/about/leadership' },
      { key: 'aboutHistory', href: '/about/history' },
    ],
  },
  { key: 'teams', href: '/teams' },
  {
    key: 'nuclear',
    href: '/nuclear-energy',
    children: [
      { key: 'nuclearHow', href: '/nuclear-energy/how-it-works' },
      { key: 'nuclearFleet', href: '/nuclear-energy/fleet' },
      { key: 'nuclearAdvanced', href: '/nuclear-energy/advanced-reactors' },
    ],
  },
  {
    key: 'projects',
    href: '/projects',
    children: [
      { key: 'projectsNew', href: '/projects/new-builds' },
      { key: 'projectsLife', href: '/projects/life-extensions' },
    ],
  },
  {
    key: 'sustainability',
    href: '/sustainability',
    children: [
      { key: 'sustainabilityNetZero', href: '/sustainability/net-zero' },
      { key: 'sustainabilityEsg', href: '/sustainability/esg' },
    ],
  },
  {
    key: 'innovation',
    href: '/innovation',
    children: [
      { key: 'innovationResearch', href: '/innovation/research' },
      { key: 'innovationTech', href: '/innovation/technology' },
    ],
  },
  {
    key: 'safety',
    href: '/safety',
    children: [
      { key: 'safetyCulture', href: '/safety/culture' },
      { key: 'safetyPerformance', href: '/safety/performance' },
    ],
  },
  {
    key: 'news',
    href: '/news',
    children: [
      { key: 'newsPress', href: '/news/press-releases' },
      { key: 'newsMedia', href: '/news/media' },
    ],
  },
  {
    key: 'careers',
    href: '/careers',
    children: [
      { key: 'careersOpenings', href: '/careers/openings' },
      { key: 'careersCulture', href: '/careers/culture' },
    ],
  },
  { key: 'suppliers', href: '/suppliers' },
  { key: 'contact', href: '/contact' },
]