import { useEffect } from 'react'

export default function SEOHead({
  title = 'The Dive Village | Premier Scuba Diving Center, Freediving & Ocean Merch',
  description = 'Experience world-class scuba diving certifications, guided freediving excursions, and premium ocean apparel with certified PADI & SSI divemasters at The Dive Village.',
  keywords = 'scuba diving, freediving, scuba certification, PADI courses, SSI dive center, dive gear, underwater exploration, ocean apparel, dive village',
  canonicalUrl = 'https://thedivevillage.co',
  ogImage = '/src/assets/logo.png',
  ogType = 'website'
}) {
  useEffect(() => {
    // Update Title
    document.title = title

    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.name = 'description'
      document.head.appendChild(metaDesc)
    }
    metaDesc.content = description

    // Update Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]')
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta')
      metaKeywords.name = 'keywords'
      document.head.appendChild(metaKeywords)
    }
    metaKeywords.content = keywords

    // Update Open Graph Title
    let ogTitle = document.querySelector('meta[property="og:title"]')
    if (!ogTitle) {
      ogTitle = document.createElement('meta')
      ogTitle.setAttribute('property', 'og:title')
      document.head.appendChild(ogTitle)
    }
    ogTitle.content = title

    // Update Open Graph Description
    let ogDesc = document.querySelector('meta[property="og:description"]')
    if (!ogDesc) {
      ogDesc = document.createElement('meta')
      ogDesc.setAttribute('property', 'og:description')
      document.head.appendChild(ogDesc)
    }
    ogDesc.content = description

    // Update Open Graph Type
    let ogTypeMeta = document.querySelector('meta[property="og:type"]')
    if (!ogTypeMeta) {
      ogTypeMeta = document.createElement('meta')
      ogTypeMeta.setAttribute('property', 'og:type')
      document.head.appendChild(ogTypeMeta)
    }
    ogTypeMeta.content = ogType

  }, [title, description, keywords, canonicalUrl, ogImage, ogType])

  return null
}
