import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import SEOHead from '../components/SEOHead'
import DiveExplorerMap from '../components/DiveExplorerMap'

export default function DiveExplorer() {
  const navigate = useNavigate()
  const [selectedSite, setSelectedSite] = useState(null)

  const handleBookSite = (site) => {
    // Navigate to /book-us with the selected site's country preselected!
    if (site?.country) {
      navigate(`/book-us?country=${encodeURIComponent(site.country)}&site=${encodeURIComponent(site.siteName)}`)
    } else {
      navigate('/book-us')
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-navy font-body pt-24 sm:pt-28 pb-20 sm:pb-32 overflow-x-hidden">
      <SEOHead
        title="Dive Explorer | Worldwide 2D Dive Site Map | The Dive Village"
        description="Explore over 3,500 worldwide dive locations, coral reefs, walls, and marine sanctuaries on an interactive 2D map. Filter by country, search by name, and plan your dive trip."
        keywords="dive sites map, world dive locations, scuba diving map, coral reefs coordinates, padi dive sites, the dive village explorer"
        canonicalUrl="https://thedivevillage.com/dive-explorer"
      />

      {/* Header Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <nav className="flex items-center gap-2 text-xs font-semibold text-navy/60">
            <Link to="/" className="hover:text-navy transition">Home</Link>
            <span>/</span>
            <span className="text-navy font-bold">Dive Explorer</span>
          </nav>

          <Link
            to="/book-us"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-navy text-white text-xs font-bold hover:bg-accent hover:text-navy transition shadow-xs cursor-pointer"
          >
            <span>Book a Dive</span>
            <span>→</span>
          </Link>
        </div>

        <div className="max-w-3xl">
          <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-accent bg-accent/10 px-3 py-1 rounded-full mb-2">
            Global Dive Directory
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl font-bold text-navy tracking-tight leading-tight">
            Dive Explorer
          </h1>
          <p className="mt-2 text-sm sm:text-base text-navy/70 leading-relaxed">
            Search and explore over 3,500 dive sites around the globe on an interactive 2D world map. Click on any cluster or marker to view exact coordinates, marine environments, and planning resources.
          </p>
        </div>
      </div>

      {/* Map Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <DiveExplorerMap
          onSelectSite={setSelectedSite}
          onBookSite={handleBookSite}
          title="Worldwide Dive Site Explorer"
          subtitle="Interactive flat 2D map with zoom, cluster navigation, and geographic filters"
          showHeading={false}
        />
      </div>
    </div>
  )
}
