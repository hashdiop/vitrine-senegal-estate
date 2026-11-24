import { useEffect } from 'react'
import Hero from '../components/home/Hero'
import { FeaturedTerrains, Process, ProjectsScroller, ServicesSection, SimulatorSection, Stats, Testimonials, WhyUs } from '../components/home/HomeSections'
import { CtaBanner } from '../components/ui/Sections'

export default function Home() {
  useEffect(() => { document.title = 'Senegal Estates — Terrains sécurisés & construction au Sénégal' }, [])
  return (
    <>
      <Hero />
      <Stats />
      <ServicesSection />
      <FeaturedTerrains />
      <WhyUs />
      <Process />
      <SimulatorSection />
      <ProjectsScroller />
      <Testimonials />
      <CtaBanner />
    </>
  )
}
