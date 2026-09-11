// Imports from Carousel and New Folder
import c1 from '../assets/Carosel/WhatsApp Image 2026-07-31 at 9.36.42 AM (1).jpeg'
import c2 from '../assets/Carosel/WhatsApp Image 2026-07-31 at 9.36.42 AM.jpeg'
import c3 from '../assets/Carosel/WhatsApp Image 2026-07-31 at 9.36.43 AM (1).jpeg'
import c4 from '../assets/Carosel/WhatsApp Image 2026-07-31 at 9.36.43 AM (2).jpeg'
import c5 from '../assets/Carosel/WhatsApp Image 2026-07-31 at 9.36.43 AM.jpeg'
import c6 from '../assets/Carosel/WhatsApp Image 2026-07-31 at 9.36.44 AM.jpeg'

// Images from New folder
import imgGallery1 from '../assets/New folder/Galleryimg1.jpg'
import imgStay from '../assets/New folder/Stay.jpg'
import imgFood from '../assets/New folder/food.jpg'
import imgMerch1 from '../assets/New folder/merch1.jpg'
import imgMerch2 from '../assets/New folder/merch2.jpg'
import imgMerch3 from '../assets/New folder/merch3.jpg'
import imgMerch4 from '../assets/New folder/merch4.jpg'

// Videos from New folder
import vid20260630 from '../assets/New folder/20260630_153650_005.mp4'
import vid20260707_1 from '../assets/New folder/20260707_165729_460.mp4'
import vid20260707_2 from '../assets/New folder/20260707_170454_824.mp4'
import vidDJI_0007 from '../assets/New folder/DJI_20260525102811_0007_D.MP4'
import vidDJI_0011 from '../assets/New folder/DJI_20260525104139_0011_D.MP4'
import vidDJI_0017 from '../assets/New folder/DJI_20260525123656_0017_D.MP4'
import vidDJI_0018 from '../assets/New folder/DJI_20260525124204_0018_D.MP4'
import vidDive from '../assets/New folder/Dive.MP4'
import vidFreeDiving1 from '../assets/New folder/Free Diving 1.mov'
import vidGX8833 from '../assets/New folder/GX018833.mp4'
import vidGX8841 from '../assets/New folder/GX018841.MP4'
import vidItinerary from '../assets/New folder/Itinerary.mp4'
import vidTravel from '../assets/New folder/Travel.mp4'
import vidTurtleAnna1 from '../assets/New folder/Turtle Anna(1).mp4'
import vidTurtleAnna from '../assets/New folder/Turtle Anna.mp4'
import vidTurtleFlyinnn from '../assets/New folder/Turtle Flyinnn.mov'
import vidDjiMimo1 from '../assets/New folder/dji_mimo_20260124_112020_0_1769300692742_video.mp4'
import vidDjiMimo2 from '../assets/New folder/dji_mimo_20260204_084830_0_1770187393265_video.mp4'
import vidDjiMimo3 from '../assets/New folder/dji_mimo_20260204_084858_0_1770187391850_video.mp4'
import vidDjiMimo4 from '../assets/New folder/dji_mimo_20260220_140750_0_1771571076972_video.mp4'
import vidFreeDiving2 from '../assets/New folder/free diving .mp4'
import vidFreeDiving3 from '../assets/New folder/free diving 3.mp4'
import vidGallery1 from '../assets/New folder/gallery1.mp4'
import vidMerch5 from '../assets/New folder/merch 5.mp4'
import vidSurfing from '../assets/New folder/surfing.mp4'

