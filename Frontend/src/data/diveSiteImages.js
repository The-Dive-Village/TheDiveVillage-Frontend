// Import authentic gallery underwater, reef, creature, and dive photos
import img86440 from '../assets/Gallery/Photo00086440.jpg'
import img86448 from '../assets/Gallery/Photo00086448.jpg'
import img86450 from '../assets/Gallery/Photo00086450.jpg'
import img86451 from '../assets/Gallery/Photo00086451.jpg'
import img86454 from '../assets/Gallery/Photo00086454.jpg'
import img86476 from '../assets/Gallery/Photo00086476.jpg'
import img86485 from '../assets/Gallery/Photo00086485.jpg'
import img86509 from '../assets/Gallery/Photo00086509.jpg'
import img86561 from '../assets/Gallery/Photo00086561.jpg'
import img86567 from '../assets/Gallery/Photo00086567.jpg'
import img86573 from '../assets/Gallery/Photo00086573.jpg'
import img86574 from '../assets/Gallery/Photo00086574.jpg'
import img86576 from '../assets/Gallery/Photo00086576.jpg'
import img86578 from '../assets/Gallery/Photo00086578.jpg'
import img86586 from '../assets/Gallery/Photo00086586.jpg'
import img86587 from '../assets/Gallery/Photo00086587.jpg'
import img86588 from '../assets/Gallery/Photo00086588.jpg'
import img86611 from '../assets/Gallery/Photo00086611.jpg'
import img86694 from '../assets/Gallery/Photo00086694.jpg'
import img86723 from '../assets/Gallery/Photo00086723.jpg'
import img86726 from '../assets/Gallery/Photo00086726.jpg'
import img86738 from '../assets/Gallery/Photo00086738.jpg'
import img86739 from '../assets/Gallery/Photo00086739.jpg'
import img86742 from '../assets/Gallery/Photo00086742.jpg'
import img86760 from '../assets/Gallery/Photo00086760.jpg'
import img86761 from '../assets/Gallery/Photo00086761.jpg'
import img86765 from '../assets/Gallery/Photo00086765.jpg'
import img86771 from '../assets/Gallery/Photo00086771.jpg'
import img86776 from '../assets/Gallery/Photo00086776.jpg'
import img86787 from '../assets/Gallery/Photo00086787.jpg'
import img86792 from '../assets/Gallery/Photo00086792.jpg'

// Special Dive Life & Landmark Images from Gallery
import imgSeaFan from '../assets/Media/Extras for Gallery/Sea fan.webp'
import imgBlueLincka from '../assets/Media/Extras for Gallery/Blue Lincka.webp'
import imgCrownOfThorns from '../assets/Gallery/Crown of thorns.JPG'
import imgThornyOyster from '../assets/Media/Extras for Gallery/Thorny Oyster.webp'
import imgArticulata from '../assets/Media/Extras for Gallery/Articulata.webp'
import imgShoal from '../assets/Media/Extras for Gallery/Shoal.webp'
import imgNightdive from '../assets/Gallery/Nightdive.jpg'
import imgScuba1 from '../assets/Gallery/Scuba1.jpg'
import imgScuba2 from '../assets/Gallery/Scuba2.jpg'
import imgScuba3 from '../assets/Gallery/Scuba3.jpg'
import imgScuba4 from '../assets/Gallery/Scuba4.jpg'
import imgScuba5 from '../assets/Gallery/Scuba5.jpg'
import imgScubadiving from '../assets/Media/Extras for Gallery/Scubadiving.webp'
import imgFreeDiving from '../assets/Gallery/Free Diving.jpg'
import imgFreeDiving2 from '../assets/Gallery/Free Diving (2).jpg'
import imgFreeDivingPng from '../assets/Media/Services Thumbnails/Free Diving.webp'
import imgSnorkelingPng from '../assets/Media/Services Thumbnails/Snorkeling.webp'
import imgIntroProg from '../assets/Media/Services Thumbnails/Introductory Programs.webp'
import imgCertCourses from '../assets/Media/Services Thumbnails/Certified Courses.webp'
import imgFlexFunDives from '../assets/Media/Services Thumbnails/Flexible Fun Dives.webp'
import imgSky1 from '../assets/Gallery/Sky1.jpg'
import img5 from '../assets/Gallery/5.jpg'
import img6 from '../assets/Gallery/6.jpg'
import img7 from '../assets/Gallery/7.jpg'
import img8 from '../assets/Gallery/8.jpg'
import imgZero2Hero from '../assets/Gallery/zero2hero.jpg'

