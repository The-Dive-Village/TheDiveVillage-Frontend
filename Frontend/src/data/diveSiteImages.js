// Import creature, coral, marine life, and dive site images
import panel4 from '../assets/panel4.jpeg'

// Carousel diving & coral scenes
import c1 from '../assets/Carosel/WhatsApp Image 2026-07-31 at 9.36.42 AM (1).jpeg'
import c2 from '../assets/Carosel/WhatsApp Image 2026-07-31 at 9.36.42 AM.jpeg'
import c3 from '../assets/Carosel/WhatsApp Image 2026-07-31 at 9.36.43 AM (1).jpeg'
import c4 from '../assets/Carosel/WhatsApp Image 2026-07-31 at 9.36.43 AM (2).jpeg'
import c5 from '../assets/Carosel/WhatsApp Image 2026-07-31 at 9.36.43 AM.jpeg'
import c6 from '../assets/Carosel/WhatsApp Image 2026-07-31 at 9.36.44 AM.jpeg'

// Identified Images from New Folder
import imgGallery1 from '../assets/New folder/Galleryimg1.jpg'
import scene1 from '../assets/New folder/Scene1.jpg'
import scene2 from '../assets/New folder/Scene2.jpg'
import scene3 from '../assets/New folder/Scene3.jpg'
import stayImg from '../assets/New folder/Stay.jpg'

// Marine Life & Creature identified photos
import life1 from '../assets/New folder/Life1.JPG'
import life2 from '../assets/New folder/Life2.JPG'
import life3 from '../assets/New folder/Life3.JPG'
import life4 from '../assets/New folder/Life4.JPG'
import life5 from '../assets/New folder/Life5.JPG'
import life6 from '../assets/New folder/Life6.JPG'
import life7 from '../assets/New folder/Life7.JPG'
import life8 from '../assets/New folder/Life8.JPG'
import life9 from '../assets/New folder/Life9.JPG'
import life10 from '../assets/New folder/Life10.JPG'
import life11 from '../assets/New folder/Life11.JPG'
import life12 from '../assets/New folder/Life12.JPG'
import life13 from '../assets/New folder/Life13.JPG'
import life14 from '../assets/New folder/Life14.JPG'
import life15 from '../assets/New folder/Life 15.JPG'
import life16 from '../assets/New folder/Life16.JPG'
import life17 from '../assets/New folder/Life17.JPG'
import life18 from '../assets/New folder/Life18.JPG'
import life20 from '../assets/New folder/Life20.JPG'
import life21 from '../assets/New folder/Life21.JPG'
import life22 from '../assets/New folder/Life22.JPG'
import life23 from '../assets/New folder/Life23.JPG'
import life24 from '../assets/New folder/Life24.JPG'
import life25 from '../assets/New folder/Life25.JPG'
import life26 from '../assets/New folder/Life26.JPG'
import life28 from '../assets/New folder/Life28.JPG'
import life29 from '../assets/New folder/Life29.JPG'
import life30 from '../assets/New folder/Life30.JPG'
import life31 from '../assets/New folder/Life31.JPG'
import life32 from '../assets/New folder/Life32.JPG'
import life33 from '../assets/New folder/Life33.JPG'
import life34 from '../assets/New folder/Life34.JPG'
import life35 from '../assets/New folder/Life35.JPG'
import life36 from '../assets/New folder/Life36.JPG'
import life37 from '../assets/New folder/Life37.JPG'
import life38 from '../assets/New folder/Life38.JPG'
import life39 from '../assets/New folder/Life39.JPG'
import life40 from '../assets/New folder/Life40.JPG'
import life41 from '../assets/New folder/Life41.JPG'
import life50 from '../assets/New folder/Life50.JPG'
import life51 from '../assets/New folder/Life51.JPG'
import life52 from '../assets/New folder/Life52.JPG'
import life53 from '../assets/New folder/Life 53.JPG'
import life54 from '../assets/New folder/Life54.JPG'
import life55 from '../assets/New folder/Life55.JPG'
import life56 from '../assets/New folder/Life56.JPG'
import life57 from '../assets/New folder/Life57.JPG'
import life58 from '../assets/New folder/Life58.JPG'
import life59 from '../assets/New folder/LIfe59.JPG'
import life60 from '../assets/New folder/Life60.JPG'
import life61 from '../assets/New folder/Life61.JPG'
import live63 from '../assets/New folder/Live63.JPG'
import life74 from '../assets/New folder/Life74.JPG'

