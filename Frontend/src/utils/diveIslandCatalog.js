/**
 * Dive Island & Regional Hubs Catalog
 * 
 * Maps verified dive sites across worldwide destinations into authentic
 * islands, atolls, and coastal dive regions.
 */

export const POPULAR_ISLAND_REGIONS = {
  'Philippines': [
    { name: 'Cebu (Moalboal & Malapascua)', lat: 9.95, lng: 123.36 },
    { name: 'Bohol (Panglao & Cabilao)', lat: 9.6, lng: 123.8 },
    { name: 'Coron & Busuanga', lat: 12.0, lng: 120.0 },
    { name: 'El Nido & Bacuit Bay', lat: 11.2, lng: 119.4 },
    { name: 'Puerto Galera & Mindoro', lat: 13.5, lng: 120.95 },
    { name: 'Dauin & Apo Island (Negros)', lat: 9.2, lng: 123.25 },
    { name: 'Boracay Island', lat: 11.97, lng: 121.92 },
    { name: 'Anilao & Batangas', lat: 13.75, lng: 120.9 },
    { name: 'Tubbataha Reefs', lat: 8.9, lng: 119.9 },
    { name: 'Leyte (Sogod Bay)', lat: 10.2, lng: 125.0 },
    { name: 'Romblon & Tablas', lat: 12.5, lng: 122.2 },
    { name: 'Subic Bay & Zambales', lat: 14.8, lng: 120.25 },
    { name: 'Siargao Island', lat: 9.85, lng: 126.05 },
  ],
  'Indonesia': [
    { name: 'Bali (Tulamben & Amed)', lat: -8.3, lng: 115.5 },
    { name: 'Nusa Penida & Lembongan', lat: -8.7, lng: 115.5 },
    { name: 'Gili Islands & Lombok', lat: -8.35, lng: 116.05 },
    { name: 'Komodo National Park', lat: -8.6, lng: 119.6 },
    { name: 'Raja Ampat (Papua)', lat: -0.5, lng: 130.5 },
    { name: 'Bunaken & Manado', lat: 1.6, lng: 124.75 },
    { name: 'Lembeh Strait', lat: 1.45, lng: 125.25 },
    { name: 'Alor Archipelago', lat: -8.2, lng: 124.5 },
    { name: 'Banda Islands', lat: -4.5, lng: 129.9 },
    { name: 'Wakatobi', lat: -5.3, lng: 123.6 },
    { name: 'Derawan & Sangalaki', lat: 2.2, lng: 118.2 },
    { name: 'Pulau Weh (Aceh)', lat: 5.85, lng: 95.3 },
    { name: 'Seribu Islands (Jakarta)', lat: -5.6, lng: 106.55 },
  ],
  'Maldives': [
    { name: 'North Malé Atoll', lat: 4.4, lng: 73.5 },
    { name: 'South Malé Atoll', lat: 3.95, lng: 73.45 },
    { name: 'Ari Atoll (North & South Ari)', lat: 3.8, lng: 72.85 },
    { name: 'Baa Atoll (Hanifaru Bay)', lat: 5.15, lng: 73.05 },
    { name: 'Rasdhoo Atoll', lat: 4.26, lng: 72.99 },
    { name: 'Vaavu Atoll', lat: 3.55, lng: 73.55 },
    { name: 'Lhaviyani Atoll', lat: 5.4, lng: 73.5 },
    { name: 'Raa & Noonu Atolls', lat: 5.75, lng: 73.15 },
    { name: 'Dhaalu & Faafu Atolls', lat: 3.0, lng: 73.0 },
    { name: 'Meemu & Thaa Atolls', lat: 2.5, lng: 73.4 },
    { name: 'Fuvahmulah & Addu Atoll', lat: -0.4, lng: 73.2 },
  ],
  'Thailand': [
    { name: 'Koh Tao & Chumphon', lat: 10.1, lng: 99.83 },
    { name: 'Phuket & Racha Islands', lat: 7.7, lng: 98.35 },
    { name: 'Similan & Surin Islands', lat: 8.65, lng: 97.65 },
    { name: 'Phi Phi Islands & Krabi', lat: 7.74, lng: 98.77 },
    { name: 'Koh Samui & Koh Phangan', lat: 9.6, lng: 100.0 },
    { name: 'Koh Lanta & Hin Daeng', lat: 7.4, lng: 99.0 },
    { name: 'Pattaya & Koh Chang', lat: 12.4, lng: 101.5 },
  ],
  'Egypt': [
    { name: 'Sharm El Sheikh (Ras Mohammed)', lat: 27.85, lng: 34.3 },
    { name: 'Hurghada & El Gouna', lat: 27.25, lng: 33.85 },
    { name: 'Dahab (Blue Hole & Canyon)', lat: 28.5, lng: 34.5 },
    { name: 'Marsa Alam & Elphinstone', lat: 25.1, lng: 34.9 },
    { name: 'Brother Islands & Deep South', lat: 26.3, lng: 34.85 },
  ],
  'Australia': [
    { name: 'Cairns & Port Douglas (Great Barrier Reef)', lat: -16.8, lng: 146.0 },
    { name: 'Whitsundays (Great Barrier Reef)', lat: -20.1, lng: 149.0 },
    { name: 'Ningaloo Reef & Exmouth', lat: -22.0, lng: 114.0 },
    { name: 'Lord Howe Island', lat: -31.55, lng: 159.08 },
    { name: 'Rowley Shoals', lat: -17.3, lng: 119.3 },
    { name: 'Moreton Island & Brisbane', lat: -27.2, lng: 153.4 },
    { name: 'Rottnest Island (Perth)', lat: -32.0, lng: 115.5 },
  ],
  'Spain': [
    { name: 'Tenerife (Canary Islands)', lat: 28.25, lng: -16.6 },
    { name: 'Gran Canaria (Canary Islands)', lat: 27.95, lng: -15.6 },
    { name: 'Lanzarote (Canary Islands)', lat: 29.0, lng: -13.65 },
    { name: 'Fuerteventura (Canary Islands)', lat: 28.35, lng: -14.05 },
    { name: 'La Palma & El Hierro', lat: 28.6, lng: -17.85 },
    { name: 'Mallorca (Balearic Islands)', lat: 39.6, lng: 2.9 },
    { name: 'Ibiza & Formentera', lat: 38.95, lng: 1.4 },
    { name: 'Menorca (Balearic Islands)', lat: 39.95, lng: 4.1 },
    { name: 'Costa Brava & Medes Islands', lat: 42.05, lng: 3.2 },
    { name: 'Cabo de Palos & Costa Blanca', lat: 37.6, lng: -0.7 },
  ],
  'Mexico': [
    { name: 'Cozumel Island', lat: 20.4, lng: -86.95 },
    { name: 'Riviera Maya & Cenotes', lat: 20.6, lng: -87.05 },
    { name: 'Cancun & Isla Mujeres', lat: 21.2, lng: -86.75 },
    { name: 'Socorro & Revillagigedo', lat: 18.8, lng: -110.9 },
    { name: 'Cabo Pulmo & Baja California', lat: 23.45, lng: -109.4 },
    { name: 'La Paz & Sea of Cortez', lat: 24.3, lng: -110.3 },
  ],
  'Cape Verde': [
    { name: 'São Vicente', lat: 16.85, lng: -25.0 },
    { name: 'Sal Island', lat: 16.75, lng: -22.9 },
    { name: 'Boa Vista', lat: 16.15, lng: -22.85 },
    { name: 'Santo Antão', lat: 17.05, lng: -25.15 },
    { name: 'Santiago', lat: 15.05, lng: -23.6 },
  ],
  'Malaysia': [
    { name: 'Sipadan, Mabul & Kapalai (Borneo)', lat: 4.25, lng: 118.6 },
    { name: 'Tioman Island', lat: 2.8, lng: 104.15 },
    { name: 'Perhentian Islands', lat: 5.9, lng: 102.75 },
    { name: 'Redang Island', lat: 5.77, lng: 103.0 },
    { name: 'Layang Layang Atoll', lat: 7.37, lng: 113.84 },
    { name: 'Langkawi', lat: 6.35, lng: 99.8 },
  ],
  'Fiji': [
    { name: 'Taveuni & Rainbow Reef', lat: -16.8, lng: -179.95 },
    { name: 'Beqa Lagoon & Shark Reef', lat: -18.4, lng: 178.1 },
    { name: 'Mamanuca & Yasawa Islands', lat: -17.5, lng: 177.1 },
    { name: 'Kadavu & Astrolabe Reef', lat: -18.9, lng: 178.3 },
    { name: 'Bligh Water & Suncoast', lat: -17.2, lng: 178.3 },
  ],
  'Belize': [
    { name: 'Lighthouse Reef & Blue Hole', lat: 17.3, lng: -87.55 },
    { name: 'Ambergris Caye & Hol Chan', lat: 17.9, lng: -87.95 },
    { name: 'Turneffe Atoll', lat: 17.3, lng: -87.85 },
    { name: 'Glover’s Reef Atoll', lat: 16.8, lng: -87.8 },
  ],
  'Costa Rica': [
    { name: 'Cocos Island', lat: 5.53, lng: -87.05 },
    { name: 'Caño Island & Drake Bay', lat: 8.7, lng: -83.88 },
    { name: 'Catalina & Bat Islands', lat: 10.5, lng: -85.8 },
    { name: 'Golfo Dulce', lat: 8.5, lng: -83.4 },
  ],
  'Italy': [
    { name: 'Sicily & Aeolian Islands', lat: 38.2, lng: 15.0 },
    { name: 'Sardinia (Maddalena & Tavolara)', lat: 40.9, lng: 9.5 },
    { name: 'Elba & Tuscan Archipelago', lat: 42.75, lng: 10.3 },
    { name: 'Capri & Ischia (Bay of Naples)', lat: 40.6, lng: 14.1 },
    { name: 'Portofino & Liguria', lat: 44.3, lng: 9.2 },
  ],
  'Greece': [
    { name: 'Cyclades (Santorini, Mykonos, Paros)', lat: 36.9, lng: 25.3 },
    { name: 'Crete Island', lat: 35.3, lng: 24.5 },
    { name: 'Ionian Islands (Corfu, Zakynthos)', lat: 38.5, lng: 20.6 },
    { name: 'Rhodes & Dodecanese', lat: 36.3, lng: 28.0 },
  ],
  'Malta': [
    { name: 'Malta Island (Valletta & Cirkewwa)', lat: 35.9, lng: 14.4 },
    { name: 'Gozo & Comino (Blue Hole)', lat: 36.05, lng: 14.25 },
  ],
  'Sri Lanka': [
    { name: 'Mirissa & Weligama', lat: 5.94, lng: 80.46 },
    { name: 'Hikkaduwa & Galle', lat: 6.13, lng: 80.1 },
    { name: 'Trincomalee (Pigeon Island)', lat: 8.6, lng: 81.2 },
    { name: 'Colombo (Shipwrecks)', lat: 6.95, lng: 79.8 },
  ],
  'South Africa': [
    { name: 'Aliwal Shoal (Umkomaas)', lat: -30.28, lng: 30.82 },
    { name: 'Protea Banks (Shelly Beach)', lat: -30.84, lng: 30.48 },
    { name: 'Sodwana Bay', lat: -27.54, lng: 32.68 },
    { name: 'False Bay & Cape Town', lat: -34.15, lng: 18.5 },
  ],
  'United States of America (USA)': [
    { name: 'Florida Keys (Key Largo & Key West)', lat: 24.8, lng: -80.7 },
    { name: 'Hawaii (Oahu, Maui, Kona)', lat: 20.5, lng: -157.0 },
    { name: 'California (Channel Islands & Monterey)', lat: 34.5, lng: -119.8 },
    { name: 'North Carolina (Graveyard of Atlantic)', lat: 34.7, lng: -76.6 },
  ],
  'Colombia': [
    { name: 'San Andrés & Providencia', lat: 12.55, lng: -81.7 },
    { name: 'Malpelo Island', lat: 4.0, lng: -81.6 },
    { name: 'Taganga & Tayrona', lat: 11.27, lng: -74.19 },
    { name: 'Gorgona Island', lat: 2.96, lng: -78.18 },
  ]
}

