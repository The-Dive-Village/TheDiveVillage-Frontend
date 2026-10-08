// Curated Gallery & High-Res Diving Photos from assets/Gallery
import p1 from '../assets/Gallery/5.jpg'
const p2 = 'https://res.cloudinary.com/qvbunv8y/image/upload/v1791458048/TDV-Media/Extras%20for%20Gallery/Blue_Lincka.webp';
import p3 from '../assets/Gallery/Photo00086574.jpg'
import p4 from '../assets/Gallery/Photo00086587.jpg'
import p6 from '../assets/Gallery/Photo00086738.jpg'
import p7 from '../assets/Gallery/Photo00086739.jpg'
import p8 from '../assets/Gallery/Photo00086742.jpg'
import p9 from '../assets/Gallery/Photo00086765.jpg'
import p10 from '../assets/Gallery/Photo00086771.jpg'
import p11 from '../assets/Gallery/Photo00086776.jpg'
import p12 from '../assets/Gallery/Photo00086787.jpg'

const panelModules = import.meta.glob('../assets/Media/Panels/*.*', { eager: true, import: 'default' })
export const PANEL_IMAGES = Object.values(panelModules)
export const CAROUSEL_IMAGES = PANEL_IMAGES.slice(0, 6)

/** Verified high-resolution diving photography */
export const IMAGES = {
  hero: p1,
  whyChoose: p2,
  dest1: p3,
  dest2: p4,
  dest3: p6,
  dest4: p7,
  gallery1: p7,
  gallery2: p8,
  gallery3: p9,
  instructor1: p4,
  instructor2: p6,
  gear1: p7,
  gear2: p1,
  contact: p2,
  snorkelingHero: p3,
  snorkelingFeat1: p4,
  snorkelingFeat2: p6,
  snorkelingStats: p7,
  scubaHero: p1,
  scubaFeat1: p2,
  scubaFeat2: p3,
  scubaStats: p4,
  surfingHero: p6,
  surfingFeat1: p7,
  surfingFeat2: p8,
  surfingStats: p9,
}

export const FEATURED_EXPERIENCES = [
  {
    id: 'exp-1',
    title: 'Try Dive Experience',
    location: 'Kadmat Island, Lakshadweep',
    category: 'Beginner',
    price: 9999,
    badge: 'Popular',
    badgeTone: 'accent',
    image: p1,
  },
  {
    id: 'exp-2',
    title: 'Open Water Diver',
    location: 'Agatti Island, Lakshadweep',
    category: 'Certification',
    price: 19999,
    badge: 'Certification',
    badgeTone: 'cta',
    image: p2,
  },
  {
    id: 'exp-3',
    title: 'Discover Snorkeling',
    location: 'Coral Gardens, Kadmat',
    category: 'Non-Divers',
    price: 4999,
    badge: 'Relaxing',
    badgeTone: 'accent',
    image: p3,
  },
  {
    id: 'exp-4',
    title: 'Fun Dives Package',
    location: 'White Sands, Agatti',
    category: 'Packages',
    price: 14999,
    badge: 'Flexible',
    badgeTone: 'cta',
    image: p4,
  },
]