/**
 * CREATURE & DIVE LIFE POOL
 * Structured profiles mapping identified images to real marine species, corals, and dive encounters.
 */
export const CREATURE_PROFILES = {
  // --- Sea Turtles ---
  turtle_hawksbill: {
    creatureName: 'Hawksbill Sea Turtle',
    species: 'Eretmochelys imbricata',
    category: 'turtle',
    image: panel4,
    description: 'Cruising shallow coral ridges and feeding on sponges.'
  },
  turtle_green: {
    creatureName: 'Green Sea Turtle',
    species: 'Chelonia mydas',
    category: 'turtle',
    image: life14,
    description: 'Gracefully gliding along seagrass beds and outer reef slopes.'
  },
  turtle_reef: {
    creatureName: 'Reef Sea Turtle',
    species: 'Chelonia mydas',
    category: 'turtle',
    image: life16,
    description: 'Resident turtle resting under coral overhangs.'
  },
  turtle_loggerhead: {
    creatureName: 'Loggerhead Turtle',
    species: 'Caretta caretta',
    category: 'turtle',
    image: life18,
    description: 'Deep reef explorer and coastal navigator.'
  },

  // --- Manta Rays & Rays ---
  manta_oceanic: {
    creatureName: 'Oceanic Manta Ray',
    species: 'Mobula birostris',
    category: 'manta',
    image: life1,
    description: 'Majestic pelagic giant soaring through cleaning stations.'
  },
  manta_reef: {
    creatureName: 'Reef Manta Ray',
    species: 'Mobula alfredi',
    category: 'manta',
    image: life5,
    description: 'Barrel-rolling over coral pinnacles in rich currents.'
  },
  ray_spotted: {
    creatureName: 'Spotted Eagle Ray',
    species: 'Aetobatus narinari',
    category: 'manta',
    image: life22,
    description: 'Sleek geometric winged ray cruising sandy channels.'
  },

  // --- Sharks ---
  shark_whale: {
    creatureName: 'Whale Shark',
    species: 'Rhincodon typus',
    category: 'shark',
    image: life3,
    description: 'Gentle oceanic filter-feeding giant in plankton-rich waters.'
  },
  shark_blacktip: {
    creatureName: 'Blacktip Reef Shark',
    species: 'Carcharhinus melanopterus',
    category: 'shark',
    image: life4,
    description: 'Vigilant coastal apex hunter patrolling shallow reefs.'
  },
  shark_whitetip: {
    creatureName: 'Whitetip Reef Shark',
    species: 'Triaenodon obesus',
    category: 'shark',
    image: life20,
    description: 'Resting in sandy caves and crevices during daylight.'
  },
  shark_nurse: {
    creatureName: 'Tawny Nurse Shark',
    species: 'Nebrius ferrugineus',
    category: 'shark',
    image: life21,
    description: 'Docile bottom-dwelling reef shark on sandy ledges.'
  },
  shark_hammerhead: {
    creatureName: 'Scalloped Hammerhead',
    species: 'Sphyrna lewini',
    category: 'shark',
    image: life24,
    description: 'Schooling hammerhead sharks in deep oceanic blue water.'
  },

  // --- Clownfish & Anemones ---
  clownfish_ocellaris: {
    creatureName: 'Clown Anemonefish',
    species: 'Amphiprion ocellaris',
    category: 'clownfish',
    image: life6,
    description: 'Vibrant orange anemonefish nestled within magnificent sea anemone tentacles.'
  },
  clownfish_tomato: {
    creatureName: 'Tomato Clownfish',
    species: 'Amphiprion frenatus',
    category: 'clownfish',
    image: life7,
    description: 'Fiery red resident defending its bulb-tentacle anemone host.'
  },
  clownfish_clarkii: {
    creatureName: "Clark's Anemonefish",
    species: 'Amphiprion clarkii',
    category: 'clownfish',
    image: life8,
    description: 'Hardy striped clownfish thriving across diverse coral gardens.'
  },
  clownfish_skunk: {
    creatureName: 'Pink Skunk Clownfish',
    species: 'Amphiprion perideraion',
    category: 'clownfish',
    image: life9,
    description: 'Delicate pink clownfish swimming above soft coral polyps.'
  },
  anemone_garden: {
    creatureName: 'Sea Anemone Colony',
    species: 'Heteractis magnifica',
    category: 'clownfish',
    image: life23,
    description: 'Flourishing anemone field teeming with symbiotic partner fish.'
  },

  // --- Schooling Pelagics, Jacks & Trevally ---
  pelagic_trevally: {
    creatureName: 'Giant Trevally School',
    species: 'Caranx ignobilis',
    category: 'pelagic',
    image: life10,
    description: 'Dynamic silver schools swirling along high-current drop-offs.'
  },
  pelagic_barracuda: {
    creatureName: 'Great Barracuda Whirlpool',
    species: 'Sphyraena barracuda',
    category: 'pelagic',
    image: life11,
    description: 'Hypnotic vortex of gleaming barracudas in clear blue currents.'
  },
  pelagic_jacks: {
    creatureName: 'Bigeye Jackfish Tornado',
    species: 'Caranx sexfasciatus',
    category: 'pelagic',
    image: life12,
    description: 'Dense schooling baitball circling around underwater pinnacles.'
  },
  pelagic_snapper: {
    creatureName: 'Blue-Striped Snappers',
    species: 'Lutjanus kasmira',
    category: 'pelagic',
    image: life25,
    description: 'Golden-yellow schooling snappers hovering above reef bommies.'
  },
  pelagic_fusilier: {
    creatureName: 'Neon Fusilier School',
    species: 'Caesio teres',
    category: 'pelagic',
    image: life26,
    description: 'Flash of electric blue and yellow racing across reef crests.'
  },

  // --- Corals, Gorgonian Fans & Gardens ---
  coral_staghorn: {
    creatureName: 'Staghorn Coral Reef',
    species: 'Acropora cervicornis',
    category: 'coral',
    image: imgGallery1,
    description: 'Sprawling branching coral providing shelter for hundreds of juvenile fish.'
  },
  coral_table: {
    creatureName: 'Acropora Table Coral',
    species: 'Acropora hyacinthus',
    category: 'coral',
    image: c1,
    description: 'Massive tiered table corals catching sub-surface sunrays.'
  },
  coral_reef_garden: {
    creatureName: 'Vibrant Coral Garden',
    species: 'Pocillopora verrucosa',
    category: 'coral',
    image: c2,
    description: 'Pristine hard coral garden illuminated by crystal turquoise waters.'
  },
  coral_gorgonian_fan: {
    creatureName: 'Giant Gorgonian Sea Fan',
    species: 'Alcyonacea Subergorgia',
    category: 'coral',
    image: c3,
    description: 'Magnificent deep-water sea fan filtering ocean currents along the wall.'
  },
  coral_brain: {
    creatureName: 'Brain Coral Boulder',
    species: 'Diploria labyrinthiformis',
    category: 'coral',
    image: life13,
    description: 'Ancient maze-patterned coral head centuries in the making.'
  },
  coral_soft: {
    creatureName: 'Carnation Soft Corals',
    species: 'Dendronephthya spp.',
    category: 'coral',
    image: life15,
    description: 'Radiant pink and violet soft corals blooming in tidal currents.'
  },
  coral_pinnacle: {
    creatureName: 'Submerged Coral Pinnacle',
    species: 'Porites lutea Coral Dome',
    category: 'coral',
    image: life17,
    description: 'Towering coral monolith rising from the deep seabed.'
  },
  coral_polyps: {
    creatureName: 'Fluorescent Coral Polyps',
    species: 'Montipora capitata',
    category: 'coral',
    image: life28,
    description: 'Micro-forest of feeding coral polyps flourishing in clean waters.'
  },
  coral_bommie: {
    creatureName: 'Tropical Reef Bommie',
    species: 'Scleractinia Habitat',
    category: 'coral',
    image: life29,
    description: 'Thriving standalone reef structure teeming with biodiversity.'
  },
  coral_plate: {
    creatureName: 'Plate Coral Formation',
    species: 'Turbinaria mesenterina',
    category: 'coral',
    image: life30,
    description: 'Spiraling leaf coral terraces cascading down the slope.'
  },
  coral_mushroom: {
    creatureName: 'Mushroom Coral',
    species: 'Fungia fungites',
    category: 'coral',
    image: life31,
    description: 'Solitary free-living coral resting on sand flats.'
  },
  coral_fire: {
    creatureName: 'Branching Fire Coral',
    species: 'Millepora dichotoma',
    category: 'coral',
    image: life32,
    description: 'Golden branching hydrocoral hosting symbiotic damselfish.'
  },
  coral_tubastrea: {
    creatureName: 'Sun Coral Cluster',
    species: 'Tubastraea coccinea',
    category: 'coral',
    image: life33,
    description: 'Bright yellow-orange sun corals decorating dark cavern ceilings.'
  },
  coral_leather: {
    creatureName: 'Toadstool Leather Coral',
    species: 'Sarcophyton glaucum',
    category: 'coral',
    image: life34,
    description: 'Velvety soft coral waving gently in ambient ocean swell.'
  },
  coral_pillar: {
    creatureName: 'Pillar Coral Colonnade',
    species: 'Dendrogyra cylindrus',
    category: 'coral',
    image: life35,
    description: 'Rare vertical finger-like pillars standing resolute in crystal waters.'
  },
  coral_cup: {
    creatureName: 'Orange Cup Coral',
    species: 'Balanophyllia elegans',
    category: 'coral',
    image: life36,
    description: 'Miniature glowing cups clustered in sheltered overhangs.'
  },
  coral_fan_yellow: {
    creatureName: 'Golden Sea Fan',
    species: 'Melithaea ochracea',
    category: 'coral',
    image: life37,
    description: 'Intricate golden lace sea fan anchored to volcanic bedrock.'
  },
  coral_black: {
    creatureName: 'Deep Black Coral Tree',
    species: 'Antipathes dichotoma',
    category: 'coral',
    image: life38,
    description: 'Precious deep-sea coral bush providing sanctuary for pygmy seahorses.'
  },
  coral_star: {
    creatureName: 'Great Star Coral',
    species: 'Montastraea cavernosa',
    category: 'coral',
    image: life39,
    description: 'Luminescent nighttime polyps extending to capture nutrients.'
  },
  coral_cabbage: {
    creatureName: 'Cabbage Leaf Coral',
    species: 'Echinopora lamellosa',
    category: 'coral',
    image: life40,
    description: 'Ruffled coral sheets creating layered hideaways for juvenile marine life.'
  },
  coral_blue: {
    creatureName: 'Heliopora Blue Coral',
    species: 'Heliopora coerulea',
    category: 'coral',
    image: life41,
    description: 'Ancient octocoral with unique indigo skeleton surviving across millennia.'
  },

  // --- Macro Life, Crustaceans, Cephalopods & Eels ---
  macro_lobster: {
    creatureName: 'Spiny Coral Lobster',
    species: 'Panulirus argus',
    category: 'macro',
    image: life50,
    description: 'Long-whiskered crustacean peering out from deep reef crevices.'
  },
  macro_slipper_lobster: {
    creatureName: 'Slipper Lobster',
    species: 'Scyllarides latus',
    category: 'macro',
    image: life51,
    description: 'Master of camouflage blending into volcanic rock crevices.'
  },
  macro_moray: {
    creatureName: 'Giant Moray Eel',
    species: 'Gymnothorax javanicus',
    category: 'macro',
    image: life52,
    description: 'Imposing reef predator breathing rhythmically from its lair.'
  },
  macro_ribbon_eel: {
    creatureName: 'Blue Ribbon Eel',
    species: 'Rhinomuraena quaesita',
    category: 'macro',
    image: life53,
    description: 'Electric blue and yellow ribbon eel fluttering above sandy burrows.'
  },
  macro_octopus: {
    creatureName: 'Day Octopus (Cyanea)',
    species: 'Octopus cyanea',
    category: 'macro',
    image: life54,
    description: 'Shape-shifting master of disguise hunting across coral rubble.'
  },
  macro_cuttlefish: {
    creatureName: 'Broadclub Cuttlefish',
    species: 'Sepia latimanus',
    category: 'macro',
    image: life55,
    description: 'Intelligent cephalopod displaying pulsating color patterns.'
  },
  macro_nudibranch: {
    creatureName: 'Magnificent Nudibranch',
    species: 'Chromodoris magnifica',
    category: 'macro',
    image: life56,
    description: 'Vividly striped sea slug grazing on reef sponge gardens.'
  },
  macro_seahorse: {
    creatureName: 'Pygmy Seahorse',
    species: 'Hippocampus bargibanti',
    category: 'macro',
    image: life57,
    description: 'Microscopic gem camouflaged seamlessly on sea fan branches.'
  },
  macro_mantis_shrimp: {
    creatureName: 'Peacock Mantis Shrimp',
    species: 'Odontodactylus scyllarus',
    category: 'macro',
    image: life58,
    description: 'Kaleidoscope-colored crustacean with lightning-fast hunting strikes.'
  },
  macro_cleaner_shrimp: {
    creatureName: 'Banded Coral Cleaner Shrimp',
    species: 'Stenopus hispidus',
    category: 'macro',
    image: life59,
    description: 'Attentive cleaner shrimp waving antennae to service reef visitors.'
  },
  macro_lionfish: {
    creatureName: 'Red Lionfish',
    species: 'Pterois volitans',
    category: 'macro',
    image: life60,
    description: 'Aristocratic predator with feather-like venomous spines gliding over coral.'
  },
  macro_frogfish: {
    creatureName: 'Warty Frogfish',
    species: 'Antennarius maculatus',
    category: 'macro',
    image: life61,
    description: 'Stealth ambush hunter disguised as a sponge on the reef floor.'
  },
  macro_stonefish: {
    creatureName: 'Reef Stonefish',
    species: 'Synanceia verrucosa',
    category: 'macro',
    image: live63,
    description: 'World’s most venomous fish perfectly disguised as coral rock.'
  },
  macro_anemone_crab: {
    creatureName: 'Porcelain Anemone Crab',
    species: 'Neopetrolisthes maculatus',
    category: 'macro',
    image: life74,
    description: 'Delicate spotted crab living in harmony with sea anemones.'
  },

  // --- Shipwrecks & Historic Wreck Dives ---
  wreck_historic: {
    creatureName: 'Historic Shipwreck Wall',
    species: 'Artificial Coral Sanctuary',
    category: 'wreck',
    image: scene1,
    description: 'Sunken vessel now covered in corals, sponges, and resident schooling fish.'
  },
  wreck_cargo: {
    creatureName: 'Deep Cargo Shipwreck',
    species: 'Wreck Biome & Gorgonians',
    category: 'wreck',
    image: scene2,
    description: 'Haunting hull resting in deep blue waters teeming with marine life.'
  },
  wreck_diver: {
    creatureName: 'Wreck Exploration Team',
    species: 'Advanced Technical Wreck Site',
    category: 'wreck',
    image: c6,
    description: 'Scuba divers navigating corridors and coral-encrusted cargo holds.'
  },

  // --- Deep Wall, Caverns, Cenotes & Blue Holes ---
  wall_dropoff: {
    creatureName: 'Vertical Oceanic Drop-off',
    species: 'Deep Wall & Sea Fan Colonnade',
    category: 'wall',
    image: c3,
    description: 'Dramatic vertical abyss dropping into the deep blue ocean.'
  },
  cavern_bluehole: {
    creatureName: 'Great Blue Hole & Cavern',
    species: 'Submarine Stalactite Cavern',
    category: 'cavern',
    image: scene3,
    description: 'Ancient submerged sinkhole with subterranean cathedral chambers.'
  },
  dive_atoll: {
    creatureName: 'Pristine Turquoise Atoll',
    species: 'Coral Barrier Atoll Lagoon',
    category: 'ocean',
    image: c5,
    description: 'Vibrant turquoise outer reef lagoon blessed with 40m visibility.'
  },
  dive_expedition: {
    creatureName: 'Oceanic Drift & Coral Traverse',
    species: 'Pelagic Marine Sanctuary',
    category: 'ocean',
    image: c4,
    description: 'High-energy drift dive traversing unblemished coral landscapes.'
  },
  dive_village_lodge: {
    creatureName: 'The Dive Village Sanctuary',
    species: 'Coastal Marine Nature Reserve',
    category: 'ocean',
    image: stayImg,
    description: 'Our world-class marine base and premier dive departure point.'
  }
}