export const DEFAULT_DIVE_IMAGE = img86440

/**
 * Structured Profiles for Marine Encounters & Diverse Dive Habitats
 */
export const CREATURE_PROFILES = {
  // --- Turtles & Shallow Reef ---
  turtle_hawksbill: {
    creatureName: 'Hawksbill Sea Turtle',
    species: 'Eretmochelys imbricata',
    category: 'turtle',
    image: img86440,
    description: 'Cruising shallow coral ridges and feeding on sponges.'
  },
  turtle_green: {
    creatureName: 'Green Sea Turtle',
    species: 'Chelonia mydas',
    category: 'turtle',
    image: img86448,
    description: 'Gracefully gliding along seagrass beds and outer reef slopes.'
  },
  turtle_reef: {
    creatureName: 'Reef Sea Turtle',
    species: 'Chelonia mydas',
    category: 'turtle',
    image: img86450,
    description: 'Resident turtle resting under coral overhangs.'
  },
  turtle_loggerhead: {
    creatureName: 'Loggerhead Sea Turtle',
    species: 'Caretta caretta',
    category: 'turtle',
    image: img86454,
    description: 'Powerful oceanic turtle navigating deeper reef channels.'
  },
  turtle_lagoon: {
    creatureName: 'Lagoon Sea Turtle',
    species: 'Caretta caretta',
    category: 'turtle',
    image: img86726,
    description: 'Feeding in crystal clear turquoise lagoon shallows.'
  },

  // --- Mantas, Rays & Pelagics ---
  manta_oceanic: {
    creatureName: 'Oceanic Manta Ray',
    species: 'Mobula birostris',
    category: 'manta',
    image: img86567,
    description: 'Gliding along open ocean currents and deep cleaning stations.'
  },
  manta_reef: {
    creatureName: 'Reef Manta Ray',
    species: 'Mobula alfredi',
    category: 'manta',
    image: imgScuba2,
    description: 'Circling shallow pinnacle cleaning stations with wing spans up to 4 meters.'
  },
  ray_eagle: {
    creatureName: 'Spotted Eagle Ray',
    species: 'Aetobatus narinari',
    category: 'manta',
    image: img86576,
    description: 'Soaring in formations along current-swept outer walls.'
  },
  pelagic_shoal: {
    creatureName: 'Baitball & Schooling Jacks',
    species: 'Caranx ignobilis',
    category: 'pelagic',
    image: imgShoal,
    description: 'Massive vortex of schooling pelagics swirling in blue water.'
  },
  pelagic_barracuda: {
    creatureName: 'Chevron Barracuda',
    species: 'Sphyraena qenie',
    category: 'pelagic',
    image: img86586,
    description: 'Tightly packed spiral tornadoes of hunting barracuda.'
  },
  pelagic_trevally: {
    creatureName: 'Giant Trevally Pack',
    species: 'Caranx ignobilis',
    category: 'pelagic',
    image: imgFlexFunDives,
    description: 'Apex predators patrolling the edge of deep drop-offs.'
  },

  // --- Sharks ---
  shark_whale: {
    creatureName: 'Whale Shark',
    species: 'Rhincodon typus',
    category: 'shark',
    image: img86742,
    description: 'Gentle giant filter feeding on plankton in open sea passages.'
  },
  shark_reef: {
    creatureName: 'Grey Reef Shark',
    species: 'Carcharhinus amblyrhynchos',
    category: 'shark',
    image: img86738,
    description: 'Patrolling outer reef ridges and deep current passes.'
  },
  shark_whitetip: {
    creatureName: 'Whitetip Reef Shark',
    species: 'Triaenodon obesus',
    category: 'shark',
    image: img86611,
    description: 'Resting on sandy channels and patrolling cavern entrances.'
  },

  // --- Corals & Coral Gardens ---
  coral_seafan: {
    creatureName: 'Gorgonian Sea Fan',
    species: 'Annella mollis',
    category: 'coral',
    image: imgSeaFan,
    description: 'Towering multi-meter sea fans blooming in moderate current.'
  },
  coral_reef_garden: {
    creatureName: 'Pristine Coral Garden',
    species: 'Acropora & Porites',
    category: 'coral',
    image: img86451,
    description: 'Vibrant kaleidoscope of hard corals teeming with anthias.'
  },
  coral_staghorn: {
    creatureName: 'Staghorn Coral Reef',
    species: 'Acropora cervicornis',
    category: 'coral',
    image: img86485,
    description: 'Lush coral branches providing nursery grounds for juvenile marine life.'
  },
  coral_table: {
    creatureName: 'Table Coral Formations',
    species: 'Acropora cytherea',
    category: 'coral',
    image: img86509,
    description: 'Wide horizontal table coral terraces cascading down reef slopes.'
  },
  coral_sanctuary: {
    creatureName: 'Coral Atoll Sanctuary',
    species: 'Scleractinia',
    category: 'coral',
    image: img86561,
    description: 'Thriving protected coral ecosystem with exceptional biodiversity.'
  },
  coral_multilevel: {
    creatureName: 'Multi-Level Coral Ridge',
    species: 'Acropora Formosa',
    category: 'coral',
    image: img86578,
    description: 'Layered coral shelves supporting diverse tropical fish communities.'
  },
  coral_plate: {
    creatureName: 'Hard Coral Terrace',
    species: 'Turbinaria mesenterina',
    category: 'coral',
    image: img86587,
    description: 'Tiered overlapping plate corals glowing under crystal sunlight.'
  },
  coral_offshore: {
    creatureName: 'Offshore Coral Bank',
    species: 'Deep Coral Atoll',
    category: 'coral',
    image: img86694,
    description: 'Pristine isolated coral reef far from coastal waters.'
  },
  coral_pinnacle: {
    creatureName: 'Submerged Coral Pinnacle',
    species: 'Reef Pinnacle',
    category: 'coral',
    image: img86776,
    description: 'Dramatic underwater seamount rising from deep seabed toward the surface.'
  },
  coral_tropical: {
    creatureName: 'Tropical Coral Archipelago',
    species: 'Porites Lutea',
    category: 'coral',
    image: img86792,
    description: 'Vibrant coral formations in clear azure sea water.'
  },
  coral_bouquet: {
    creatureName: 'Soft Coral Bloom',
    species: 'Dendronephthya',
    category: 'coral',
    image: img7,
    description: 'Fluorescent pink and purple soft corals expanding in rich tidal flow.'
  },
  coral_brain: {
    creatureName: 'Giant Brain Coral',
    species: 'Diploria labyrinthiformis',
    category: 'coral',
    image: img5,
    description: 'Centuries-old boulder corals with intricate grooved patterns.'
  },
  coral_terrace: {
    creatureName: 'Outer Reef Terrace',
    species: 'Montipora capricornis',
    category: 'coral',
    image: img86771,
    description: 'Expansive coral ridge sloping into the indigo depths.'
  },
  coral_patch: {
    creatureName: 'Lagoon Coral Patch',
    species: 'Faviidae',
    category: 'coral',
    image: img8,
    description: 'Sheltered coral bommies surrounded by white sand.'
  },

  // --- Invertebrates & Macro Life ---
  macro_blue_star: {
    creatureName: 'Blue Linckia Starfish',
    species: 'Linckia laevigata',
    category: 'macro',
    image: imgBlueLincka,
    description: 'Brilliant cobalt blue sea star resting across sunlit hard corals.'
  },
  macro_crown_thorns: {
    creatureName: 'Crown-of-Thorns Sea Star',
    species: 'Acanthaster planci',
    category: 'macro',
    image: imgCrownOfThorns,
    description: 'Large spiny sea star nestled within deep coral crevasses.'
  },
  macro_thorny_oyster: {
    creatureName: 'Thorny Oyster & Sponges',
    species: 'Spondylus varius',
    category: 'macro',
    image: imgThornyOyster,
    description: 'Spectacular bivalve mollusk encrusted with colorful encrusting sponges.'
  },
  macro_crinoid: {
    creatureName: 'Feather Star Crinoid',
    species: 'Comanthina nobilis',
    category: 'macro',
    image: imgArticulata,
    description: 'Delicate feather star perched on coral branches catching currents.'
  },

  // --- Wrecks & Artificial Reefs ---
  wreck_historic: {
    creatureName: 'Historic Ocean Shipwreck',
    species: 'Artificial Reef Ecosystem',
    category: 'wreck',
    image: img86573,
    description: 'Encrusted hull and cargo holds teeming with lionfish, groupers, and glassfish.'
  },
  wreck_explorer: {
    creatureName: 'Deep Wreck & Marine Corridor',
    species: 'Deep Wreck Habitat',
    category: 'wreck',
    image: img86742,
    description: 'Atmospheric shipwreck standing upright on clear sandy seabed.'
  },
  wreck_corridor: {
    creatureName: 'Wreck Superstructure',
    species: 'Wreck Biomass',
    category: 'wreck',
    image: img86760,
    description: 'Penetration-friendly wreck passageways shrouded in schooling baitfish.'
  },
  wreck_chamber: {
    creatureName: 'Sunken Cargo Hold',
    species: 'Submerged Vessel',
    category: 'wreck',
    image: img6,
    description: 'Historical vessel encrusted in sponges and vibrant cup corals.'
  },

  // --- Walls & Drop-Offs ---
  wall_vertical: {
    creatureName: 'Vertical Coral Wall',
    species: 'Abyssal Wall Habitat',
    category: 'wall',
    image: img86787,
    description: 'Sheer vertical drop plunge from shallow crest into deep blue abyss.'
  },
  wall_dropoff: {
    creatureName: 'Deep Oceanic Drop-Off',
    species: 'Pelagic Wall',
    category: 'wall',
    image: img86738,
    description: 'Wall draped in black coral trees and visited by passing pelagics.'
  },
  wall_chasm: {
    creatureName: 'Reef Chasm & Wall',
    species: 'Deep Ridge',
    category: 'wall',
    image: imgScuba3,
    description: 'Majestic wall navigation with unlimited deep visibility.'
  },

  // --- Caverns, Caves & Blue Holes ---
  cavern_swimthru: {
    creatureName: 'Cavern & Swim-Through',
    species: 'Karst Cave Habitat',
    category: 'cavern',
    image: img86588,
    description: 'Light beams piercing through arches, tunnels, and overhead chambers.'
  },
  cavern_bluehole: {
    creatureName: 'Blue Hole & Submerged Chasm',
    species: 'Marine Sinkhole',
    category: 'cavern',
    image: img86611,
    description: 'Deep circular sinkhole surrounded by dramatic sheer limestone walls.'
  },
  cavern_cathedral: {
    creatureName: 'Underwater Cathedral',
    species: 'Sea Cave Chamber',
    category: 'cavern',
    image: img86574,
    description: 'Sunlight curtains illuminating massive underwater chambers.'
  },

  // --- Coastal & Surf Breaks ---
  coastal_surf_break: {
    creatureName: 'Reef Break & Surf Crest',
    species: 'Coastal Reef Formation',
    category: 'coastal',
    image: img86761,
    description: 'Ocean swells breaking cleanly over outer coral barrier reef.'
  },
  coastal_lagoon: {
    creatureName: 'Island Lagoon Sanctuary',
    species: 'Protected Atoll Lagoon',
    category: 'coastal',
    image: img86765,
    description: 'Calm sheltered lagoon surrounded by emerald tropical islands.'
  },

  // --- Night Diving ---
  night_nocturnal: {
    creatureName: 'Bioluminescent Night Reef',
    species: 'Nocturnal Marine Life',
    category: 'night',
    image: imgNightdive,
    description: 'Hunting morays, basket stars, and glowing bioluminescence after sunset.'
  },
  night_critters: {
    creatureName: 'Night Dive Creature Safari',
    species: 'Nocturnal Ecosystem',
    category: 'night',
    image: img86723,
    description: 'Sleeping parrotfish in mucus cocoons and wandering octopus.'
  },

  // --- Freediving & Skin Diving ---
  freedive_depth: {
    creatureName: 'Blue Water Freediving',
    species: 'Breath-Hold Diving',
    category: 'freedive',
    image: imgFreeDiving,
    description: 'Exploring profound silence and deep connection on a single breath.'
  },
  freedive_reef: {
    creatureName: 'Reef Skin Diving',
    species: 'Coastal Apnea',
    category: 'freedive',
    image: img86476,
    description: 'Effortless single-breath glides over coral ridges and sea turtles.'
  },
  freedive_flow: {
    creatureName: 'Open Ocean Apnea',
    species: 'Deep Blue Freedive',
    category: 'freedive',
    image: imgFreeDiving2,
    description: 'Weightless descent alongside pelagic marine creatures.'
  },
  freedive_training: {
    creatureName: 'Freedive Line & Depth Training',
    species: 'Apnea Training Line',
    category: 'freedive',
    image: imgFreeDivingPng,
    description: 'Structured freediving depth training over deep calm waters.'
  },
  snorkeling_shallow: {
    creatureName: 'Shallow Snorkeling Reef',
    species: 'Lagoon Coral Life',
    category: 'snorkeling',
    image: imgSnorkelingPng,
    description: 'Sunlit calm water snorkeling with vibrant butterflyfish and damselfish.'
  },

  // --- Scuba Exploration & Expeditions ---
  scuba_guided: {
    creatureName: 'Guided Reef Exploration',
    species: 'Scuba Expedition',
    category: 'scuba',
    image: imgScuba1,
    description: 'Guided scuba diving expedition discovering hidden reef wonders.'
  },
  scuba_deep: {
    creatureName: 'Deep Reef Adventure',
    species: 'Deep Scuba Dive',
    category: 'scuba',
    image: imgScuba4,
    description: 'Exploring multi-level dive topography with optimal buoyancy.'
  },
  scuba_team: {
    creatureName: 'Diver Buddy Team',
    species: 'Ocean Adventure',
    category: 'scuba',
    image: imgScubadiving,
    description: 'Buddy pairs navigating world-class pristine dive destinations.'
  },
  scuba_certified: {
    creatureName: 'Certified Dive Passage',
    species: 'Open Ocean Scuba',
    category: 'scuba',
    image: imgCertCourses,
    description: 'Drifting along outer reef boundaries with schooling fish.'
  },
  scuba_openwater: {
    creatureName: 'Open Water Diver Exploration',
    species: 'Reef Scuba Diving',
    category: 'scuba',
    image: imgScuba5,
    description: 'Divers gliding over pristine coral fields in warm tropical waters.'
  },
  scuba_intro: {
    creatureName: 'Discover Scuba Experience',
    species: 'Introductory Dive',
    category: 'scuba',
    image: imgIntroProg,
    description: 'First breaths underwater exploring calm coral lagoons.'
  },
  scuba_pro: {
    creatureName: 'Pro Divemaster Leading',
    species: 'Professional Dive Track',
    category: 'scuba',
    image: img86739,
    description: 'Experienced dive leader navigating underwater passages.'
  },
  scuba_dawn: {
    creatureName: 'Dawn Reef Wake',
    species: 'Early Morning Dive',
    category: 'scuba',
    image: imgSky1,
    description: 'First light over tranquil ocean waters before active reef feeding begins.'
  },
  scuba_expedition: {
    creatureName: 'Zero to Hero Expedition',
    species: 'Ocean Explorer',
    category: 'scuba',
    image: imgZero2Hero,
    description: 'Comprehensive diving expedition exploring uncharted dive grounds.'
  }
}

