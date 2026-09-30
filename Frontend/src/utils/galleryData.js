// Dynamically import all media from src/assets/Gallery using Vite's native import.meta.glob
const mediaModules = import.meta.glob(['../assets/Gallery/*.*', '../assets/New folder/Gallery/*.*'], {
  eager: true,
  import: 'default',
})

const videoExtensions = new Set(['mp4', 'mov', 'webm', 'ogg', 'm4v'])
const EXCLUDED_FILES = new Set([
  'food.jpg',
  'manta3.mp4',
  'Flexible Fun Dives.png',
  'Snorkelling3.mp4',
  'Snorkelling4.mp4',
  'Turtle.mp4',
  'Reefplant.mp4',
  'Scuba1.jpg',
  'Scuba4.mp4',
  'Scuba5.jpg',
  'Snorkeling.png',
  '8 dive.mp4',
  'Additional dive ater dsd.mp4',
  'DSD lite.mp4',
  'Flexible Fun Dives.jpg',
  'Photo00086787.jpg',
  'procourse.mp4',
  'procourse1.mp4',
  'Ray.mp4',
  'Scuba8.mp4',
  'Scubadiving.jpg',
  'Seafan.mp4',
  'Sky1.jpg',
  'Turtle Flyinnn.mov',
  'Turtle Flyinnn.mp4',
  'merch 5.mp4',
  'nitrox.mp4',
])

export const GALLERY_CATEGORIES = [
  { key: 'all', label: 'All Chronicles' },
  { key: 'marine', label: 'Marine Life' },
  { key: 'scuba', label: 'Scuba & Courses' },
  { key: 'freediving', label: 'Freediving & Snorkeling' },
  { key: 'scenery', label: 'Scenery & Surface' },
  { key: 'videos', label: 'Motion Reels' },
  { key: 'photos', label: 'High-Res Stills' },
]