export const DEFAULT_DIVE_IMAGE = panel4

// Fast lookup arrays grouped by biological category
const CATEGORY_POOLS = {
  turtle: [
    CREATURE_PROFILES.turtle_hawksbill,
    CREATURE_PROFILES.turtle_green,
    CREATURE_PROFILES.turtle_reef,
    CREATURE_PROFILES.turtle_loggerhead
  ],
  manta: [
    CREATURE_PROFILES.manta_oceanic,
    CREATURE_PROFILES.manta_reef,
    CREATURE_PROFILES.ray_spotted
  ],
  shark: [
    CREATURE_PROFILES.shark_whale,
    CREATURE_PROFILES.shark_blacktip,
    CREATURE_PROFILES.shark_whitetip,
    CREATURE_PROFILES.shark_nurse,
    CREATURE_PROFILES.shark_hammerhead
  ],
  clownfish: [
    CREATURE_PROFILES.clownfish_ocellaris,
    CREATURE_PROFILES.clownfish_tomato,
    CREATURE_PROFILES.clownfish_clarkii,
    CREATURE_PROFILES.clownfish_skunk,
    CREATURE_PROFILES.anemone_garden
  ],
  pelagic: [
    CREATURE_PROFILES.pelagic_trevally,
    CREATURE_PROFILES.pelagic_barracuda,
    CREATURE_PROFILES.pelagic_jacks,
    CREATURE_PROFILES.pelagic_snapper,
    CREATURE_PROFILES.pelagic_fusilier
  ],
  coral: [
    CREATURE_PROFILES.coral_staghorn,
    CREATURE_PROFILES.coral_table,
    CREATURE_PROFILES.coral_reef_garden,
    CREATURE_PROFILES.coral_gorgonian_fan,
    CREATURE_PROFILES.coral_brain,
    CREATURE_PROFILES.coral_soft,
    CREATURE_PROFILES.coral_pinnacle,
    CREATURE_PROFILES.coral_polyps,
    CREATURE_PROFILES.coral_bommie,
    CREATURE_PROFILES.coral_plate,
    CREATURE_PROFILES.coral_mushroom,
    CREATURE_PROFILES.coral_fire,
    CREATURE_PROFILES.coral_tubastrea,
    CREATURE_PROFILES.coral_leather,
    CREATURE_PROFILES.coral_pillar,
    CREATURE_PROFILES.coral_cup,
    CREATURE_PROFILES.coral_fan_yellow,
    CREATURE_PROFILES.coral_black,
    CREATURE_PROFILES.coral_star,
    CREATURE_PROFILES.coral_cabbage,
    CREATURE_PROFILES.coral_blue
  ],
  macro: [
    CREATURE_PROFILES.macro_lobster,
    CREATURE_PROFILES.macro_slipper_lobster,
    CREATURE_PROFILES.macro_moray,
    CREATURE_PROFILES.macro_ribbon_eel,
    CREATURE_PROFILES.macro_octopus,
    CREATURE_PROFILES.macro_cuttlefish,
    CREATURE_PROFILES.macro_nudibranch,
    CREATURE_PROFILES.macro_seahorse,
    CREATURE_PROFILES.macro_mantis_shrimp,
    CREATURE_PROFILES.macro_cleaner_shrimp,
    CREATURE_PROFILES.macro_lionfish,
    CREATURE_PROFILES.macro_frogfish,
    CREATURE_PROFILES.macro_stonefish,
    CREATURE_PROFILES.macro_anemone_crab
  ],
  wreck: [
    CREATURE_PROFILES.wreck_historic,
    CREATURE_PROFILES.wreck_cargo,
    CREATURE_PROFILES.wreck_diver
  ],
  wall: [
    CREATURE_PROFILES.wall_dropoff,
    CREATURE_PROFILES.coral_gorgonian_fan,
    CREATURE_PROFILES.coral_soft,
    CREATURE_PROFILES.pelagic_trevally
  ],
  cavern: [
    CREATURE_PROFILES.cavern_bluehole,
    CREATURE_PROFILES.coral_tubastrea,
    CREATURE_PROFILES.shark_whitetip
  ],
  ocean: [
    CREATURE_PROFILES.dive_atoll,
    CREATURE_PROFILES.dive_expedition,
    CREATURE_PROFILES.coral_reef_garden,
    CREATURE_PROFILES.turtle_green,
    CREATURE_PROFILES.manta_reef
  ]
}

