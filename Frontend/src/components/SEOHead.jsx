import { useEffect } from 'react'

const TARGET_SITE_ORIGIN = 'https://thedivevillage.co'
const DEFAULT_LOGO_URL = 'https://res.cloudinary.com/qvbunv8y/image/upload/v1791691225/TDV-Media/UI/Logo.png'

export default function SEOHead({
  title = "The Dive Village | It's a Community",
  description = 'Experience world-class scuba diving certifications, guided freediving excursions, and premium ocean apparel with certified professional divemasters at The Dive Village.',
  keywords = 'scuba diving, freediving, scuba certification, diving courses, dive center, dive gear, underwater exploration, ocean apparel, dive village',
  canonicalUrl = '',
  ogImage = DEFAULT_LOGO_URL,
  ogType = 'website'
}) {
  useEffect(() => {
    // 1. Resolve canonical URL to ensure permanent .co alignment regardless of future additions
    let resolvedCanonical = canonicalUrl
    if (!resolvedCanonical) {
      resolvedCanonical = typeof window !== 'undefined'
        ? `${TARGET_SITE_ORIGIN}${window.location.pathname}`
        : TARGET_SITE_ORIGIN
    } else if (resolvedCanonical.startsWith('/')) {
      resolvedCanonical = `${TARGET_SITE_ORIGIN}${resolvedCanonical}`
    } else if (resolvedCanonical.includes('thedivevillage.com')) {
      // Auto-correct any accidental future .com copy-paste
      resolvedCanonical = resolvedCanonical.replace('https://thedivevillage.com', TARGET_SITE_ORIGIN).replace('http://thedivevillage.com', TARGET_SITE_ORIGIN)
    }

    // Strip trailing query strings or hash for canonical purity
    resolvedCanonical = resolvedCanonical.split('?')[0].split('#')[0]

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

    // Helper to get or create meta tag
    const setMetaTag = (attrName, attrValue, content) => {
      if (!content) return
      let el = document.querySelector(`meta[${attrName}="${attrValue}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attrName, attrValue)
        document.head.appendChild(el)
      }
      el.content = content
    }

    setMetaTag('property', 'og:title', title)
    setMetaTag('property', 'og:description', description)
    setMetaTag('property', 'og:type', ogType)

    // Full absolute URL for og:image
    const fullImageUrl = ogImage
      ? ogImage.startsWith('http')
        ? ogImage
        : typeof window !== 'undefined'
        ? new URL(ogImage, window.location.origin).href
        : ogImage
      : DEFAULT_LOGO_URL

    setMetaTag('property', 'og:image', fullImageUrl)
    setMetaTag('property', 'og:image:secure_url', fullImageUrl)
    setMetaTag('property', 'og:image:alt', title)
    setMetaTag('property', 'og:url', resolvedCanonical)

    // Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image')
    setMetaTag('name', 'twitter:title', title)
    setMetaTag('name', 'twitter:description', description)
    setMetaTag('name', 'twitter:image', fullImageUrl)

    // Canonical link tag
    if (typeof document !== 'undefined') {
      let linkCanonical = document.querySelector('link[rel="canonical"]')
      if (!linkCanonical) {
        linkCanonical = document.createElement('link')
        linkCanonical.setAttribute('rel', 'canonical')
        document.head.appendChild(linkCanonical)
      }
      linkCanonical.setAttribute('href', resolvedCanonical)
    }
  }, [title, description, keywords, canonicalUrl, ogImage, ogType])

  return null
}