/**
 * Resolves the island or dive region for a given dive site.
 */
export function getIslandForSite(site) {
  if (!site) return 'Main Island'
  const country = site.country || ''
  const lat = parseFloat(site.latitude)
  const lng = parseFloat(site.longitude)
  const siteName = (site.siteName || '').toLowerCase()

  // 1. Direct site name token detection for island name (e.g. "Ponta Canjana - São Vicente")
  if (siteName.includes(' - ')) {
    const afterHyphen = site.siteName.split(' - ')[1]
    if (afterHyphen) {
      const cleanIsland = afterHyphen.split(',')[0].trim()
      if (cleanIsland.length > 2 && cleanIsland.length < 30) {
        return cleanIsland
      }
    }
  }

  // 2. Check predefined regional hubs for the country
  const hubs = POPULAR_ISLAND_REGIONS[country]
  if (hubs && hubs.length > 0 && !isNaN(lat) && !isNaN(lng)) {
    let bestHub = hubs[0].name
    let minDistance = Infinity

    for (const hub of hubs) {
      const dLat = lat - hub.lat
      const dLng = lng - hub.lng
      const distance = Math.hypot(dLat, dLng)
      if (distance < minDistance) {
        minDistance = distance
        bestHub = hub.name
      }
    }
    return bestHub
  }

  // 3. Fallback for single-island nations or generic coastal clusters
  const singleIslandTerritories = [
    'Aruba', 'Curaçao', 'Barbados', 'Bermuda', 'Cayman Islands', 'Bonaire',
    'Guam', 'Montserrat', 'Dominica', 'Anguilla', 'Saint Lucia'
  ]
  if (singleIslandTerritories.includes(country)) {
    return `${country} Island`
  }

  return `${country} Island & Coastal Sites`
}

/**
 * Returns a sorted array of unique islands / regions for a country with their site counts.
 */
export function getIslandsForCountry(country, allSites = []) {
  if (!country) return []
  const sitesInCountry = allSites.filter(
    (s) => s.country && s.country.toLowerCase() === country.toLowerCase()
  )
  if (sitesInCountry.length === 0) return []

  const islandMap = new Map()
  sitesInCountry.forEach((site) => {
    const island = getIslandForSite(site)
    islandMap.set(island, (islandMap.get(island) || 0) + 1)
  })

  return Array.from(islandMap.entries())
    .sort((a, b) => b[1] - a[1]) // Sort by most sites first
    .map(([island, count]) => ({
      name: island,
      count,
    }))
}

/**
 * Returns all dive site objects for a selected country and island.
 */
export function getSitesForIsland(country, island, allSites = []) {
  if (!country) return []
  const sitesInCountry = allSites.filter(
    (s) => s.country && s.country.toLowerCase() === country.toLowerCase()
  )
  if (!island) return sitesInCountry

  return sitesInCountry.filter((s) => getIslandForSite(s) === island)
}
