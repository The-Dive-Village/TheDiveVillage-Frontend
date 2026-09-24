/**
 * Native Share Sheet helper with automatic Clipboard copy fallback
 */
export async function shareContent({ title, text, url }) {
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
  const shareData = {
    title: title || 'The Dive Village',
    text: text || 'Explore custom dive charters, ocean apparel, and dive training at The Dive Village.',
    url: shareUrl,
  }

  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share(shareData)
      return { shared: true }
    } catch (err) {
      if (err.name !== 'AbortError') {
        return copyToClipboard(shareUrl)
      }
      return { cancelled: true }
    }
  }

  return copyToClipboard(shareUrl)
}

async function copyToClipboard(text) {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(text)
      return { copied: true }
    }
  } catch {
    // Fallback for older browsers
  }
  return { copied: false }
}
