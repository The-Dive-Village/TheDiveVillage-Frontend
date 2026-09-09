import { CAROUSEL_IMAGES } from '../utils/images'

export const CATEGORIES = [
  { key: 'all', label: 'All Services' },
  { key: 'recreation', label: 'Recreation' },
  { key: 'bubble', label: 'Bubblemaker' },
  { key: 'courses', label: 'Courses' },
  { key: 'programs', label: 'Programs' },
  { key: 'specialities', label: 'Specialities' },
  { key: 'fundives', label: 'Fun Dives' },
  { key: 'combos', label: 'Combos' },
  { key: 'pro', label: 'Pro Courses' },
  { key: 'freediving', label: 'Freediving' },
  { key: 'snorkeling', label: 'Snorkeling' },
  { key: 'surfing', label: 'Surfing' },
]

const RAW_SERVICES_DATA = [
  // 1. Recreation (Try Dive / DSD)
  {
    id: 'prog-1', category: 'recreation', categories: ['recreation', 'programs'],
    title: 'Try Dive',
    short_desc: 'A short introduction dives for beginners.',
    long_desc: 'Experience scuba safely in shallow water with a briefing, shallow water training and a guided dive upto 4 meters for 10 minutes.',
    banner: 'assets/bg-video.mp4',
    highlights: 'Max Depth: 4m | Dive Time: 10 mins | Total Time: 45 mins | Photos & videos included',
    days_min: '', days_max: '', min_age: 8
  },
  {
    id: 'prog-2', category: 'recreation', categories: ['recreation', 'programs'],
    title: 'DSD Lite',
    short_desc: 'A lighter version of Discover Scuba Dive.',
    long_desc: 'Includes a briefing, shallow water training, and a guided dive upto 12 meters for a maximum of 20 minutes.',
    banner: 'assets/bg-video.mp4',
    highlights: 'Max Depth: 12m (or 4m for kids/medical) | Dive Time: 20 mins | Total Time: 1 hr | Photos & videos included',
    days_min: '', days_max: '', min_age: 10
  },
  {
    id: 'prog-3', category: 'recreation', categories: ['recreation', 'programs'],
    title: 'PADI Discover Scuba Dive',
    short_desc: 'The official PADI Discover Scuba Diving program.',
    long_desc: 'PADI\'s official introductory scuba diving program where you will learn the basics of scuba diving, practice skills in confined water, and do an open water dive under upto 12 meters for 45 mins under the close supervision of a PADI Instructor.',
    banner: 'assets/bg-video.mp4',
    highlights: 'Max Depth: 12m | Dive Time: 45 mins | Total Time: 3 hrs | Photos & videos included',
    days_min: '', days_max: '', min_age: ''
  },
  {
    id: 'prog-5', category: 'recreation', categories: ['recreation', 'programs'],
    title: 'Additional Dive after DSD',
    short_desc: 'Extra guided dive after DSD.',
    long_desc: 'Extend your Discover Scuba Dive experience with a guided dive with a PADI Pro.',
    banner: 'assets/bg-video.mp4',
    highlights: 'Dive Time: 45 mins | Photos & videos may be included',
    days_min: '', days_max: '', min_age: ''
  },
  // 2. Bubblemaker
  {
    id: 'prog-4', category: 'bubble', categories: ['bubble', 'programs'],
    title: 'PADI Bubblemaker',
    short_desc: 'Scuba fun for kids aged between 8 to 10.',
    long_desc: 'The PADI Bubblemaker introduces children to scuba in a safe pool like environment.',
    banner: 'assets/bg-video.mp4',
    highlights: 'Max Depth: 2m | Dive Time: 30 mins | PADI registration included',
    days_min: '', days_max: '', min_age: 8
  },
  // 3. Snorkeling
  {
    id: 'snork-1', category: 'snorkeling', categories: ['snorkeling', 'programs'],
    title: 'Discover Snorkeling',
    short_desc: 'Learn the basics of snorkeling in a safe, guided setting.',
    long_desc: 'Includes briefing, equipment use orientation, and a 1 hour open water snorkeling session with a professional leading you.',
    banner: 'assets/bg-video.mp4',
    highlights: 'Total Time: 1 hr | Knowledge development + water session',
    days_min: '', days_max: '', min_age: ''
  },
  {
    id: 'snork-2', category: 'snorkeling', categories: ['snorkeling', 'programs'],
    title: 'Reef Explorer',
    short_desc: 'Guided reef snorkeling for beginners.',
    long_desc: 'Perfect shallow-water snorkel trip to see colorful reef fish, corals, and safe lagoon sites.',
    banner: 'assets/bg-video.mp4',
    highlights: 'Total Time: 1–1.5 hrs | Suitable for all ages',
    days_min: '', days_max: '', min_age: ''
  },
  {
    id: 'snork-3', category: 'snorkeling', categories: ['snorkeling', 'programs'],
    title: 'Ocean Explorer',
    short_desc: 'Snorkel further into the blue.',
    long_desc: 'Explore deeper reef areas, spot turtles and bigger marine life, with guided safety.',
    banner: 'assets/bg-video.mp4',
    highlights: 'Total Time: 1.5–2 hrs | Includes equipment & guide',
    days_min: '', days_max: '', min_age: ''
  },
  // 3. Courses
  {
    id: 'course-1', category: 'courses',
    title: 'PADI Skin Diver',
    short_desc: 'Learn snorkeling & skin diving.',
    long_desc: 'Dive on a single breath upto 6 meters. Learn the basics of breath-hold diving, safety considerations and efficient technique.',
    banner: 'assets/bg-video.mp4',
    highlights: 'Duration: 1–2 days | Includes knowledge + water sessions',
    days_min: 1, days_max: 1, min_age: ''
  },
  {
    id: 'course-2', category: 'courses',
    title: 'PADI Scuba Diver',
    short_desc: 'Entry-level certification.',
    long_desc: 'The first step towards scuba certification for beginners with limited time. The certification will enable you to dive upto 12m under professional supervision. Upgrade to open water diver anytime by completing the remaining training sections. Includes theory, confined water skill development and 2 open water dives upto 12 meters.',
    banner: 'assets/bg-video.mp4',
    highlights: 'Duration: 1–2 days | Credit toward Open Water',
    days_min: 1, days_max: 2, min_age: 10
  },
  {
    id: 'course-3', category: 'courses',
    title: 'PADI Open Water Diver',
    short_desc: 'The world’s most popular scuba certification.',
    long_desc: 'Learn essential dive theory, skills, and complete 4 open water dives. This certification lets you dive upto 18m without professional supervision.',
    banner: 'assets/bg-video.mp4',
    highlights: 'Duration: 3–4 days | Certification to 18m',
    days_min: 3, days_max: 4, min_age: 10
  },
  {
    id: 'course-4', category: 'courses',
    title: 'PADI Adventure Diver',
    short_desc: 'Complete 3 adventure dives.',
    long_desc: 'Expand skills in areas like navigation, buoyancy, or night diving.',
    banner: 'assets/bg-video.mp4',
    highlights: 'Duration: 1–2 days | Credit toward Advanced | Prerequisites: Open Water Diver',
    days_min: 1, days_max: 2, min_age: 10
  },
  {
    id: 'course-5', category: 'courses',
    title: 'PADI Advanced Open Water',
    short_desc: 'Take your skills deeper.',
    long_desc: 'Includes 5 adventure dives: Deep + Navigation + 3 electives.',
    banner: 'assets/bg-video.mp4',
    highlights: 'Duration: 2–3 days | Certification to 30m | Prerequisites: Open water diver',
    days_min: 2, days_max: 3, min_age: 12
  },
  {
    id: 'course-6', category: 'courses',
    title: 'EFR Primary & Secondary Care',
    short_desc: 'Learn CPR and first aid.',
    long_desc: 'Emergency First Responder course for divers and non-divers. Develop Skills to be able to respond in a medical emergency and make a difference in saving peoples lives.',
    banner: 'assets/bg-video.mp4',
    highlights: 'Duration: 1–2 days | Certification valid 2 years',
    days_min: 1, days_max: 2, min_age: ''
  },
  {
    id: 'course-7', category: 'courses',
    title: 'PADI Rescue Diver',
    short_desc: 'Expand your rescue skills and become a safer diver.',
    long_desc: 'Learn to manage dive emergencies and assist other divers.',
    banner: 'assets/bg-video.mp4',
    highlights: 'Duration: 3–4 days | Prereq: Advanced + EFR',
    days_min: 3, days_max: 4, min_age: 12
  },
  {
    id: 'course-8', category: 'courses',
    title: 'PADI Reactivate (with dive)',
    short_desc: 'Refresh your skills with certification credit.',
    long_desc: 'Includes theory review and 1 open water dive.',
    banner: 'assets/bg-video.mp4',
    highlights: 'Duration: 1 day | 1 Open Water Dive',
    days_min: 1, days_max: 1, min_age: ''
  },
  {
    id: 'course-9', category: 'courses',
    title: 'Full Refresher (with dive)',
    short_desc: 'Refresher without certification credit.',
    long_desc: 'Skills practice and 1 open water dive.',
    banner: 'assets/bg-video.mp4',
    highlights: 'Duration: 1 day | 1 Open Water Dive',
    days_min: 1, days_max: 1, min_age: ''
  },
  {
    id: 'course-10', category: 'courses',
    title: 'Lite Refresher (confined only)',
    short_desc: 'Confined water refresher only.',
    long_desc: 'Quick skill refresh in pool or shallow water.',
    banner: 'assets/bg-video.mp4',
    highlights: 'Duration: 1 day | Confined water only',
    days_min: 1, days_max: 1, min_age: ''
  },
  // 4. Specialities
  {
    id: 'spec-1', category: 'specialities',
    title: 'Peak Performance Buoyancy',
    short_desc: 'Become a buoyancy master.',
    long_desc: 'Explore more and dive comfortably while improving air consumption, trim, finning and overall bouyancy skills.',
    banner: 'assets/bg-video.mp4',
    highlights: 'Duration: 1–2 days | Includes 2 dives | Prerequisites: Open Water Diver',
    days_min: 1, days_max: 1, min_age: ''
  },
  {
    id: 'spec-2', category: 'specialities',
    title: 'Project AWARE',
    short_desc: 'Support ocean conservation.',
    long_desc: 'Knowledge-based specialty focused on marine protection.',
    banner: 'assets/bg-video.mp4',
    highlights: 'Duration: 1–2 days | Non-diving course',
    days_min: 1, days_max: 1, min_age: ''
  },
  {
    id: 'spec-3', category: 'specialities',
    title: 'Deep Diver',
    short_desc: 'Dive deeper safely.',
    long_desc: 'Learn advanced deep diving by taking planning, techniques, and safety to the next level for 18–40m dives.',
    banner: 'assets/bg-video.mp4',
    highlights: 'Duration: 2 days | 4 dives | Prerequisites: Open Water',
    days_min: 2, days_max: 3, min_age: ''
  },
  {
    id: 'spec-4', category: 'specialities',
    title: 'Wreck Diver',
    short_desc: 'Explore underwater wrecks.',
    long_desc: 'Learn how to safely and effectively dive in wrecks.',
    banner: 'assets/bg-video.mp4',
    highlights: 'Duration: 1–2 days | 4 dives',
    days_min: 2, days_max: 3, min_age: ''
  },
  {
    id: 'spec-5', category: 'specialities',
    title: 'Night Diver',
    short_desc: 'Experience diving at night.',
    long_desc: 'Use torches, signals, and practice navigation in the dark.',
    banner: 'assets/bg-video.mp4',
    highlights: 'Duration: 2 days | 3 dives',
    days_min: 2, days_max: 3, min_age: ''
  },
  {
    id: 'spec-6', category: 'specialities',
    title: 'Enriched Air Nitrox',
    short_desc: 'Extend your bottom time.',
    long_desc: 'Learn safe use of enriched air nitrox for longer no-decompression limits.',
    banner: 'assets/bg-video.mp4',
    highlights: 'Duration: 1 day | Knowledge + practical session',
    days_min: 1, days_max: 1, min_age: ''
  },
  {
    id: 'spec-7', category: 'specialities',
    title: 'Drift Diver',
    short_desc: 'Go with the flow!',
    long_desc: 'Learn the techiques to be able to dive in moderate to strong current. Many of the world class diving sites are in areas of high current, so this certificaiton is very useful.',
    banner: 'assets/bg-video.mp4',
    highlights: 'Prerequisites: Open Water Diver',
    days_min: 2, days_max: 2, min_age: ''
  },
  // 5. Fun Dives
  {
    id: 'fun-1', category: 'fundives',
    title: '1 Dive',
    short_desc: 'A single dive for certified divers.',
    long_desc: 'Explore reefs or walls with a guided single dive.',
    banner: 'assets/bg-video.mp4',
    highlights: 'Certified divers only',
    days_min: '', days_max: '', min_age: ''
  },
  {
    id: 'fun-2', category: 'fundives',
    title: '2 Dives',
    short_desc: 'Two guided dives in one day.',
    long_desc: 'Perfect for a short trip, explore two dive sites.',
    banner: 'assets/bg-video.mp4',
    highlights: 'Certified divers only',
    days_min: '', days_max: '', min_age: ''
  },
  {
    id: 'fun-4', category: 'fundives',
    title: '4 Dives',
    short_desc: 'Four dives spread across your trip.',
    long_desc: 'Explore multiple sites with this dive package.',
    banner: 'assets/bg-video.mp4',
    highlights: 'Certified divers only',
    days_min: '', days_max: '', min_age: ''
  },
  {
    id: 'fun-6', category: 'fundives',
    title: '6 Dives',
    short_desc: 'Six dives for extended reef exploration.',
    long_desc: 'Enjoy a multi-day dive experience across different sites.',
    banner: 'assets/bg-video.mp4',
    highlights: 'Certified divers only',
    days_min: '', days_max: '', min_age: ''
  },
  {
    id: 'fun-8', category: 'fundives',
    title: '8 Dives',
    short_desc: 'Eight dives for avid explorers.',
    long_desc: 'Covers multiple days of diving across varied reefs',
    banner: 'assets/bg-video.mp4',
    highlights: 'Certified divers only',
    days_min: '', days_max: '', min_age: ''
  },
  {
    id: 'fun-10', category: 'fundives',
    title: '10 Dives',
    short_desc: 'Ten dive package for committed divers.',
    long_desc: 'Perfect balance of cost and adventure.',
    banner: 'assets/bg-video.mp4',
    highlights: 'Certified divers only',
    days_min: '', days_max: '', min_age: ''
  },
  {
    id: 'fun-12', category: 'fundives',
    title: '12 Dives',
    short_desc: 'Twelve dives for enthusiasts.',
    long_desc: 'Extended package covering reefs and walls',
    banner: 'assets/bg-video.mp4',
    highlights: 'Certified divers only',
    days_min: '', days_max: '', min_age: ''
  },
  {
    id: 'fun-post', category: 'fundives',
    title: 'Post 12 (extra 2 dives)',
    short_desc: 'Add on two extra dives.',
    long_desc: 'Flexible add-on to extend your package.',
    banner: 'assets/bg-video.mp4',
    highlights: 'Certified divers only',
    days_min: '', days_max: '', min_age: ''
  },
  {
    id: 'fun-night', category: 'fundives',
    title: 'Night Dive',
    short_desc: 'Experience the reef after dark.',
    long_desc: 'Guided night dive spotting nocturnal marine life.',
    banner: 'assets/bg-video.mp4',
    highlights: 'Prerequisites: Open Water Diver',
    days_min: '', days_max: '', min_age: ''
  },
  {
    id: 'fun-dawn', category: 'fundives',
    title: 'Dawn Dive',
    short_desc: 'Catch the reef at sunrise.',
    long_desc: 'See marine life during feeding and sunrise light.',
    banner: 'assets/bg-video.mp4',
    highlights: 'Certified divers only',
    days_min: '', days_max: '', min_age: ''
  },
  // 6. Combos
  {
    id: 'combo-1', category: 'combos',
    title: 'PADI DSD + Open Water',
    short_desc: 'Start with Discover Scuba Dive then complete Open Water.',
    long_desc: 'A progressive bundle for beginners to move into certification.',
    banner: 'assets/bg-video.mp4',
    highlights: 'Duration: 3–4 days | Includes PADI registration',
    days_min: 3, days_max: 4, min_age: ''
  },
  {
    id: 'combo-2', category: 'combos',
    title: 'PADI OW + Advanced',
    short_desc: 'Bundle Open Water and Advanced courses.',
    long_desc: 'Go from beginner to advanced diver.',
    banner: 'assets/bg-video.mp4',
    highlights: 'Duration: 5–7 days | Max Depth: 30m',
    days_min: 5, days_max: 7, min_age: ''
  },
  {
    id: 'combo-3', category: 'combos',
    title: 'EFR + Rescue Diver',
    short_desc: 'Combine first aid with rescue training.',
    long_desc: 'Learn EFR then apply skills in Rescue Diver.',
    banner: 'assets/bg-video.mp4',
    highlights: 'Duration: 4–6 days | Prerequisite: Advanced OpenWater',
    days_min: 4, days_max: 6, min_age: ''
  },
  // 7. Pro Courses
  {
    id: 'pro-1', category: 'pro',
    title: 'PADI Divemaster',
    short_desc: 'The first professional step.',
    long_desc: 'Learn to supervise dives, assist instructors, and lead certified divers.',
    banner: 'assets/bg-video.mp4',
    highlights: 'Duration: 20–25 days | Excludes crewpak & PADI fee',
    days_min: 20, days_max: 25, min_age: ''
  },
  {
    id: 'pro-2', category: 'pro',
    title: 'EFR + Rescue + Divemaster',
    short_desc: 'Complete pro-level bundle.',
    long_desc: 'Progress from EFR to Rescue Diver, then Divemaster.',
    banner: 'assets/bg-video.mp4',
    highlights: 'Duration: 24–31 days | Excludes crewpak & PADI fees',
    days_min: 24, days_max: 31, min_age: ''
  },
  {
    id: 'pro-3', category: 'pro',
    title: 'EFR + Rescue + DM (prereqs)',
    short_desc: 'Accelerated path with prerequisites.',
    long_desc: 'Skip prior modules and move into Divemaster.',
    banner: 'assets/bg-video.mp4',
    highlights: 'Duration: varies | Excludes crewpak & PADI fees',
    days_min: '', days_max: '', min_age: ''
  },
  {
    id: 'pro-4', category: 'pro',
    title: 'Zero to Hero (OW to DM)',
    short_desc: 'Pathway from beginner to Divemaster.',
    long_desc: 'Start at OW and continue to Divemaster certification.',
    banner: 'assets/bg-video.mp4',
    highlights: 'Duration: 90–120 days | Permit included | Food & stay extra',
    days_min: 90, days_max: 120, min_age: ''
  },
  // 8. Freediving
  {
    id: 'free-1', category: 'freediving',
    title: 'PADI Basic Freediver',
    short_desc: 'Learn the basics of breath-hold diving.',
    long_desc: 'Focus on static apnea, dynamic apnea, and safety in confined water.',
    banner: 'assets/bg-video.mp4',
    highlights: 'Duration: 1–2 days | Confined water + theory',
    days_min: 1, days_max: 2, min_age: ''
  },
  {
    id: 'free-2', category: 'freediving',
    title: 'PADI Freediver',
    short_desc: 'Build strong freediving skills.',
    long_desc: 'Expand breath-hold time and depth techniques in open water.',
    banner: 'assets/bg-video.mp4',
    highlights: 'Duration: 2–3 days | Includes confined + open water',
    days_min: 2, days_max: 3, min_age: ''
  },
  // 9. Surfing
  {
    id: 'surf-1', category: 'surfing', categories: ['surfing', 'programs'],
    title: 'Discover Surfing',
    short_desc: 'Introductory surfboard lesson for beginners.',
    long_desc: 'Learn pop-up techniques, wave timing, board balance, and safety in shallow ocean breaks with an experienced instructor.',
    banner: 'assets/bg-video.mp4',
    highlights: 'Duration: 2 hrs | Includes surfboard, rashguard & instructor',
    days_min: '', days_max: '', min_age: 8
  },
  {
    id: 'surf-2', category: 'surfing', categories: ['surfing', 'programs'],
    title: 'Surf Safari & Reef Break Trip',
    short_desc: 'Guided surfing session at premier Andaman surf spots.',
    long_desc: 'Catch uncrowded tropical waves with guided boat transport, spot breakdown, and safety watch.',
    banner: 'assets/bg-video.mp4',
    highlights: 'Duration: Half Day | Includes boat trip & equipment',
    days_min: '', days_max: '', min_age: 12
  },
  {
    id: 'surf-3', category: 'surfing', categories: ['surfing', 'courses'],
    title: '3-Day Surf Academy Course',
    short_desc: 'Master wave reading, paddling, and maneuvers.',
    long_desc: 'Comprehensive 3-day surfing course covering ocean currents, line-up positioning, turns, and riding green waves.',
    banner: 'assets/bg-video.mp4',
    highlights: 'Duration: 3 Days | Video analysis & surf log included',
    days_min: 3, days_max: 3, min_age: 10
  }
]

export const SERVICES_DATA = RAW_SERVICES_DATA.map((item, index) => ({
  ...item,
  image: CAROUSEL_IMAGES[index % CAROUSEL_IMAGES.length]
}))
