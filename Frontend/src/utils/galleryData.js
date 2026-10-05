const extrasModules = import.meta.glob('../assets/Media/Extras for Gallery/*.*', { eager: true, import: 'default' })

const videoExtensions = new Set(['mp4', 'mov', 'webm', 'ogg', 'm4v', 'MP4'])

export const GALLERY_CATEGORIES = [
  { key: 'all', label: 'All Chronicles' },
  { key: 'marine', label: 'Marine Life' },
  { key: 'scuba', label: 'Scuba & Courses' },
  { key: 'freediving', label: 'Freediving & Snorkeling' },
  { key: 'scenery', label: 'Scenery & Surface' },
  { key: 'videos', label: 'Motion Reels' },
  { key: 'photos', label: 'High-Res Stills' },
]

function mapModules(modules, defaultCategory) {
  return Object.entries(modules).map(([filePath, src], index) => {
    const filename = filePath.split('/').pop() || ''
    const ext = (filename.split('.').pop() || '').toLowerCase()
    const isVideo = videoExtensions.has(ext)
    
    // Title is just the filename as requested
    const title = filename.replace(/\.[^/.]+$/, '').trim()

    return {
      id: `${defaultCategory}-${isVideo ? 'v' : 'p'}-${index}`,
      type: isVideo ? 'video' : 'image',
      src,
      title,
      category: defaultCategory,
      filename,
    }
  })
}

const extrasItems = mapModules(extrasModules, 'marine')

export const GALLERY_ITEMS = [
  ...extrasItems,
]
  .sort((a, b) => {
    if (a.type === 'video' && b.type === 'image') return -1
    if (a.type === 'image' && b.type === 'video') return 1
    return 0
  })
  .map((item, index) => ({
    ...item,
    id: `gallery-item-${index}`
  }))
