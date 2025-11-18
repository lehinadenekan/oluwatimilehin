import Sidebar from '@/components/Sidebar'
import Hero from '@/components/Hero'
import Music from '@/components/Music'
import CommercialWork from '@/components/CommercialWork'
import CreativeProjects from '@/components/CreativeProjects'
import Services from '@/components/Services'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Sidebar />
      <div className="lg:ml-64">
        <Hero />
        <Music />
        <CommercialWork />
        <CreativeProjects />
        <Services />
      </div>
    </main>
  )
}