// All diverse pool for deterministic fallback
const ALL_CREATURES = Object.values(CREATURE_PROFILES)

/**
 * Deterministic hash generator to ensure the exact same site always gets
 * the exact same creature & image consistently across renders.
 */
const getConsistentHash = (str) => {
  let hash = 0
  const s = String(str || '')
  for (let i = 0; i < s.length; i++) {
    hash = (hash << 5) - hash + s.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

/**
 * SPECIFIC AUTHORITATIVE ID OVERRIDES
 * Maps high-profile famous dive sites directly to exact verified creature profiles.
 */
export const SITE_SPECIFIC_OVERRIDES = {
  // Crystal Bay (Nusa Penida, Indonesia - famous for Mola Mola & Reef Corals)
  '1822': CREATURE_PROFILES.coral_reef_garden,
  // Ped (Drift coral & sea turtles)
  '1826': CREATURE_PROFILES.turtle_green,
  // Manta Point (Indonesia)
  '3961': CREATURE_PROFILES.manta_reef,
  // USAT Liberty Shipwreck (Bali)
  '1511': CREATURE_PROFILES.wreck_historic,
  // Tulamben Wreck
  '8058': CREATURE_PROFILES.wreck_cargo,
  // Shark Point (Gili / Indonesia)
  '22988': CREATURE_PROFILES.shark_blacktip,
  // Tiger Beach (Bahamas - Tiger & Hammerhead Sharks)
  '2361': CREATURE_PROFILES.shark_hammerhead,
  // Shark Junction (Bahamas)
  '2356': CREATURE_PROFILES.shark_whitetip,
  // Great Blue Hole (Belize)
  '5507': CREATURE_PROFILES.cavern_bluehole,
  // The Aquarium (Belize)
  '5527': CREATURE_PROFILES.coral_staghorn,
  // Ben's Blue Hole (Bahamas)
  '2358': CREATURE_PROFILES.cavern_bluehole,
  // Carlisle Bay (Barbados - Historic Shipwrecks)
  '15695': CREATURE_PROFILES.wreck_historic,
  // Neptune Goddess (Barbados Wreck)
  '15533': CREATURE_PROFILES.wreck_cargo,
  // Lekuan 1, 2, 3 (Bunaken - Giant Sea Turtles & Vertical Coral Wall)
  '1084': CREATURE_PROFILES.turtle_hawksbill,
  // Magic Point (Australia - Grey Nurse Sharks)
  '6760': CREATURE_PROFILES.shark_nurse,
  // Rye Pier (Australia - Seahorses & Macro)
  '4134': CREATURE_PROFILES.macro_seahorse
}

/**
 * Identify and return the appropriate creature profile for a given dive site.
 * Uses:
 * 1. Specific authoritative ID mapping
 * 2. Name keyword matching (creature names in English/Spanish/French/Italian)
 * 3. Dive type & habitat classification (Wreck, Reef, Wall, Cave, Drift, Ocean, Muck)
 * 4. Deterministic hash fallback to a rich pool of marine life
 * 
 * @param {string|number} id The dive site ID
 * @param {object} [siteObj] Optional site object containing name, title, types, country
 * @returns {object} The creature profile { creatureName, species, category, image, description }
 */
export const getDiveSiteCreatureInfo = (id, siteObj = null) => {
  const strId = String(id || (siteObj && siteObj.id) || '')
  
  // 1. Specific ID override check
  if (strId && SITE_SPECIFIC_OVERRIDES[strId]) {
    return SITE_SPECIFIC_OVERRIDES[strId]
  }

  const name = ((siteObj && (siteObj.title || siteObj.name)) || '').toLowerCase()
  const types = ((siteObj && siteObj.types) || '').toLowerCase()
  const country = ((siteObj && siteObj.country) || '').toLowerCase()
  const combined = `${name} ${types} ${country}`
  const hash = getConsistentHash(strId || name || 'dive_site')

  // 2. Creature keyword detection in site name / description

  // Turtle keywords
  if (/turtle|tortuga|tartaruga|chelonia|caretta|green turtle|hawksbill/i.test(name)) {
    const pool = CATEGORY_POOLS.turtle
    return pool[hash % pool.length]
  }

  // Manta & Ray keywords
  if (/manta|ray|stingray|eagle ray|mobula|raya|raie/i.test(name)) {
    const pool = CATEGORY_POOLS.manta
    return pool[hash % pool.length]
  }

  // Shark keywords
  if (/shark|tiburon|requin|squalo|haie|hammerhead|nurse shark|whale shark|tiburon ballena/i.test(name)) {
    const pool = CATEGORY_POOLS.shark
    return pool[hash % pool.length]
  }

  // Clownfish & Anemone keywords
  if (/clown|nemo|anemone|amphiprion/i.test(name)) {
    const pool = CATEGORY_POOLS.clownfish
    return pool[hash % pool.length]
  }

  // Pelagic / Barracuda / Trevally / Jack / Tuna keywords
  if (/barracuda|trevally|jack|tuna|fusilier|snapper|school|pelagic|baitball/i.test(name)) {
    const pool = CATEGORY_POOLS.pelagic
    return pool[hash % pool.length]
  }

  // Macro / Lobster / Crab / Nudi / Octopus / Eel keywords
  if (/lobster|crab|macro|nudi|nudibranch|octopus|cuttlefish|seahorse|moray|eel|poulpe/i.test(name)) {
    const pool = CATEGORY_POOLS.macro
    return pool[hash % pool.length]
  }

  // Wreck keywords in name or type
  if (/wreck|naufragio|epave|ship|boat|barge|sub|destroyer|frigate|carrier/i.test(name) || /wreck/i.test(types)) {
    const pool = CATEGORY_POOLS.wreck
    return pool[hash % pool.length]
  }

  // Cave / Cavern / Blue hole / Cenote keywords
  if (/blue hole|hole|cavern|cave|cenote|cueva|trou|grotto/i.test(name) || /cavern|cave/i.test(types)) {
    const pool = CATEGORY_POOLS.cavern
    return pool[hash % pool.length]
  }

  // Wall / Drop-off keywords
  if (/wall|drop|pared|falise|pinnacle|chimney/i.test(name) || /wall|pinnacle/i.test(types)) {
    const pool = CATEGORY_POOLS.wall
    return pool[hash % pool.length]
  }

  // Coral garden / Reef keywords
  if (/garden|coral|jardin|reef|arrecife|coral garden|bommie|pinnacle|barrier/i.test(name)) {
    const pool = CATEGORY_POOLS.coral
    return pool[hash % pool.length]
  }

  // Muck / Sandy bottom type -> Macro life
  if (/muck|sandy bottom/i.test(types)) {
    const pool = CATEGORY_POOLS.macro
    return pool[hash % pool.length]
  }

  // Drift type -> Pelagics / Mantas / Turtles
  if (/drift/i.test(types)) {
    const driftPool = [...CATEGORY_POOLS.manta, ...CATEGORY_POOLS.turtle, ...CATEGORY_POOLS.pelagic]
    return driftPool[hash % driftPool.length]
  }

  // Reef type -> Corals, Clownfish & Turtles
  if (/reef/i.test(types)) {
    const reefPool = [...CATEGORY_POOLS.coral, ...CATEGORY_POOLS.turtle, ...CATEGORY_POOLS.clownfish]
    return reefPool[hash % reefPool.length]
  }

  // 3. Fallback: Deterministic selection from the full identified creature & dive pool
  return ALL_CREATURES[hash % ALL_CREATURES.length] || CREATURE_PROFILES.turtle_hawksbill
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
