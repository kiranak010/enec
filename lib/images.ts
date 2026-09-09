export const images = {
  heroPlant: '/images/barakah-plant.jpg',
  reactors: '/images/reactors.jpg',
  controlRoom: '/images/control-room.jpg',
  grid: '/images/grid.jpg',
  solar: '/images/solar.jpg',
  wind: '/images/wind.jpg',
  engineers: '/images/engineers.jpg',
  lab: '/images/lab.jpg',
  safety: '/images/safety.jpg',
  team: '/images/team.jpg',
  city: '/images/city.jpg',
  nature: '/images/nature.jpg',
  earth: '/images/earth.jpg',
  turbineHall: '/images/turbine-hall.jpg',
  workshop: '/images/workshop.jpg',
  mediaBriefing: '/images/media-briefing.jpg',
  documentArchive: '/images/document-archive.jpg',
  barakahPlant: '/images/barakah-plant.jpg',
  barakahConstruction: '/images/barakah-construction.jpg',
  nuclearCoolingTower: '/images/nuclear-cooling-tower.jpg',
  nuclearCoolingTowers: '/images/nuclear-cooling-towers.jpg',
  powerGridSunset: '/images/power-grid-sunset.jpg',
  powerGridPylon: '/images/power-grid-pylon.jpg',
  solarDesert: '/images/solar-desert.jpg',
  windKansas: '/images/wind-kansas.jpg',
} as const

export const portraits = {
  man1: '/images/portrait-man-1.jpg',
  woman1: '/images/portrait-woman-1.jpg',
  man2: '/images/portrait-man-2.jpg',
  woman2: '/images/portrait-woman-2.jpg',
  man3: '/images/portrait-man-3.jpg',
  woman3: '/images/portrait-woman-3.jpg',
} as const

const projectImages: Record<string, string> = {
  'meridian-reactor': images.barakahConstruction,
  'pacific-clean-energy-plant': images.nuclearCoolingTower,
  'northern-energy-hub': images.nuclearCoolingTowers,
  'eastern-seaboard-station': images.powerGridSunset,
  'central-plains-reactor': images.windKansas,
  'southern-coastal-project': images.powerGridPylon,
}

export function projectImage(slug: string): string {
  return projectImages[slug] ?? images.heroPlant
}

const newsImages: Record<string, string> = {
  'advancing-next-generation-reactor-technology': images.barakahConstruction,
  'global-partnership-for-clean-energy-expansion': images.solarDesert,
  'new-safety-standards-set-industry-benchmark': images.safety,
  'investing-in-tomorrows-energy-workforce': images.team,
  'milestone-25-gw-of-clean-energy-capacity': images.powerGridSunset,
  'pioneering-ai-driven-predictive-maintenance': images.controlRoom,
  'enec-reports-record-generation-in-2025': images.nuclearCoolingTowers,
  'smr-technology-roadmap-unveiled': images.turbineHall,
  'nuclear-skills-academy-launched': images.workshop,
  'advanced-fuel-more-efficient-nuclear-cycle': images.lab,
}

const newsCategories: Record<string, string> = {
  'Nuclear Innovation': images.reactors,
  Innovation: images.lab,
  Corporate: images.city,
  Safety: images.safety,
  Careers: images.team,
}

export function newsImage(slug: string, categoryName?: string | null): string {
  const bySlug = newsImages[slug]
  if (bySlug) return bySlug
  if (categoryName) {
    const byCategory = newsCategories[categoryName]
    if (byCategory) return byCategory
  }
  return images.city
}

const jobImages: Record<string, string> = {
  'senior-nuclear-engineer': images.engineers,
  'reactor-systems-analyst': images.controlRoom,
  'safety-culture-specialist': images.safety,
  'graduate-nuclear-science-program': images.lab,
  'summer-engineering-internship': images.workshop,
}

export function jobImage(slug: string): string {
  return jobImages[slug] ?? images.team
}

const leadershipImages: Record<string, string> = {
  'dr-alexandra-whitfield-chief-executive-officer': portraits.woman1,
  'prof-raj-krishnamurthy-chief-technology-officer': portraits.man1,
  'michael-torres-chief-financial-officer': portraits.man2,
  'elizabeth-chang-chief-operating-officer': portraits.woman2,
  'dr-hans-mueller-vice-president-of-safety': portraits.man3,
  'dr-priya-patel-vice-president-of-engineering': portraits.woman3,
}

export function leadershipImage(slug: string): string {
  return leadershipImages[slug] ?? portraits.man1
}