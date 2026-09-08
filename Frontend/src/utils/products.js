import { IMAGES, CAROUSEL_IMAGES } from './images'

import imgWomensShirtFront from '../assets/Products/Womans sweetheart front upscaled.png'
import imgWomensShirtBack from '../assets/Products/Womans sweetheart back upscaled.png'
import imgWomensPantsFront from '../assets/Products/Womans pants front upscaled.png'
import imgWomensPantsBack from '../assets/Products/Womans pants back upscaled.png'
import imgWomensStrapFront from '../assets/Products/Womans front upscaled.png'
import imgWomensStrapBack from '../assets/Products/Womans Back Upscaled.png'
import imgUnisexShortsFront from '../assets/Products/Unisex Shorts front upscaled.png'
import imgUnisexShortsBack from '../assets/Products/Unisex shorts back upscaled.png'
import imgUnisexShirtFront from '../assets/Products/unisex front upscaled.png'
import imgUnisexShirtBack from '../assets/Products/Unisex back upscaled.png'
import imgSkinSuitFront from '../assets/Products/Dive Suit Front.png'
import imgSkinSuitBack from '../assets/Products/Dive suit back.png'
import imgCapFront from '../assets/Products/catf.png'
import imgCapBack from '../assets/Products/capb.png'
import imgBagFront from '../assets/Products/bagf.png'
import imgBagBack from '../assets/Products/bagb.png'

import glbBag from '../assets/3d model/backpack 3d model.glb?url'
import glbCap from '../assets/3d model/baseball cap 3d model.glb?url'
import glbUnisexShorts from '../assets/3d model/black dive shorts 3d model.glb?url'
import glbWomensPants from '../assets/3d model/black leggings 3d model.glb?url'
import glbUnisexShirt from '../assets/3d model/black long sleeve shirt 3d model.glb?url'
import glbFullSuit from '../assets/3d model/black wetsuit 3d model.glb?url'
import glbWomensShirt from '../assets/3d model/long sleeve shirt 3d model.glb?url'
import glbWomensStrap from '../assets/3d model/wetsuit 3d model.glb?url'

