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
import vidTurtleAnna from '../assets/New folder/Turtle Anna(1).mp4'
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
  // Videos
  { id: 'vid-turtle-anna', type: 'video', src: vidTurtleAnna, category: 'marine' },
  { id: 'vid-dive', type: 'video', src: vidDive, category: 'scuba' },
  { id: 'vid-freediving-1', type: 'video', src: vidFreeDiving1, category: 'freediving' },
  { id: 'vid-dji-0007', type: 'video', src: vidDJI_0007, category: 'ocean' },
  { id: 'vid-surfing', type: 'video', src: vidSurfing, category: 'surfing' },
  { id: 'vid-gallery1', type: 'video', src: vidGallery1, category: 'ocean' },
  { id: 'vid-freediving-2', type: 'video', src: vidFreeDiving2, category: 'freediving' },
  { id: 'vid-dji-0011', type: 'video', src: vidDJI_0011, category: 'ocean' },
  { id: 'vid-gx8841', type: 'video', src: vidGX8841, category: 'scuba' },
  { id: 'vid-dji-0017', type: 'video', src: vidDJI_0017, category: 'marine' },
  { id: 'vid-dji-0018', type: 'video', src: vidDJI_0018, category: 'marine' },
  { id: 'vid-travel', type: 'video', src: vidTravel, category: 'lifestyle' },
  { id: 'vid-freediving-3', type: 'video', src: vidFreeDiving3, category: 'freediving' },
  { id: 'vid-dji-mimo1', type: 'video', src: vidDjiMimo1, category: 'ocean' },
  { id: 'vid-dji-mimo2', type: 'video', src: vidDjiMimo2, category: 'marine' },
  { id: 'vid-dji-mimo3', type: 'video', src: vidDjiMimo3, category: 'marine' },
  { id: 'vid-dji-mimo4', type: 'video', src: vidDjiMimo4, category: 'marine' },
  { id: 'vid-gx8833', type: 'video', src: vidGX8833, category: 'scuba' },
  { id: 'vid-itinerary', type: 'video', src: vidItinerary, category: 'lifestyle' },
  { id: 'vid-20260630', type: 'video', src: vid20260630, category: 'ocean' },
  { id: 'vid-20260707-1', type: 'video', src: vid20260707_1, category: 'ocean' },
  { id: 'vid-20260707-2', type: 'video', src: vid20260707_2, category: 'ocean' },
  { id: 'vid-merch5', type: 'video', src: vidMerch5, category: 'merch' },

  // Photos from New Folder
  { id: 'img-gallery1', type: 'image', src: imgGallery1, category: 'scuba' },
  { id: 'img-stay', type: 'image', src: imgStay, category: 'lifestyle' },
  { id: 'img-food', type: 'image', src: imgFood, category: 'lifestyle' },
  { id: 'img-merch1', type: 'image', src: imgMerch1, category: 'merch' },
  { id: 'img-merch2', type: 'image', src: imgMerch2, category: 'merch' },
  { id: 'img-merch3', type: 'image', src: imgMerch3, category: 'merch' },
  { id: 'img-merch4', type: 'image', src: imgMerch4, category: 'merch' },

  // Carousel Photos
  { id: 'img-c1', type: 'image', src: c1, category: 'scuba' },
  { id: 'img-c2', type: 'image', src: c2, category: 'marine' },
  { id: 'img-c3', type: 'image', src: c3, category: 'scuba' },
  { id: 'img-c4', type: 'image', src: c4, category: 'surfing' },
  { id: 'img-c5', type: 'image', src: c5, category: 'lifestyle' },
  { id: 'img-c6', type: 'image', src: c6, category: 'scuba' },
]

export const GALLERY_CATEGORIES = [
  { key: 'all', label: 'All Media' },
  { key: 'videos', label: 'Videos' },
  { key: 'photos', label: 'Photos' },
  { key: 'scuba', label: 'Scuba Diving' },
  { key: 'freediving', label: 'Freediving' },
  { key: 'marine', label: 'Marine Life' },
  { key: 'surfing', label: 'Surfing' },
  { key: 'lifestyle', label: 'Island Life & Stay' },
  { key: 'merch', label: 'Gear & Merch' },
]