export const GALLERY_ITEMS = [
  // --- Marine Encounters & Creatures ---
  {
    id: 'vid-turtle-anna-1',
    type: 'video',
    src: vidTurtleAnna1,
    title: 'Green Sea Turtle Encounter',
    species: 'Chelonia mydas',
    reelName: 'Reel #01 • TurtleGlide_Ep1',
    location: 'Havelock Island, Andaman & Nicobar',
    category: 'marine'
  },
  {
    id: 'vid-turtle-anna',
    type: 'video',
    src: vidTurtleAnna,
    title: 'Hawksbill Sea Turtle',
    species: 'Eretmochelys imbricata',
    reelName: 'Reel #02 • HawksbillEncounter',
    location: 'Neil Island, Andaman & Nicobar',
    category: 'marine'
  },
  {
    id: 'vid-turtle-flyinnn',
    type: 'video',
    src: vidTurtleFlyinnn,
    title: 'Gliding Sea Turtle on Coral Ridge',
    species: 'Chelonia mydas (Green Turtle)',
    reelName: 'Reel #03 • GlidingSeaTurtle',
    location: 'South Button Reef, Andamans',
    category: 'marine'
  },
  {
    id: 'vid-dji-mimo2',
    type: 'video',
    src: vidDjiMimo2,
    title: 'Oceanic Whale Shark Encounter',
    species: 'Rhincodon typus',
    reelName: 'Reel #04 • WhaleSharkSanctuary',
    location: 'Netrani Island Marine Sanctuary',
    category: 'marine'
  },
  {
    id: 'vid-dji-mimo3',
    type: 'video',
    src: vidDjiMimo3,
    title: 'Reef Manta Ray Oceanic Glide',
    species: 'Mobula alfredi',
    reelName: 'Reel #05 • MantaRayFlight',
    location: "Dixon's Pinnacle, Havelock",
    category: 'marine'
  },
  {
    id: 'vid-dji-mimo4',
    type: 'video',
    src: vidDjiMimo4,
    title: 'Clown Anemonefish in Sea Anemone',
    species: 'Amphiprion ocellaris & Heteractis magnifica',
    reelName: 'Reel #06 • ClownfishAnemoneHome',
    location: 'Turtle Bay, Andamans',
    category: 'marine'
  },
  {
    id: 'vid-dji-0017',
    type: 'video',
    src: vidDJI_0017,
    title: 'Schooling Giant Trevally & Jackfish',
    species: 'Caranx ignobilis',
    reelName: 'Reel #07 • SchoolingTrevally',
    location: 'Netrani Island, Karnataka',
    category: 'marine'
  },
  {
    id: 'vid-dji-0018',
    type: 'video',
    src: vidDJI_0018,
    title: 'Blacktip Reef Shark Coastal Patrol',
    species: 'Carcharhinus melanopterus',
    reelName: 'Reel #08 • ReefSharkPatrol',
    location: 'Elephant Beach, Andamans',
    category: 'marine'
  },
  {
    id: 'vid-dji-mimo1',
    type: 'video',
    src: vidDjiMimo1,
    title: 'Vibrant Hard Coral Pinnacle',
    species: 'Porites lutea & Pocillopora damicornis',
    reelName: 'Reel #09 • CoralPinnacleExpedition',
    location: 'Lighthouse Point, Andamans',
    category: 'marine'
  },

  // --- Scuba Diving Expeditions ---
  {
    id: 'vid-dive',
    type: 'video',
    src: vidDive,
    title: 'Coral Wall Exploration & Divers',
    species: 'Anthozoa Reef Biome & Divers',
    reelName: 'Reel #10 • CoralWallExploration',
    location: 'Netrani Island, Karnataka',
    category: 'scuba'
  },
  {
    id: 'vid-gx8841',
    type: 'video',
    src: vidGX8841,
    title: 'Deep Volcanic Reef Scuba Team',
    species: 'Tropical Coral Ecosystem',
    reelName: 'Reel #11 • VolcanicBarrenIsland',
    location: 'Barren Island, Andamans',
    category: 'scuba'
  },
  {
    id: 'vid-gx8833',
    type: 'video',
    src: vidGX8833,
    title: 'Sub-surface Coral Formations',
    species: 'Goniopora & Montipora Corals',
    reelName: 'Reel #12 • SubSurfaceCorals',
    location: 'The Wall, Netrani',
    category: 'scuba'
  },
  {
    id: 'img-gallery1',
    type: 'image',
    src: imgGallery1,
    title: 'Staghorn Coral Reef Discovery',
    species: 'Acropora cervicornis (Staghorn Coral)',
    reelName: 'Reel #13 • StaghornDiscovery',
    location: 'Minicoy Reef, Lakshadweep',
    category: 'scuba'
  },
  {
    id: 'img-c1',
    type: 'image',
    src: c1,
    title: 'Scuba Explorer at Coral Garden',
    species: 'Acropora millepora & Tropical Reef Fish',
    reelName: 'Reel #14 • CoralGardenDrift',
    location: 'Havelock Island, Andamans',
    category: 'scuba'
  },
  {
    id: 'img-c3',
    type: 'image',
    src: c3,
    title: 'Deep Wall Scuba Descent',
    species: 'Gorgonian Sea Fan (Alcyonacea)',
    reelName: 'Reel #15 • DeepWallDescent',
    location: 'South Button Island, Andamans',
    category: 'scuba'
  },
  {
    id: 'img-c6',
    type: 'image',
    src: c6,
    title: 'PADI Open Water Dive Training',
    species: 'Tropical Marine Coral Reef',
    reelName: 'Reel #16 • PADICommunityTraining',
    location: 'Netrani Island, Karnataka',
    category: 'scuba'
  },

  // --- Freediving & Ocean Sessions ---
  {
    id: 'vid-freediving-1',
    type: 'video',
    src: vidFreeDiving1,
    title: 'Blue Water Freediver Descent',
    species: 'Homo sapiens & Pelagic Marine Zone',
    reelName: 'Reel #17 • BlueWaterFreediveDescent',
    location: 'Minicoy Island, Lakshadweep',
    category: 'freediving'
  },
  {
    id: 'vid-freediving-2',
    type: 'video',
    src: vidFreeDiving2,
    title: 'Reef Apex Freedive Line Training',
    species: 'Open Ocean Depth Training',
    reelName: 'Reel #18 • LineTrainingBangaram',
    location: 'Bangaram Atoll, Lakshadweep',
    category: 'freediving'
  },
  {
    id: 'vid-freediving-3',
    type: 'video',
    src: vidFreeDiving3,
    title: 'Breath-Hold Coral Swim-Through',
    species: 'Acropora Coral Garden Exploration',
    reelName: 'Reel #19 • BreathHoldSwimThrough',
    location: 'Kadmat Island, Lakshadweep',
    category: 'freediving'
  },

  // --- Ocean, Coastal & Lagoon Scenery ---
  {
    id: 'vid-dji-0007',
    type: 'video',
    src: vidDJI_0007,
    title: 'Aerial Coral Reef Lagoon',
    species: 'Scleractinia Coral Ecosystem',
    reelName: 'Reel #20 • AerialLagoonSpectacle',
    location: 'Havelock Island, Andamans',
    category: 'ocean'
  },
  {
    id: 'vid-dji-0011',
    type: 'video',
    src: vidDJI_0011,
    title: 'Turquoise Atoll Shoreline',
    species: 'Coastal Marine Sanctuary',
    reelName: 'Reel #21 • AgattiAtollParadise',
    location: 'Agatti Island, Lakshadweep',
    category: 'ocean'
  },
  {
    id: 'vid-gallery1',
    type: 'video',
    src: vidGallery1,
    title: 'Open Ocean Blue Water Dive',
    species: 'Pelagic Marine Zone',
    reelName: 'Reel #22 • OpenOceanBlue',
    location: 'Grand Island, Goa',
    category: 'ocean'
  },
  {
    id: 'vid-20260630',
    type: 'video',
    src: vid20260630,
    title: 'Crystal Clear Reef Lagoon',
    species: 'Inshore Fringing Reef Ecosystem',
    reelName: 'Reel #23 • CrystalLagoonRadhanagar',
    location: 'Radhanagar, Havelock',
    category: 'ocean'
  },
  {
    id: 'vid-20260707-1',
    type: 'video',
    src: vid20260707_1,
    title: 'Sunset Ocean Cruise',
    species: 'Open Marine Coastal Waters',
    reelName: 'Reel #24 • SunsetOceanCruise',
    location: 'Havelock Coastal Waters',
    category: 'ocean'
  },
  {
    id: 'vid-20260707-2',
    type: 'video',
    src: vid20260707_2,
    title: 'Golden Hour Island Waters',
    species: 'Coral Sea Horizon',
    reelName: 'Reel #25 • GoldenHourNeilIsland',
    location: 'Neil Island Shores',
    category: 'ocean'
  },

  // --- Surfing Sessions ---
  {
    id: 'vid-surfing',
    type: 'video',
    src: vidSurfing,
    title: 'Coastal Wave Riding & Surf Session',
    species: 'Ocean Swell & Coastal Biome',
    reelName: 'Reel #26 • CoastalSurfSession',
    location: 'Kovalam Beach, Kerala',
    category: 'surfing'
  },
  {
    id: 'img-c4',
    type: 'image',
    src: c4,
    title: 'Surf Lineup & Breaking Swells',
    species: 'Ocean Coastline Swell',
    reelName: 'Reel #27 • KovalamSurfBreak',
    location: 'Kovalam Beach, Kerala',
    category: 'surfing'
  },

  // --- Village Life, Stay & Island Experience ---
  {
    id: 'vid-travel',
    type: 'video',
    src: vidTravel,
    title: 'Expedition Boat Voyage',
    species: 'Marine Transit Expedition',
    reelName: 'Reel #28 • IslandExpeditionVoyage',
    location: 'Port Blair to Havelock, Andamans',
    category: 'lifestyle'
  },
  {
    id: 'vid-itinerary',
    type: 'video',
    src: vidItinerary,
    title: 'Dive Village Headquarters & Base',
    species: 'Community Base & Expedition Briefing',
    reelName: 'Reel #29 • DiveVillageBriefing',
    location: 'The Dive Village Base',
    category: 'lifestyle'
  },
  {
    id: 'img-stay',
    type: 'image',
    src: imgStay,
    title: 'Island Eco-Resort & Dive Camp',
    species: 'The Dive Village Eco-Lodge',
    reelName: 'Reel #30 • EcoLodgeStay',
    location: 'Havelock Island, Andamans',
    category: 'lifestyle'
  },
  {
    id: 'img-food',
    type: 'image',
    src: imgFood,
    title: 'Post-Dive Community Feast',
    species: 'Fresh Coastal & Healthy Cuisine',
    reelName: 'Reel #31 • PostDiveFeast',
    location: 'Village Beachside Deck',
    category: 'lifestyle'
  },
  {
    id: 'img-c2',
    type: 'image',
    src: c2,
    title: 'Coral Reef Habitat & Marine Life',
    species: 'Pocillopora verrucosa (Stony Coral)',
    reelName: 'Reel #32 • CoralHabitatLife',
    location: 'Neil Island, Andamans',
    category: 'marine'
  },
  {
    id: 'img-c5',
    type: 'image',
    src: c5,
    title: 'Village Camp Sunset Moments',
    species: 'Coastal Island Biome',
    reelName: 'Reel #33 • VillageSunsetVibe',
    location: 'Havelock Island, Andamans',
    category: 'lifestyle'
  },

  // --- Gear & Official Merch ---
  {
    id: 'vid-merch5',
    type: 'video',
    src: vidMerch5,
    title: 'The Dive Village Apparel Showcase',
    species: 'Official Village Divewear & Gear',
    reelName: 'Reel #34 • OfficialApparelShowcase',
    location: 'The Dive Village Shop',
    category: 'merch'
  },
  {
    id: 'img-merch1',
    type: 'image',
    src: imgMerch1,
    title: 'Ocean Expedition Rashguard',
    species: 'Recycled Ocean Polymer Gear',
    reelName: 'Reel #35 • OceanRashguard',
    location: 'The Dive Village Shop',
    category: 'merch'
  },
  {
    id: 'img-merch2',
    type: 'image',
    src: imgMerch2,
    title: 'Signature Dive Village Ocean Cap',
    species: 'Organic Cotton Headwear',
    reelName: 'Reel #36 • SignatureCap',
    location: 'The Dive Village Shop',
    category: 'merch'
  },
  {
    id: 'img-merch3',
    type: 'image',
    src: imgMerch3,
    title: 'Expedition Dry Bag 30L',
    species: 'Heavy-Duty Waterproof TPU',
    reelName: 'Reel #37 • ExpeditionDryBag',
    location: 'The Dive Village Shop',
    category: 'merch'
  },
  {
    id: 'img-merch4',
    type: 'image',
    src: imgMerch4,
    title: 'Thermal Dive Hoodie & Jersey',
    species: 'Marine-Grade Fleece Apparel',
    reelName: 'Reel #38 • ThermalHoodie',
    location: 'The Dive Village Shop',
    category: 'merch'
  }
]

export const GALLERY_CATEGORIES = [
  { key: 'all', label: 'All Media' },
  { key: 'marine', label: 'Marine Life & Creatures' },
  { key: 'scuba', label: 'Scuba Diving' },
  { key: 'freediving', label: 'Freediving' },
  { key: 'ocean', label: 'Ocean & Lagoons' },
  { key: 'surfing', label: 'Surfing' },
  { key: 'lifestyle', label: 'Island Life & Stay' },
  { key: 'merch', label: 'Gear & Merch' },
  { key: 'videos', label: 'Videos' },
  { key: 'photos', label: 'Photos' },
]
