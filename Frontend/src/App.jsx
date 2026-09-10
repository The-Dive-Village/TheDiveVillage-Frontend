import { useEffect, useState } from 'react'
import { BrowserRouter, useNavigate, useLocation } from 'react-router'
import { AnimatePresence } from 'framer-motion'
import './utils/mediaReadyManager'
import { AuthProvider } from './contexts/AuthProvider'
import { CartProvider } from './contexts/CartProvider'
import { WishlistProvider } from './contexts/WishlistProvider'
import { ReviewsProvider } from './contexts/ReviewsContext'
import AppRouter from './router/AppRouter'
import CustomCursor from './components/CustomCursor'
import Preloader from './components/Preloader'
import ScrollToTop from './components/ScrollToTop'

import ErrorBoundary from './components/ErrorBoundary'

function InitialResetToHome() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Reset to beginning (Home page) whenever the page reloads / refreshes
    if (location.pathname !== '/') {
      navigate('/', { replace: true })
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
  }, []) // Empty dependency array ensures this only executes once on initial load/refresh

  return null
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <InitialResetToHome />
        <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ReviewsProvider>
              <AnimatePresence mode="wait">
                {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
              </AnimatePresence>
              <CustomCursor />
              <AppRouter />
            </ReviewsProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </ErrorBoundary>
  )
}