export const SHOP_PRODUCTS = [
  {
    id: 'product-womens-shirt',
    title: 'Women’s Dive Shirt (Sweetheart Neck)',
    name: 'Women’s Dive Shirt',
    price: 2499,
    oldPrice: 2999,
    image: imgWomensShirtFront,
    images: [imgWomensShirtFront, imgWomensShirtBack],
    glb: glbWomensShirt,
    category: 'Tops',
    tag: 'New Arrival',
    description: 'Stay protected and stylish in the water. Features a sweetheart neckline, premium stretch, and sun protection.',
    features: [
      'UPF 50+ Protection: Helps protect your skin from harmful UV rays during outdoor activities.',
      'Quick-Dry Fabric: Dries quickly after getting wet, keeping you comfortable in and out of the water.',
      '4-Way Stretch: Flexible fabric allows easy movement without restricting your mobility.',
      'Lightweight & Breathable: Lightweight fabric allows airflow and keeps you comfortable during extended wear.'
    ],
    sizes: ['Type A (XS to M)', 'Type B (L to XXL)'],
    colors: [
      { name: 'Black', hex: '#000000' }
    ],
    stock: 35,
    stockStatus: 'In Stock',
    rating: 4.9,
    reviewCount: 42,
  },
  {
    id: 'product-womens-pants',
    title: 'Women’s Dive Pants',
    name: 'Women’s Dive Pants',
    price: 2999,
    oldPrice: 3499,
    image: imgWomensPantsFront,
    images: [imgWomensPantsFront, imgWomensPantsBack],
    glb: glbWomensPants,
    category: 'Bottoms',
    tag: 'Bestseller',
    description: 'High-waisted dive pants offering full-length coverage and thigh-smoothing panels for ultimate comfort and confidence.',
    features: [
      'High-Waist Fit: Provides comfortable coverage and a secure fit while keeping you supported during movement.',
      '4-Way Stretch: Flexible fabric allows easy movement and comfort during swimming, diving, and other water activities.',
      'Thigh-Smoothing Panels: Designed to provide extra coverage and create a smoother appearance around the thighs.',
      'Full-Length Coverage: Offers extended coverage for your legs while providing comfort and protection during water activities.'
    ],
    sizes: ['Type A (XS to M)', 'Type B (L to XXL)'],
    colors: [
      { name: 'Black', hex: '#000000' }
    ],
    stock: 20,
    stockStatus: 'In Stock',
    rating: 4.8,
    reviewCount: 89,
  },
  {
    id: 'product-womens-strap',
    title: 'Women’s Shoulder Strap Top / Women’s Shortie',
    name: 'Women’s Shoulder Strap Top / Women’s Shortie',
    price: 1999,
    oldPrice: 2499,
    image: imgWomensStrapFront,
    images: [imgWomensStrapFront, imgWomensStrapBack],
    glb: glbWomensStrap,
    category: 'Tops',
    tag: 'Essential',
    description: 'Supportive and comfortable dive top featuring heavy-duty Velcro straps and built-in chest support.',
    features: [
      'Heavy-Duty Velcro Straps: Strong Velcro fastening keeps the shoulder straps securely in place during movement and water activities.',
      'Built-In Chest Support: Integrated support cups provide added coverage and a secure, comfortable fit.',
      'Stretch-Fit Fabric: Flexible fabric moves with your body for unrestricted movement while swimming or diving.',
      'Full-Body Coverage: Provides comfortable coverage across the torso and upper legs for added protection in the water.'
    ],
    sizes: ['Type A (XS to M)', 'Type B (L to XXL)'],
    colors: [
      { name: 'Black', hex: '#000000' }
    ],
    stock: 15,
    stockStatus: 'Low Stock',
    rating: 4.7,
    reviewCount: 34,
  },
  {
    id: 'product-unisex-shorts',
    title: 'Unisex Dive Shorts',
    name: 'Unisex Dive Shorts',
    price: 1799,
    oldPrice: 2199,
    image: imgUnisexShortsFront,
    images: [imgUnisexShortsFront, imgUnisexShortsBack],
    glb: glbUnisexShorts,
    category: 'Bottoms',
    tag: 'Comfort',
    description: 'Experience seamless comfort with these dive shorts, designed without visible stitching to reduce irritation.',
    features: [
      'Seamless Comfort: Designed without visible seams or stitching that can rub against the skin during water activities.',
      'Hip-Friendly Waistband: The smooth waist construction helps reduce irritation around the hips, especially during extended wear in the water.',
      'Stretch-Fit Fabric: Flexible fabric moves naturally with your body for unrestricted movement while swimming or diving.',
      'Lightweight & Quick-Dry: Lightweight fabric dries quickly after getting wet, keeping you comfortable in and out of the water.'
    ],
    sizes: ['Type A (XS to M)', 'Type B (L to XXL)'],
    colors: [
      { name: 'Black', hex: '#000000' }
    ],
    stock: 50,
    stockStatus: 'In Stock',
    rating: 4.9,
    reviewCount: 112,
  },
  {
    id: 'product-unisex-shirt',
    title: 'Unisex Dive Shirt',
    name: 'Unisex Dive Shirt',
    price: 2299,
    oldPrice: 2799,
    image: imgUnisexShirtFront,
    images: [imgUnisexShirtFront, imgUnisexShirtBack],
    glb: glbUnisexShirt,
    category: 'Tops',
    tag: 'Essential',
    description: 'A versatile, lightweight dive shirt featuring hidden neck seams and quick-dry fabric for all-day comfort.',
    features: [
      'Hidden Neck Seams: Seams are finished and tucked inside the collar to prevent stitching from rubbing against the neck.',
      'Quick-Dry Fabric: Dries quickly after getting wet, helping you stay comfortable in and out of the water.',
      '4-Way Stretch: Flexible fabric moves with your body for unrestricted movement during swimming and diving.',
      'Lightweight & Breathable: Lightweight construction allows airflow and keeps you comfortable during extended wear.'
    ],
    sizes: ['Type A (XS to M)', 'Type B (L to XXL)'],
    colors: [
      { name: 'Black', hex: '#000000' }
    ],
    stock: 45,
    stockStatus: 'In Stock',
    rating: 4.8,
    reviewCount: 76,
  },
  {
    id: 'product-full-suit',
    title: 'Full-Body Skin Suit',
    name: 'Full-Body Skin Suit',
    price: 6999,
    oldPrice: 8999,
    image: imgSkinSuitFront,
    images: [imgSkinSuitFront, imgSkinSuitBack],
    glb: glbFullSuit,
    category: 'Skin Wear',
    tag: 'Premium',
    description: 'Ultimate full-body protection with grip panels on the knees and seat, front zip closure, and stirrup foot straps.',
    features: [
      'Grip Panels: Textured panels on the knees and seat provide added grip and support where you need it most.',
      'Front Zip Closure: A full-length front zipper makes the suit easier to put on and take off while providing a secure fit.',
      'Stirrup Foot Straps: Integrated foot straps help keep the suit securely in place and prevent the legs from riding up during movement.',
      'Full-Body Coverage: Provides extended coverage from the neck to the ankles for added protection and comfort in the water.'
    ],
    sizes: ['Type A (XS to M)', 'Type B (L to XXL)'],
    colors: [
      { name: 'Black', hex: '#000000' }
    ],
    stock: 12,
    stockStatus: 'Low Stock',
    rating: 5.0,
    reviewCount: 28,
  },
  {
    id: 'product-dive-cap',
    title: 'The Dive Village Ocean Cap',
    name: 'Ocean Cap',
    price: 1299,
    oldPrice: 1599,
    image: imgCapFront,
    images: [imgCapFront, imgCapBack],
    glb: glbCap,
    category: 'Accessories',
    tag: 'New Arrival',
    description: 'Durable, quick-dry ocean cap with sun glare protection and adjustable strap for beach, boat, and water activities.',
    features: [
      'UV Sun Protection: Shields your head, face, and eyes from intense glare and sun exposure on the boat and shore.',
      'Quick-Dry Breathable Fabric: Fast-drying material resists saltwater staining and allows maximum airflow.',
      'Adjustable Secure Strap: Custom fit rear strap ensures your cap stays secure even in windy boat conditions.',
      'Saltwater-Resistant Construction: Anti-corrosive eyelets and durable stitching engineered for maritime environments.'
    ],
    sizes: ['One Size Fits Most'],
    colors: [
      { name: 'Black', hex: '#000000' }
    ],
    stock: 40,
    stockStatus: 'In Stock',
    rating: 4.9,
    reviewCount: 25,
  },
  {
    id: 'product-ocean-bag',
    title: 'The Dive Village Expedition Bag',
    name: 'Expedition Bag',
    price: 3499,
    oldPrice: 3999,
    image: imgBagFront,
    images: [imgBagFront, imgBagBack],
    glb: glbBag,
    category: 'Accessories',
    tag: 'Essential',
    description: 'Heavy-duty waterproof gear bag designed for carrying wetsuits, towels, dive equipment, and beach essentials.',
    features: [
      'Water-Resistant Marine Fabric: High-density tarpaulin/nylon keeps wet gear isolated and dry gear protected.',
      'Spacious High-Capacity Storage: Generous main compartment easily holds towels, change of clothes, fins, and masks.',
      'Reinforced Carry Handles & Straps: Heavy-duty webbing and padded shoulder straps for comfortable transport.',
      'Quick-Drain & Breathable Mesh: Allows damp gear to air out easily while preventing odor accumulation.'
    ],
    sizes: ['One Size Fits Most'],
    colors: [
      { name: 'Black', hex: '#000000' }
    ],
    stock: 25,
    stockStatus: 'In Stock',
    rating: 4.8,
    reviewCount: 19,
  }
]