// Full array of all distinct creature profiles for high-entropy fallback
const ALL_CREATURES = Object.values(CREATURE_PROFILES)

// Category specific image pools for accurate keyword and habitat matching
const CATEGORY_POOLS = {
  turtle: [
    CREATURE_PROFILES.turtle_hawksbill,
    CREATURE_PROFILES.turtle_green,
    CREATURE_PROFILES.turtle_reef,
    CREATURE_PROFILES.turtle_loggerhead,
    CREATURE_PROFILES.turtle_lagoon
  ],
  manta: [
    CREATURE_PROFILES.manta_oceanic,
    CREATURE_PROFILES.manta_reef,
    CREATURE_PROFILES.ray_eagle
  ],
  shark: [
    CREATURE_PROFILES.shark_whale,
    CREATURE_PROFILES.shark_reef,
    CREATURE_PROFILES.shark_whitetip
  ],
  pelagic: [
    CREATURE_PROFILES.pelagic_shoal,
    CREATURE_PROFILES.pelagic_barracuda,
    CREATURE_PROFILES.pelagic_trevally
  ],
  coral: [
    CREATURE_PROFILES.coral_seafan,
    CREATURE_PROFILES.coral_reef_garden,
    CREATURE_PROFILES.coral_staghorn,
    CREATURE_PROFILES.coral_table,
    CREATURE_PROFILES.coral_sanctuary,
    CREATURE_PROFILES.coral_multilevel,
    CREATURE_PROFILES.coral_plate,
    CREATURE_PROFILES.coral_offshore,
    CREATURE_PROFILES.coral_pinnacle,
    CREATURE_PROFILES.coral_tropical,
    CREATURE_PROFILES.coral_bouquet,
    CREATURE_PROFILES.coral_brain,
    CREATURE_PROFILES.coral_terrace,
    CREATURE_PROFILES.coral_patch
  ],
  macro: [
    CREATURE_PROFILES.macro_blue_star,
    CREATURE_PROFILES.macro_crown_thorns,
    CREATURE_PROFILES.macro_thorny_oyster,
    CREATURE_PROFILES.macro_crinoid
  ],
  wreck: [
    CREATURE_PROFILES.wreck_historic,
    CREATURE_PROFILES.wreck_explorer,
    CREATURE_PROFILES.wreck_corridor,
    CREATURE_PROFILES.wreck_chamber
  ],
  wall: [
    CREATURE_PROFILES.wall_vertical,
    CREATURE_PROFILES.wall_dropoff,
    CREATURE_PROFILES.wall_chasm,
    CREATURE_PROFILES.coral_seafan
  ],
  cavern: [
    CREATURE_PROFILES.cavern_swimthru,
    CREATURE_PROFILES.cavern_bluehole,
    CREATURE_PROFILES.cavern_cathedral
  ],
  coastal: [
    CREATURE_PROFILES.coastal_surf_break,
    CREATURE_PROFILES.coastal_lagoon
  ],
  night: [
    CREATURE_PROFILES.night_nocturnal,
    CREATURE_PROFILES.night_critters
  ],
  freedive: [
    CREATURE_PROFILES.freedive_depth,
    CREATURE_PROFILES.freedive_reef,
    CREATURE_PROFILES.freedive_flow,
    CREATURE_PROFILES.freedive_training
  ],
  snorkeling: [
    CREATURE_PROFILES.snorkeling_shallow,
    CREATURE_PROFILES.turtle_lagoon,
    CREATURE_PROFILES.coral_reef_garden
  ],
  scuba: [
    CREATURE_PROFILES.scuba_guided,
    CREATURE_PROFILES.scuba_deep,
    CREATURE_PROFILES.scuba_team,
    CREATURE_PROFILES.scuba_certified,
    CREATURE_PROFILES.scuba_openwater,
    CREATURE_PROFILES.scuba_intro,
    CREATURE_PROFILES.scuba_pro,
    CREATURE_PROFILES.scuba_dawn,
    CREATURE_PROFILES.scuba_expedition
  ]
}