const GALLERY_METADATA_MAP = {
  '5.jpg': { title: 'Dark Banded Fusilier', category: 'marine' },
  '6.jpg': { title: 'Box Jellyfish', category: 'marine' },
  '7.jpg': { title: 'Banded Coral Shrimp', category: 'marine' },
  '8 dive.mp4': { title: '8-Dive Adventure Package', category: 'scuba' },
  '8.jpg': { title: 'Diver in Baitfish Cyclone', category: 'scuba' },
  'AI.jpg': { title: 'Coral Wall Drop-Off Dive', category: 'scuba' },
  'Additional dive ater dsd.mp4': { title: 'Sweetlips/Grunts', category: 'scuba' },
  'Articulata.JPG': { title: 'Feather Star (Crinoid)', category: 'marine' },
  'Blue Lincka.jpg': { title: 'Blue Linckia Sea Star', category: 'marine' },
  'Bubblemaker.mp4': { title: 'BlackTail Snapper', category: 'marine' },
  'Buoyancy.mp4': { title: 'Green Sea Turtle', category: 'marine' },
  'Certified Courses.jpg': { title: 'Certified Courses Training', category: 'scuba' },
  'Closeup1.mp4': { title: 'Table Coral & Damselfish', category: 'marine' },
  'Crown of thorns.JPG': { title: 'Crown-of-Thorns Starfish', category: 'marine' },
  'DSD lite.mp4': { title: 'Discover Scuba Diving (DSD Lite)', category: 'scuba' },
  'Dawn Dive.mp4': { title: 'Dawn Dive Expedition', category: 'scuba' },
  'Deepdiver.mp4': { title: 'Green Sea Turtle', category: 'marine' },
  'Discover Scuba.mp4': { title: 'LionFish', category: 'marine' },
  'Flexible Fun Dives.jpg': { title: 'Flexible Fun Dives', category: 'scuba' },
  'Flexible Fun Dives.png': { title: 'Guided Coral Wall Dive', category: 'scuba' },
  'Free Diving (2).jpg': { title: 'Freediving Line Ascent', category: 'freediving' },
  'Free Diving 1.mov': { title: 'Freediving Single-Breath Journey', category: 'freediving' },
  'Free Diving 1.mp4': { title: 'Freediving Single-Breath Journey', category: 'freediving' },
  'Free Diving.jpg': { title: 'Freediving Ocean Depths', category: 'freediving' },
  'Free Diving.png': { title: 'FreeDiving', category: 'freediving' },
  'Freedivingfun.mp4': { title: 'Freediving Fun & Practice', category: 'freediving' },
  'Introductory Programs.png': { title: 'Introductory Scuba Discovery', category: 'scuba' },
  'Jellyfish.mp4': { title: 'Moon Jellyfish', category: 'marine' },
  'Leaf Scorpian fish.mp4': { title: 'Leaf Scorpionfish', category: 'marine' },
  'Lionfish.mp4': { title: 'LionFish', category: 'marine' },
  'Nightdive.jpg': { title: 'Night Dive Illumination', category: 'scuba' },
  'Photo00086440.jpg': { title: 'Dark Banded Fusiliers', category: 'marine' },
  'Photo00086448.jpg': { title: 'Thorny Oyster', category: 'marine' },
  'Photo00086450.jpg': { title: 'Feather Star', category: 'marine' },
  'Photo00086451.jpg': { title: 'Green Sea Turtle', category: 'marine' },
  'Photo00086454.jpg': { title: 'Scuba Diver', category: 'scuba' },
  'Photo00086476.jpg': { title: 'School of Batfish', category: 'marine' },
  'Photo00086485.jpg': { title: 'Moon Jellyfish Swarm', category: 'marine' },
  'Photo00086509.jpg': { title: 'Feather Star', category: 'marine' },
  'Photo00086561.jpg': { title: 'Professional Diver', category: 'scuba' },
  'Photo00086567.jpg': { title: 'LionFish', category: 'marine' },
  'Photo00086573.jpg': { title: 'Scuba Divers Ocean Descent', category: 'scuba' },
  'Photo00086574.jpg': { title: 'Leather Mushroom Coral', category: 'marine' },
  'Photo00086576.jpg': { title: 'School of Fusiliers', category: 'marine' },
  'Photo00086578.jpg': { title: 'Bluestripe Snapper School', category: 'marine' },
  'Photo00086586.jpg': { title: 'Banded Sea Snake', category: 'marine' },
  'Photo00086587.jpg': { title: 'Crown-of-Thorns Starfish', category: 'marine' },
  'Photo00086588.jpg': { title: 'Bubble Coral', category: 'marine' },
  'Photo00086611.jpg': { title: 'Pair of Threadfin Butterflyfish', category: 'marine' },
  'Photo00086694.jpg': { title: 'Green Sea Turtle & Baitball', category: 'marine' },
  'Photo00086723.jpg': { title: 'Green Sea Turtle', category: 'marine' },
  'Photo00086726.jpg': { title: 'Blackspotted Pufferfish in Barrel Sponge', category: 'marine' },
  'Photo00086738.jpg': { title: 'Divers with Bright Feather Star', category: 'scuba' },
  'Photo00086739.jpg': { title: 'Feather Star on Reef', category: 'marine' },
  'Photo00086742.jpg': { title: 'Spiky Sea Cucumber', category: 'marine' },
  'Photo00086760.jpg': { title: 'Ananas Sea Cucumber on Sand', category: 'marine' },
  'Photo00086761.jpg': { title: 'School of Sweetlips', category: 'marine' },
  'Photo00086765.jpg': { title: 'Crown JellyFish', category: 'marine' },
  'Photo00086771.jpg': { title: 'Varicose Wart Slug', category: 'marine' },
  'Photo00086776.jpg': { title: 'Electric Blue Giant Clam', category: 'marine' },
  'Photo00086787.jpg': { title: 'LionFish', category: 'marine' },
  'Photo00086792.jpg': { title: 'Clownfish in Sea Anemone', category: 'marine' },
  'Ray.mp4': { title: 'Stingray / Whipray', category: 'marine' },
  'Ray1.mp4': { title: 'Spotted Eagle Ray', category: 'marine' },
  'Reefplant.mp4': { title: 'Ornate Ghost Pipefish', category: 'marine' },
  'Scuba1.jpg': { title: 'Open Water / Advanced Course', category: 'scuba' },
  'Scuba2.MP4': { title: 'School of Baitfish', category: 'marine' },
  'Scuba2.jpg': { title: 'Deep Dive Descent', category: 'scuba' },
  'Scuba3.MP4': { title: 'Magnificent Sea Anemone', category: 'marine' },
  'Scuba3.jpg': { title: 'Diver Safety Briefing', category: 'scuba' },
  'Scuba4.jpg': { title: 'Buddy Team Underwater Check', category: 'scuba' },
  'Scuba4.mp4': { title: 'Bluespotted Stingray', category: 'marine' },
  'Scuba5.jpg': { title: 'Confined Water Skills', category: 'scuba' },
  'Scuba5.mp4': { title: 'Whitetip Reef Shark', category: 'marine' },
  'Scuba6.mp4': { title: 'Drift Diving & Current Flow', category: 'scuba' },
  'Scuba7.mp4': { title: 'Giant Barrel Sponge', category: 'marine' },
  'Scuba8.mp4': { title: 'Magnificent Sea Anemone', category: 'marine' },
  'Scuba9.MP4': { title: 'Sheltered Anemonefish', category: 'marine' },
  'Scubadiving.jpg': { title: 'Scuba Diving Underwater Journey', category: 'scuba' },
  'Sea fan.jpg': { title: 'Sea Fan', category: 'marine' },
  'Seafan.mp4': { title: 'Ornate Ghost Pipefish', category: 'marine' },
  'Shoal.jpg': { title: 'School of Bait Ball', category: 'marine' },
  'Sky1.jpg': { title: 'Tropical Island Horizon', category: 'scenery' },
  'Snorkeling.png': { title: 'Whale Shark', category: 'marine' },
  'Snorkelling2.mp4': { title: 'Whale Shark', category: 'marine' },
  'Snorkelling3.mp4': { title: 'Whale Shark', category: 'marine' },
  'Snorkelling4.mp4': { title: 'Whale Shark', category: 'marine' },
  'Stay.jpg': { title: 'Tropical Sunset & Resort Stays', category: 'scenery' },
  'Stays.mp4': { title: 'Village Stays & Island Calm', category: 'scenery' },
  'Thorny Oyster.jpg': { title: 'Thorny Oyster', category: 'marine' },
  'Travel.mp4': { title: 'Dive Boat Transfer & Island Ride', category: 'scenery' },
  'Try Dive.mp4': { title: 'Schooling Anthias & Damselfish', category: 'marine' },
  'Turtle Anna.mp4': { title: 'Hawksbill Turtle Encounter', category: 'marine' },
  'Turtle Flyinnn.mov': { title: 'Green Sea Turtle Gliding', category: 'marine' },
  'Turtle Flyinnn.mp4': { title: 'Green Sea Turtle Gliding', category: 'marine' },
  'Turtle.mp4': { title: 'Green Sea Turtle / Hawksbill Turtle', category: 'marine' },
  'Turtlefish.mp4': { title: 'Sea Turtle & Reef Fish Colony', category: 'marine' },
  'Welcome.mp4': { title: 'Welcome to The Dive Village', category: 'scenery' },
  'boat.mp4': { title: 'Dive Boat Transfer', category: 'scenery' },
  'bush .mp4': { title: 'Soft Coral & Bush Coral Garden', category: 'marine' },
  'bush.mp4': { title: 'Soft Coral & Bush Coral Garden', category: 'marine' },
  'diving12.mp4': { title: '12-Dive Island Safari', category: 'scuba' },
  'free diving .mp4': { title: 'Freediving Depth Exploration', category: 'freediving' },
  'free diving 3.mp4': { title: 'FreeDiving', category: 'freediving' },
  'gallery1.mp4': { title: 'Safari', category: 'scenery' },
  'lionfish.MP4': { title: 'LionFish', category: 'marine' },
  'merch 5.mp4': { title: 'Dive Village Gear Showcase', category: 'scenery' },
  'nitrox.mp4': { title: 'Enriched Air Nitrox Diving', category: 'scuba' },
  'procourse (2).mp4': { title: 'Schooling Vortex', category: 'marine' },
  'procourse.mp4': { title: 'Divemaster Professional Course', category: 'scuba' },
  'procourse1.mp4': { title: 'Giant Barrel Sponge', category: 'marine' },
  'procourse2.mp4': { title: 'Coral Reef', category: 'marine' },
  'projectaware.mp4': { title: 'Sardine Run', category: 'marine' },
  'surfing.mp4': { title: 'Surfing & Island Waves', category: 'scenery' },
  'zero2hero.jpg': { title: 'Scuba Diving', category: 'scuba' },
}

