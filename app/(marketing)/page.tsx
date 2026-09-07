import { Hero } from '@/app/home/hero'
import { Stats } from '@/app/home/stats'
import { AboutIntro } from '@/app/home/about-intro'
import { NuclearIntro } from '@/app/home/nuclear-intro'
import { FeaturedProjects } from '@/app/home/featured-projects'
import { Sustainability } from '@/app/home/sustainability'
import { Innovation } from '@/app/home/innovation'
import { LatestNews } from '@/app/home/latest-news'
import { CareersCTA } from '@/app/home/careers-cta'
import { GlobalPresence } from '@/app/home/global-presence'
import { FinalCTA } from '@/app/home/final-cta'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <AboutIntro />
      <NuclearIntro />
      <FeaturedProjects />
      <Sustainability />
      <Innovation />
      <LatestNews />
      <CareersCTA />
      <GlobalPresence />
      <FinalCTA />
    </>
  )
}