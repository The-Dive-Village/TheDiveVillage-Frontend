// Curated Gallery & High-Res Diving Photos from assets/Gallery
const p1 = '/media/TDV-Media/Extras%20for%20Gallery/Scubadiving.webp';
const p2 = '/media/TDV-Media/Extras%20for%20Gallery/Blue_Lincka.webp';
const p3 = '/media/TDV-Media/Extras%20for%20Gallery/Open_Water_Scuba_Diving.webp';
const p4 = '/media/TDV-Media/Extras%20for%20Gallery/Scubadiving_2.webp';
const p6 = '/media/TDV-Media/Extras%20for%20Gallery/Scubadiving.webp';
const p7 = '/media/TDV-Media/Extras%20for%20Gallery/Sea_fan.webp';
const p8 = '/media/TDV-Media/Extras%20for%20Gallery/Shoal.webp';
const p9 = '/media/TDV-Media/Extras%20for%20Gallery/Sunset.jpg';
const p10 = '/media/TDV-Media/Extras%20for%20Gallery/Banded_Coral_Shrimp.webp';
const p11 = '/media/TDV-Media/Extras%20for%20Gallery/Varicose_Wart_Slug.webp';
const p12 = '/media/TDV-Media/Extras%20for%20Gallery/Yellowback_fusiliers.webp';

export const PANEL_IMAGES = [
  "/media/TDV-Media/Panels/1Threadfin%20Butterflyfish.webp",
  "/media/TDV-Media/Panels/2Lionfish.webp",
  "/media/TDV-Media/Panels/3Crown%20Jellyfish.webp",
  "/media/TDV-Media/Panels/4Blue%20and%20Gold%20Fusilier.webp",
  "/media/TDV-Media/Panels/5Bubble%20Coral.webp",
  "/media/TDV-Media/Panels/6Crown%20of%20thorns%20Starfish.webp",
  "/media/TDV-Media/Panels/7Toadstool%20Leather%20Coral.webp",
  "/media/TDV-Media/Panels/8Feather%20Star%20%282%29.webp",
  "/media/TDV-Media/Panels/9Giant%20Clam.webp",
  "/media/TDV-Media/Panels/10Greenfish%20Sea%20Cucumber.webp"
]
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
