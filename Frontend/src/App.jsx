import { useState } from 'react'
import { BrowserRouter } from 'react-router'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider } from './contexts/AuthProvider'
import { CartProvider } from './contexts/CartProvider'
import { WishlistProvider } from './contexts/WishlistProvider'
import { ReviewsProvider } from './contexts/ReviewsContext'
import AppRouter from './router/AppRouter'
import CustomCursor from './components/CustomCursor'
import Preloader from './components/Preloader'
import ScrollToTop from './components/ScrollToTop'

export default function App() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <BrowserRouter>
      <ScrollToTop />
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
  )
}
