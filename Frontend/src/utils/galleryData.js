// Dynamically import all media from src/assets/Gallery using Vite's native import.meta.glob
const mediaModules = import.meta.glob(['../assets/Gallery/*.*', '../assets/New folder/Gallery/*.*'], {
  eager: true,
  import: 'default',
})

const videoExtensions = new Set(['mp4', 'mov', 'webm', 'ogg', 'm4v'])

export const GALLERY_CATEGORIES = [
  { key: 'all', label: 'All Chronicles' },
  { key: 'marine', label: 'Marine Life' },
  { key: 'scuba', label: 'Scuba Diving' },
  { key: 'activity', label: 'Ocean Activities' },
  { key: 'videos', label: 'Motion Reels' },
  { key: 'photos', label: 'High-Res Stills' },
]

export const GALLERY_ITEMS = Object.entries(mediaModules).map(([filePath, src], index) => {
  const filename = filePath.split('/').pop() || ''
  const ext = (filename.split('.').pop() || '').toLowerCase()
  const isVideo = videoExtensions.has(ext)

  let category = 'activity'
  const lower = filename.toLowerCase()
  if (
    lower.includes('manta') ||
    lower.includes('turtle') ||
    lower.includes('lionfish') ||
    lower.includes('lobster') ||
    lower.includes('fish') ||
    lower.includes('closeup') ||
    lower.includes('coral')
  ) {
    category = 'marine'
  } else if (
    lower.includes('dive') ||
    lower.includes('gx01') ||
    lower.includes('trim') ||
    lower.includes('dji_mimo') ||
    lower.includes('life')
  ) {
    category = 'scuba'
  }

  let cleanTitle = filename.replace(/\.[^/.]+$/, '').replace(/[_\\-]+/g, ' ').trim()
  if (cleanTitle.length > 35) cleanTitle = cleanTitle.slice(0, 35) + '...'

  return {
    id: `gallery-${isVideo ? 'v' : 'p'}-${index}`,
    type: isVideo ? 'video' : 'image',
    src,
    title: cleanTitle || (isVideo ? 'Ocean Reel' : 'Marine Photo'),
    location: isVideo ? 'Havelock Island, Andaman' : 'Andaman Archipelago',
    category,
  }
})