// Custom order swaps: array of [indexA, indexB] (1-based numbers as seen in the gallery)
const GALLERY_SWAPS = [
  [58, 1],
  [56, 2],
  [69, 3],
  [76, 4],
  [46, 5],
  [44, 6],
  [9, 5],
  [14, 7],
  [44, 10],
  [38, 11],
  [10, 8],
  [11, 9],
  [53, 13],
  [25, 16],
  [23, 17],
  [29, 18],
  [13, 11],
  [17, 13],
  [16, 15],
  [18, 16],
  [63, 19],
  [49, 20],
  [43, 21],
  [41, 22],
  [72, 23],
  [60, 24],
  [50, 25],
  [52, 26],
  [56, 27],
  [58, 28],
  [69, 29],
  [32, 30],
  [36, 31],
  [34, 32],
  [54, 33],
  [55, 34],
  [56, 35],
  [57, 36],
  [58, 37],
  [88, 38],
  [86, 39],
  [58, 43],
  [66, 44],
  [65, 45],
  [60, 46],
  [56, 57],
  [48, 58],
]

const baseItems = Object.entries(mediaModules)
  .filter(([filePath]) => {
    const filename = filePath.split('/').pop() || ''
    return !EXCLUDED_FILES.has(filename)
  })
  .map(([filePath, src], index) => {
    const filename = filePath.split('/').pop() || ''
    const ext = (filename.split('.').pop() || '').toLowerCase()
    const isVideo = videoExtensions.has(ext)

    const meta = GALLERY_METADATA_MAP[filename] || {}
    let title = meta.title
    if (!title) {
      title = filename.replace(/\.[^/.]+$/, '').replace(/[_\\-]+/g, ' ').trim()
      if (title.length > 35) title = title.slice(0, 35) + '...'
    }

    const category = meta.category || (isVideo ? 'videos' : 'photos')

    return {
      id: `gallery-${isVideo ? 'v' : 'p'}-${index}`,
      type: isVideo ? 'video' : 'image',
      src,
      title,
      category,
      filename,
    }
  })

