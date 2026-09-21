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
  '8.jpg': { title: 'Baitfish', category: 'marine' },
  'AI.jpg': { title: 'Coral Reef Ecosystem', category: 'marine' },
  'Additional dive ater dsd.mp4': { title: 'Sweetlips/Grunts', category: 'scuba' },
  'Articulata.JPG': { title: 'Feather Star / Sea Lily (Articulata)', category: 'marine' },
  'Blue Lincka.jpg': { title: 'Blue Linckia Starfish (Blue Sea Star)', category: 'marine' },
  'Bubblemaker.mp4': { title: 'Browstripe Red Snapper', category: 'scuba' },
  'Buoyancy.mp4': { title: 'Green Sea Turtle', category: 'marine' },
  'Certified Courses.jpg': { title: 'Certified Courses Training', category: 'scuba' },
  'Closeup1.mp4': { title: 'Table Coral & Damselfish', category: 'marine' },
  'Crown of thorns.JPG': { title: 'Crown-of-Thorns Starfish', category: 'marine' },
  'DSD lite.mp4': { title: 'Discover Scuba Diving (DSD Lite)', category: 'scuba' },
  'Dawn Dive.mp4': { title: 'Dawn Dive Expedition', category: 'scuba' },
  'Deepdiver.mp4': { title: 'Green Sea Turtle', category: 'marine' },
  'Discover Scuba.mp4': { title: 'Lionfish', category: 'marine' },
  'Flexible Fun Dives.jpg': { title: 'Flexible Fun Dives', category: 'scuba' },
  'Flexible Fun Dives.png': { title: 'Guided Coral Wall Dive', category: 'scuba' },
  'Free Diving (2).jpg': { title: 'Freediving Ocean Depths', category: 'freediving' },
  'Free Diving 1.mp4': { title: 'Freediving Single-Breath Journey', category: 'freediving' },
  'Free Diving.jpg': { title: 'Freediving Descent & Exploration', category: 'freediving' },
  'Free Diving.png': { title: 'Freediving Natural Flight', category: 'freediving' },
  'Freedivingfun.mp4': { title: 'Freediving Fun & Practice', category: 'freediving' },
  'Introductory Programs.png': { title: 'Introductory Programs Briefing', category: 'scuba' },
  'Jellyfish.mp4': { title: 'Moon Jellyfish', category: 'marine' },
  'Leaf Scorpian fish.mp4': { title: 'Leaf Scorpionfish', category: 'marine' },
  'Nightdive.jpg': { title: 'Night Dive Illumination', category: 'scuba' },
  'Photo00086440.jpg': { title: 'Dark Banded Fusiliers', category: 'marine' },
  'Photo00086448.jpg': { title: 'Thorny Oyster', category: 'marine' },
  'Photo00086450.jpg': { title: 'Feather Star', category: 'marine' },
  'Photo00086451.jpg': { title: 'Sea Cucumber on Sandy Reef #4', category: 'marine' },
  'Photo00086454.jpg': { title: 'Trained Dives', category: 'scuba' },
  'Photo00086476.jpg': { title: 'Batfish', category: 'marine' },
  'Photo00086485.jpg': { title: 'Moon Jellyfish', category: 'marine' },
  'Photo00086509.jpg': { title: 'Feather Star', category: 'marine' },
  'Photo00086561.jpg': { title: 'Trained Diver', category: 'scuba' },
  'Photo00086567.jpg': { title: 'Lionfish', category: 'marine' },
  'Photo00086573.jpg': { title: 'Dark Banded Fusilier', category: 'marine' },
  'Photo00086574.jpg': { title: 'Toadstool Leather Coral', category: 'marine' },
  'Photo00086576.jpg': { title: 'School of Fusiliers', category: 'marine' },
  'Photo00086578.jpg': { title: 'Bluestripe Snapper', category: 'marine' },
  'Photo00086586.jpg': { title: 'Water Snake', category: 'marine' },
  'Photo00086587.jpg': { title: 'Crown-of-Thorns on Coral #16', category: 'marine' },
  'Photo00086588.jpg': { title: 'Bubble Coral', category: 'marine' },
  'Photo00086611.jpg': { title: 'Threadfin Butterflyfish', category: 'marine' },
  'Photo00086694.jpg': { title: 'Green Sea Turtle', category: 'marine' },
  'Photo00086723.jpg': { title: 'DSD Confined Water Practice #20', category: 'scuba' },
  'Photo00086726.jpg': { title: 'Blackspotted Pufferfish', category: 'marine' },
  'Photo00086738.jpg': { title: 'Green Feather Star', category: 'marine' },
  'Photo00086739.jpg': { title: 'Feather Star', category: 'marine' },
  'Photo00086742.jpg': { title: 'Ananas Sea Cucumber', category: 'marine' },
  'Photo00086760.jpg': { title: 'Snorkeling Over Lagoon Reef #25', category: 'freediving' },
  'Photo00086761.jpg': { title: 'Sweetlips', category: 'marine' },
  'Photo00086765.jpg': { title: 'Crown Jellyfish', category: 'marine' },
  'Photo00086771.jpg': { title: 'Varicose Wart Slug', category: 'marine' },
  'Photo00086776.jpg': { title: 'Boring Giant Clam', category: 'marine' },
  'Photo00086787.jpg': { title: 'Clearfin Lionfish', category: 'marine' },
  'Photo00086792.jpg': { title: 'Anemone Fish', category: 'marine' },
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
  'Sea fan.jpg': { title: 'Sea Fan / Gorgonian Coral', category: 'marine' },
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
  'Turtle Flyinnn.mp4': { title: 'Green Sea Turtle Gliding', category: 'marine' },
  'Turtle.mp4': { title: 'Green Sea Turtle / Hawksbill Turtle', category: 'marine' },
  'Turtlefish.mp4': { title: 'Sea Turtle & Reef Fish Colony', category: 'marine' },
  'Welcome.mp4': { title: 'Welcome to The Dive Village', category: 'scenery' },
  'boat.mp4': { title: 'Dive Boat Transfer', category: 'scenery' },
  'bush.mp4': { title: 'Soft Coral & Bush Coral Garden', category: 'marine' },
  'diving12.mp4': { title: '12-Dive Island Safari', category: 'scuba' },
  'free diving .mp4': { title: 'Freediving Depth Exploration', category: 'freediving' },
  'free diving 3.mp4': { title: 'Freediving Reef Discovery', category: 'freediving' },
  'gallery1.mp4': { title: 'Island Surf Safari', category: 'scenery' },
  'lionfish.MP4': { title: 'Lionfish (Pterois)', category: 'marine' },
  'merch 5.mp4': { title: 'Dive Village Gear Showcase', category: 'scenery' },
  'nitrox.mp4': { title: 'Enriched Air Nitrox Diving', category: 'scuba' },
  'procourse (2).mp4': { title: 'Schooling Vortex', category: 'marine' },
  'procourse.mp4': { title: 'Divemaster Professional Course', category: 'scuba' },
  'procourse1.mp4': { title: 'Giant Barrel Sponge', category: 'marine' },
  'procourse2.mp4': { title: 'Professional Ocean Leadership', category: 'scuba' },
  'projectaware.mp4': { title: 'Sardine Run', category: 'marine' },
  'surfing.mp4': { title: 'Surfing & Island Waves', category: 'scenery' },
  'zero2hero.jpg': { title: 'Zero to Hero Career Pathway', category: 'scuba' }
}

export const GALLERY_ITEMS = Object.entries(mediaModules)
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
    }
  })
