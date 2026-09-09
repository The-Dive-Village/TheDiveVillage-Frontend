import defaultTurtleImage from '../assets/panel4.jpeg'

/**
 * Dive Site Image Mapping
 * Maps unique diveSite.id to verified image asset paths.
 * 
 * NOTE: Keyed authoritatively by diveSite.id (string or number).
 * Example:
 *   "1822": "/assets/dive-sites/1822.jpg"
 */
export const DIVE_SITE_IMAGES = {
  // Verified dive site image assets can be registered here:
}

export const DEFAULT_DIVE_IMAGE = defaultTurtleImage

/**
 * Get image URL for a dive site by its unique ID.
 * @param {string|number} id The dive site ID
 * @returns {string} The image URL if mapped, or default high-res dive site image
 */
export const getDiveSiteImage = (id) => {
  if (!id) return DEFAULT_DIVE_IMAGE
  return DIVE_SITE_IMAGES[String(id)] || DEFAULT_DIVE_IMAGE
}

export default DIVE_SITE_IMAGES
