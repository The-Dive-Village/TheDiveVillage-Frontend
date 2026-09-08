import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { CAROUSEL_IMAGES } from '../utils/images'

const INITIAL_REVIEWS = [
  {
    id: 'rev-1',
    name: "Alex Johnson",
    role: "PADI Open Water Diver",
    text: "The Dive Village completely changed my perspective on the ocean. The instructors were incredibly patient, and the focus on safety made my first dive unforgettable.",
    rating: 5,
    image: CAROUSEL_IMAGES[1],
    approved: true,
    createdAt: '2026-08-15',
  },
  {
    id: 'rev-2',
    name: "Maria Garcia",
    role: "Marine Biologist",
    text: "I've dived all over the world, but the dedication to eco-stewardship here is unmatched. It's inspiring to see a dive center that truly cares about coral restoration and leaving no trace.",
    rating: 5,
    image: CAROUSEL_IMAGES[2],
    approved: true,
    createdAt: '2026-08-20',
  },
  {
    id: 'rev-3',
    name: "David Chen",
    role: "Advanced Adventurer",
    text: "From the seamless booking process to the personalized dive charters, everything was flawless. A vibrant community that genuinely feels like a second home.",
    rating: 5,
    image: CAROUSEL_IMAGES[0],
    approved: true,
    createdAt: '2026-08-28',
  }
]

const ReviewsContext = createContext(null)

export function ReviewsProvider({ children }) {
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem('tdv_reviews')
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS
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
