// Dynamically import all media from src/assets/Gallery using Vite's native import.meta.glob
const mediaModules = import.meta.glob(['../assets/Gallery/*.*', '../assets/New folder/Gallery/*.*'], {
  eager: true,
  import: 'default',
})

const videoExtensions = new Set(['mp4', 'mov', 'webm', 'ogg', 'm4v'])
const EXCLUDED_FILES = new Set(['food.jpg', 'manta3.mp4'])

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
  '5.jpg': { title: 'Table Coral & Giant Clam', category: 'marine' },
  '6.jpg': { title: 'Soft Coral & Bush Coral', category: 'marine' },
  '7.jpg': { title: 'Thorny Oyster & Gorgonian Fan', category: 'marine' },
  '8 dive.mp4': { title: '8-Dive Adventure Package', category: 'scuba' },
  '8.jpg': { title: 'Brain Coral & Table Coral', category: 'marine' },
  'AI.jpg': { title: 'Coral Reef Ecosystem', category: 'marine' },
  'Additional dive ater dsd.mp4': { title: 'Guided DSD Exploration', category: 'scuba' },
  'Articulata.JPG': { title: 'Feather Star / Sea Lily (Articulata)', category: 'marine' },
  'Blue Lincka.jpg': { title: 'Blue Linckia Starfish (Blue Sea Star)', category: 'marine' },
  'Bubblemaker.mp4': { title: 'Bubblemaker Scuba Experience', category: 'scuba' },
  'Buoyancy.mp4': { title: 'Buoyancy Control Practice', category: 'scuba' },
  'Certified Courses.jpg': { title: 'Certified Courses Training', category: 'scuba' },
  'Closeup1.mp4': { title: 'Clownfish & Anemone Colony', category: 'marine' },
  'Crown of thorns.JPG': { title: 'Crown-of-Thorns Starfish', category: 'marine' },
  'DSD lite.mp4': { title: 'Discover Scuba Diving (DSD Lite)', category: 'scuba' },
  'Dawn Dive.mp4': { title: 'Dawn Dive Expedition', category: 'scuba' },
  'Deepdiver.mp4': { title: 'Deep Dive Exploration', category: 'scuba' },
  'Discover Scuba.mp4': { title: 'Discover Scuba Diving (DSD) Experience', category: 'scuba' },
  'Flexible Fun Dives.jpg': { title: 'Flexible Fun Dives', category: 'scuba' },
  'Flexible Fun Dives.png': { title: 'Guided Coral Wall Dive', category: 'scuba' },
  'Free Diving (2).jpg': { title: 'Freediving Ocean Depths', category: 'freediving' },
  'Free Diving 1.mov': { title: 'Freediving Single-Breath Journey', category: 'freediving' },
  'Free Diving.jpg': { title: 'Freediving Descent & Exploration', category: 'freediving' },
  'Free Diving.png': { title: 'Freediving Natural Flight', category: 'freediving' },
  'Freedivingfun.mp4': { title: 'Freediving Fun & Practice', category: 'freediving' },
  'Introductory Programs.png': { title: 'Introductory Programs Briefing', category: 'scuba' },
  'Jellyfish.mp4': { title: 'Bioluminescent Jellyfish', category: 'marine' },
  'Leaf Scorpian fish.mp4': { title: 'Leaf Scorpionfish', category: 'marine' },
  'Nightdive.jpg': { title: 'Night Dive Illumination', category: 'scuba' },
  'Photo00086440.jpg': { title: 'Giant Clam (Tridacna) #1', category: 'marine' },
  'Photo00086448.jpg': { title: 'Brain Coral & Reef Shoal #2', category: 'marine' },
  'Photo00086450.jpg': { title: 'Lionfish (Pterois) in Blue #3', category: 'marine' },
  'Photo00086451.jpg': { title: 'Sea Cucumber on Sandy Reef #4', category: 'marine' },
  'Photo00086454.jpg': { title: 'Clownfish / Anemonefish #5', category: 'marine' },
  'Photo00086476.jpg': { title: 'Leaf Scorpionfish & Soft Coral #6', category: 'marine' },
  'Photo00086485.jpg': { title: 'Feather Star & Sea Lily #7', category: 'marine' },
  'Photo00086509.jpg': { title: 'Giant Clam & Table Coral #8', category: 'marine' },
  'Photo00086561.jpg': { title: 'Green Sea Turtle Grazing #9', category: 'marine' },
  'Photo00086567.jpg': { title: 'Blue Sponge & Sea Fan #10', category: 'marine' },
  'Photo00086573.jpg': { title: 'School of Fusiliers / Shoal #11', category: 'marine' },
  'Photo00086574.jpg': { title: 'Soft Coral & Bush Coral #12', category: 'marine' },
  'Photo00086576.jpg': { title: 'Whale Shark Silhouette #13', category: 'marine' },
  'Photo00086578.jpg': { title: 'Stingray / Whipray Over Reef #14', category: 'marine' },
  'Photo00086586.jpg': { title: 'Manta Ray in the Blue #15', category: 'marine' },
  'Photo00086587.jpg': { title: 'Crown-of-Thorns on Coral #16', category: 'marine' },
  'Photo00086588.jpg': { title: 'Blue Linckia Starfish #17', category: 'marine' },
  'Photo00086611.jpg': { title: 'Open Water Diver Descent #18', category: 'scuba' },
  'Photo00086694.jpg': { title: 'Advanced Course Buoyancy Drill #19', category: 'scuba' },
  'Photo00086723.jpg': { title: 'DSD Confined Water Practice #20', category: 'scuba' },
  'Photo00086726.jpg': { title: 'Project AWARE / Eco Dive #21', category: 'scuba' },
  'Photo00086738.jpg': { title: 'Gorgonian Sea Fan Detail #22', category: 'marine' },
  'Photo00086739.jpg': { title: 'School of Barracuda / Shoal #23', category: 'marine' },
  'Photo00086742.jpg': { title: 'Hawksbill Turtle Close-up #24', category: 'marine' },
  'Photo00086760.jpg': { title: 'Snorkeling Over Lagoon Reef #25', category: 'freediving' },
  'Photo00086761.jpg': { title: 'Freediver Coastal Exploration #26', category: 'freediving' },
  'Photo00086765.jpg': { title: 'Coral Garden & Marine Life #27', category: 'marine' },
  'Photo00086771.jpg': { title: 'Tropical Island Dive Site #28', category: 'scenery' },
  'Photo00086776.jpg': { title: 'Dive Boat Approaching Reef #29', category: 'scenery' },
  'Photo00086787.jpg': { title: 'Tropical Sunset Over Andaman Horizon #30', category: 'scenery' },
  'Photo00086792.jpg': { title: 'Tropical Sunset & Resort Stays #31', category: 'scenery' },
  'Ray.mp4': { title: 'Stingray / Whipray', category: 'marine' },
  'Ray1.mp4': { title: 'Spotted Eagle Ray', category: 'marine' },
  'Reefplant.mp4': { title: 'Soft Coral & Bush Coral', category: 'marine' },
  'Scuba1.jpg': { title: 'Open Water / Advanced Course', category: 'scuba' },
  'Scuba2.MP4': { title: 'Advanced Diver Navigation', category: 'scuba' },
  'Scuba2.jpg': { title: 'Deep Dive Descent', category: 'scuba' },
  'Scuba3.MP4': { title: 'Coral Reef Exploration Dive', category: 'scuba' },
  'Scuba3.jpg': { title: 'Diver Safety Briefing', category: 'scuba' },
  'Scuba4.jpg': { title: 'Buddy Team Underwater Check', category: 'scuba' },
  'Scuba4.mp4': { title: 'Buoyancy Control Practice', category: 'scuba' },
  'Scuba5.jpg': { title: 'Confined Water Skills', category: 'scuba' },
  'Scuba5.mp4': { title: 'Open Water Training Dives', category: 'scuba' },
  'Scuba6.mp4': { title: 'Drift Diving & Current Flow', category: 'scuba' },
  'Scuba7.mp4': { title: 'Underwater Marine Safari', category: 'scuba' },
  'Scuba8.mp4': { title: 'Peak Performance Buoyancy', category: 'scuba' },
  'Scuba9.MP4': { title: 'Safety Stop & Ascent', category: 'scuba' },
  'Scubadiving.jpg': { title: 'Scuba Diving Underwater Journey', category: 'scuba' },
  'Sea fan.jpg': { title: 'Sea Fan / Gorgonian Coral', category: 'marine' },
  'Seafan.mp4': { title: 'Gorgonian Coral Current Flow', category: 'marine' },
  'Shoal.jpg': { title: 'School of Fish / Shoal', category: 'marine' },
  'Sky1.jpg': { title: 'Tropical Island Horizon', category: 'scenery' },
  'Snorkeling.png': { title: 'Snorkeling with Marine Life', category: 'freediving' },
  'Snorkelling2.mp4': { title: 'Guided Snorkel Safari', category: 'freediving' },
  'Snorkelling3.mp4': { title: 'Snorkeling Over Shallow Reef', category: 'freediving' },
  'Snorkelling4.mp4': { title: 'Snorkeling with Sea Life', category: 'freediving' },
  'Stay.jpg': { title: 'Tropical Sunset & Resort Stays', category: 'scenery' },
  'Stays.mp4': { title: 'Village Stays & Island Calm', category: 'scenery' },
  'Thorny Oyster.jpg': { title: 'Giant Clam / Thorny Oyster (Spondylus)', category: 'marine' },
  'Travel.mp4': { title: 'Dive Boat Transfer & Island Ride', category: 'scenery' },
  'Try Dive.mp4': { title: 'Try Dive Introductory Session', category: 'scuba' },
  'Turtle Anna.mp4': { title: 'Hawksbill Turtle Encounter', category: 'marine' },
  'Turtle Flyinnn.mov': { title: 'Green Sea Turtle Gliding', category: 'marine' },
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
  'procourse (2).mp4': { title: 'Pro Diver Leadership Skills', category: 'scuba' },
  'procourse.mp4': { title: 'Divemaster Professional Course', category: 'scuba' },
  'procourse1.mp4': { title: 'Rescue Diver & Safety Scenarios', category: 'scuba' },
  'procourse2.mp4': { title: 'Professional Ocean Leadership', category: 'scuba' },
  'projectaware.mp4': { title: 'Project AWARE / Eco Dive', category: 'scuba' },
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