/**
 * Robust, high-entropy string hash generator (FNV-1a 32-bit).
 * Produces well-distributed pseudo-random integer keys for any dive site ID/name.
 */
const getConsistentHash = (str) => {
  let hash = 2166136261
  const s = String(str || '')
  for (let i = 0; i < s.length; i++) {
    hash ^= s.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return Math.abs(hash >>> 0)
}

/**
 * Famous Authoritative Dive Sites Overrides
 */
export const SITE_SPECIFIC_OVERRIDES = {
  // Crystal Bay (Nusa Penida, Indonesia - Coral garden & Mola Mola)
  '1822': CREATURE_PROFILES.coral_reef_garden,
  // Ped (Drift coral & sea turtles)
  '1826': CREATURE_PROFILES.turtle_green,
  // Manta Point (Indonesia)
  '3961': CREATURE_PROFILES.manta_reef,
  // USAT Liberty Shipwreck (Bali)
  '1511': CREATURE_PROFILES.wreck_historic,
  // Tulamben Wreck
  '8058': CREATURE_PROFILES.wreck_explorer,
  // Shark Point (Gili / Indonesia)
  '22988': CREATURE_PROFILES.shark_reef,
  // Great Blue Hole (Belize)
  '5507': CREATURE_PROFILES.cavern_bluehole,
  // The Aquarium (Belize)
  '5527': CREATURE_PROFILES.coral_staghorn,
  // Ben's Blue Hole (Bahamas)
  '2358': CREATURE_PROFILES.cavern_bluehole,
  // Carlisle Bay (Barbados - Historic Shipwrecks)
  '15695': CREATURE_PROFILES.wreck_historic,
  // Neptune Goddess (Barbados Wreck)
  '15533': CREATURE_PROFILES.wreck_chamber,
  // Lekuan 1, 2, 3 (Bunaken - Giant Sea Turtles & Vertical Coral Wall)
  '1084': CREATURE_PROFILES.turtle_hawksbill,
  // Magic Point (Australia - Sharks & Shoals)
  '6760': CREATURE_PROFILES.pelagic_shoal,
  // Blue Linckia Reef
  '4134': CREATURE_PROFILES.macro_blue_star
}

/**
 * Identify and return an authentic, highly varied, and accurate gallery image
 * and creature profile for a given dive site.
 *
 * @param {string|number} id The dive site ID
 * @param {object} [siteObj] Optional site object containing name, title, types, country, lat, lng
 * @returns {object} The creature profile { creatureName, species, category, image, description }
 */
export const getDiveSiteCreatureInfo = (id, siteObj = null) => {
  const strId = String(id || (siteObj && (siteObj.id || siteObj.padiId)) || '')

  // 1. Authoritative specific site override check
  if (strId && SITE_SPECIFIC_OVERRIDES[strId]) {
    return SITE_SPECIFIC_OVERRIDES[strId]
  }

  const rawName = (siteObj && (siteObj.title || siteObj.name)) || ''
  const url = (siteObj && siteObj.travel_url) || ''
  const name = `${rawName} ${url}`.toLowerCase()
  const types = ((siteObj && siteObj.types) || '').toLowerCase()
  const country = ((siteObj && siteObj.country) || '').toLowerCase()

  // Use combined unique identity string to generate high-entropy hash
  const hash = getConsistentHash(`${strId}_${rawName}_${country}_${siteObj?.lat || ''}_${siteObj?.lng || ''}`)

  // 2. Accurate Semantic Matching by Site Name & Environmental Dive Type

  // A. Wreck sites
  if (/wreck|naufragio|epave|ship|boat|barge|sub|destroyer|frigate|carrier|plane|cargo/i.test(name) || /wreck/i.test(types)) {
    const pool = CATEGORY_POOLS.wreck
    return pool[hash % pool.length]
  }

  // B. Shark sites
  if (/shark|tiburon|requin|squalo|haie|hammerhead|nurse shark|whale shark|blacktip|whitetip/i.test(name)) {
    const pool = CATEGORY_POOLS.shark
    return pool[hash % pool.length]
  }

  // C. Manta & Ray sites
  if (/manta|ray|stingray|eagle ray|mobula|raya|raie/i.test(name)) {
    const pool = CATEGORY_POOLS.manta
    return pool[hash % pool.length]
  }

  // D. Turtle sites
  if (/turtle|tortuga|tartaruga|chelonia|caretta|hawksbill|green turtle/i.test(name)) {
    const pool = CATEGORY_POOLS.turtle
    return pool[hash % pool.length]
  }

  // E. Blue Hole / Cave / Cavern / Cenote / Swim-through
  if (/blue hole|hole|cavern|cave|cenote|cueva|trou|grotto|arch|chimney|tunnel/i.test(name) || /cavern|cave/i.test(types)) {
    const pool = CATEGORY_POOLS.cavern
    return pool[hash % pool.length]
  }

  // F. Wall / Drop-off / Canyon
  if (/wall|drop|pared|falise|pinnacle|canyon|ridge/i.test(name) || /wall|pinnacle/i.test(types)) {
    const pool = CATEGORY_POOLS.wall
    return pool[hash % pool.length]
  }

  // G. Night dive sites
  if (/night|nocturne|noche/i.test(name) || /night/i.test(types)) {
    const pool = CATEGORY_POOLS.night
    return pool[hash % pool.length]
  }

  // H. Drift dive sites
  if (/drift|current|pass|channel/i.test(name) || /drift/i.test(types)) {
    const driftPool = [...CATEGORY_POOLS.manta, ...CATEGORY_POOLS.pelagic, ...CATEGORY_POOLS.coral]
    return driftPool[hash % driftPool.length]
  }

  // I. Macro & Critter sites
  if (/macro|muck|nudi|nudibranch|octopus|cuttlefish|seahorse|moray|eel|lobster|crab|critter|sand/i.test(name) || /muck/i.test(types)) {
    const pool = CATEGORY_POOLS.macro
    return pool[hash % pool.length]
  }

  // J. Pelagics / Shoals / Barracuda
  if (/barracuda|trevally|jack|tuna|fusilier|snapper|school|pelagic|shoal|baitball/i.test(name)) {
    const pool = CATEGORY_POOLS.pelagic
    return pool[hash % pool.length]
  }

  // K. Coral gardens & reefs
  if (/garden|coral|jardin|reef|arrecife|bommie|barrier|atoll/i.test(name) || /reef/i.test(types)) {
    const coralPool = [
      ...CATEGORY_POOLS.coral,
      ...CATEGORY_POOLS.turtle,
      ...CATEGORY_POOLS.macro
    ]
    return coralPool[hash % coralPool.length]
  }

  // L. Snorkeling sites
  if (/snorkel/i.test(name) || /snorkel/i.test(types)) {
    const pool = CATEGORY_POOLS.snorkeling
    return pool[hash % pool.length]
  }

  // 3. High-entropy diverse pool fallback ensuring distinct random photos across every location
  return ALL_CREATURES[hash % ALL_CREATURES.length] || CREATURE_PROFILES.coral_reef_garden
}

/**
 * Get image URL for a dive site by its unique ID and optional site metadata.
 * @param {string|number} id The dive site ID
 * @param {object} [siteObj] Optional dive site object
 * @returns {string} The image URL of the creature/dive living at this location
 */
export const getDiveSiteImage = (id, siteObj = null) => {
  const creature = getDiveSiteCreatureInfo(id, siteObj)
  return creature?.image || DEFAULT_DIVE_IMAGE
}

/**
 * Backward compatibility dictionary mapping
 */
export const DIVE_SITE_IMAGES = SITE_SPECIFIC_OVERRIDES

export default {
  getDiveSiteImage,
  getDiveSiteCreatureInfo,
  CREATURE_PROFILES,
  DIVE_SITE_IMAGES,
  DEFAULT_DIVE_IMAGE
}
