import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { CAROUSEL_IMAGES } from '../utils/images'
import michaelPfp from '../assets/Products/merch0.jpg'

const INITIAL_REVIEWS = [
  {
    id: 'rev-1',
    name: "Sofia Stalance",
    role: "Advanced Open Water Diver",
    text: "Did my Advanced Open Water with Sanjeev and the crew in Havelock. Having instructors who genuinely emphasize neutral buoyancy and reef protection made all the difference. Saw manta rays at Dixon's Pinnacle—an unforgettable dive.",
    rating: 5,
    image: CAROUSEL_IMAGES[1],
    approved: true,
    createdAt: '2026-08-15',
  },
  {
    id: 'rev-2',
    name: "Krishawn Rahul",
    role: "Marine Ecology Enthusiast",
    text: "As someone passionate about coral ecosystems, their respect for marine wildlife blew me away. Intimate small-group dives, zero touch policies, and the instructors know every reef species by name. It really feels like family.",
    rating: 5,
    image: CAROUSEL_IMAGES[2],
    approved: true,
    createdAt: '2026-08-20',
  },
  {
    id: 'rev-3',
    name: "Michael Antony",
    role: "Rescue Diver & Underwater Photographer",
    text: "From seamless logistics and custom boat charters to top-tier safety gear, everything was top notch. The night dive with glowing bioluminescence was pure magic. Easily the best dive community in the region.",
    rating: 5,
    image: michaelPfp,
    approved: true,
    createdAt: '2026-08-28',
  }
]

const ReviewsContext = createContext(null)

export function ReviewsProvider({ children }) {
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem('tdv_reviews')
      if (!saved) return INITIAL_REVIEWS
      const parsed = JSON.parse(saved)
      const hasOldNames = parsed.some(
        (r) =>
          r.name === 'Alex Johnson' ||
          r.name === 'Maria Garcia' ||
          r.name === 'David Chen' ||
          r.name === 'Rohan Deshmukh' ||
          r.name === 'Dr. Ananya Sen' ||
          r.name === 'Vikramaditya Rathore'
      )
      if (hasOldNames) {
        const customOnes = parsed.filter(
          (r) => !['rev-1', 'rev-2', 'rev-3'].includes(r.id)
        )
        return [...INITIAL_REVIEWS, ...customOnes]
      }
      const defaultMap = Object.fromEntries(INITIAL_REVIEWS.map((r) => [r.id, r]))
      return parsed.map((r) => (defaultMap[r.id] ? { ...r, image: defaultMap[r.id].image } : r))
    } catch {
      return INITIAL_REVIEWS
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('tdv_reviews', JSON.stringify(reviews))
    } catch (err) {
      console.error('Failed to save reviews to localStorage:', err)
    }
  }, [reviews])

  const addReview = useCallback(({ name, role, text, rating }) => {
    const newRev = {
      id: `rev-${Date.now()}`,
      name: name.trim(),
      role: role?.trim() || 'Ocean Diver',
      text: text.trim(),
      rating: Number(rating) || 5,
      image: CAROUSEL_IMAGES[Math.floor(Math.random() * CAROUSEL_IMAGES.length)],
      approved: false,
      createdAt: new Date().toISOString().split('T')[0],
    }
    setReviews((prev) => [newRev, ...prev])
    return newRev
  }, [])

  const approveReview = useCallback((id) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, approved: true } : r))
    )
  }, [])

  const deleteReview = useCallback((id) => {
    setReviews((prev) => prev.filter((r) => r.id !== id))
  }, [])

  const approvedReviews = reviews.filter((r) => r.approved)
  const pendingReviews = reviews.filter((r) => !r.approved)

  return (
    <ReviewsContext.Provider
      value={{
        reviews,
        approvedReviews,
        pendingReviews,
        addReview,
        approveReview,
        deleteReview,
      }}
    >
      {children}
    </ReviewsContext.Provider>
  )
}

export function useReviews() {
  const ctx = useContext(ReviewsContext)
  if (!ctx) {
    throw new Error('useReviews must be used within a ReviewsProvider')
  }
  return ctx
}