// Apply sequential swaps
const orderedItems = [...baseItems]
GALLERY_SWAPS.forEach(([a, b]) => {
  const idxA = a - 1
  const idxB = b - 1
  if (orderedItems[idxA] && orderedItems[idxB]) {
    const temp = orderedItems[idxA]
    orderedItems[idxA] = orderedItems[idxB]
    orderedItems[idxB] = temp
  }
})

// Specific gallery removals
const REMOVED_FROM_GALLERY = new Set([
  'Dawn Dive.mp4',
  'Photo00086776.jpg',
  'free diving .mp4',
  'Leaf Scorpian fish.mp4',
  'diving12.mp4',
  'Discover Scuba.mp4',
  'Scuba6.mp4',
  'Stay.jpg',
  'Thorny Oyster.jpg',
  'Travel.mp4',
  'Photo00086440.jpg',
  'projectaware.mp4',
  'Scuba2.MP4',
  'Scuba4.jpg',
  'Freedivingfun.mp4',
  'Scuba2.jpg',
  'Free Diving.jpg',
  'Free Diving 1.mp4',
  'Free Diving 1.mov',
  'Turtle Anna.mp4',
  'boat.mp4',
  'merch 5.mp4',
  'nitrox.mp4',
])

// Top curated featured items
const TOP_FEATURED_ORDER = [
  'Turtlefish.mp4',
  'Photo00086792.jpg',
  'Snorkelling2.mp4',
]

const nonRemovedItems = orderedItems.filter((item) => !REMOVED_FROM_GALLERY.has(item.filename))
const topMap = new Map(nonRemovedItems.map((item) => [item.filename, item]))
const topItems = TOP_FEATURED_ORDER.map((fn) => topMap.get(fn)).filter(Boolean)
const topSet = new Set(TOP_FEATURED_ORDER)
const otherItems = nonRemovedItems.filter((item) => !topSet.has(item.filename))
const finalOrderedGallery = [...topItems, ...otherItems]

export const GALLERY_ITEMS = finalOrderedGallery.map((item, index) => ({
  ...item,
  id: `gallery-${item.type === 'video' ? 'v' : 'p'}-${index}`,
}))





