import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Navigate, Route, Routes, useLocation } from 'react-router'
import PublicLayout from '../layouts/PublicLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import AdminLayout from '../layouts/AdminLayout'
import ProtectedRoute from './ProtectedRoute'
import Home from '../pages/Home'
import BookUs from '../pages/BookUs'
import Shop from '../pages/Shop'
import ProductDetail from '../pages/ProductDetail'
import Cart from '../pages/Cart'
import Checkout from '../pages/Checkout'
import Contact from '../pages/Contact'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import Dashboard from '../pages/Dashboard'
import Profile from '../pages/Profile'
import Orders from '../pages/Orders'
import Wishlist from '../pages/Wishlist'
import AdminDashboard from '../pages/admin/Dashboard'
import AdminCatalog from '../pages/admin/Catalog'
import AdminOrders from '../pages/admin/Orders'
import AdminCustomers from '../pages/admin/Customers'
import AdminContent from '../pages/admin/Content'


import About from '../pages/About'
import Services from '../pages/Services'
import ServiceDetail from '../pages/ServiceDetail'
import Gallery from '../pages/Gallery'

function PageLiquid({ children }) {
  return children
}

export default function AppRouter() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<PublicLayout />}>
          <Route
            index
            element={
              <PageLiquid>
                <Home />
              </PageLiquid>
            }
          />
          <Route path="about" element={<PageLiquid><About /></PageLiquid>} />
          <Route path="services" element={<PageLiquid><Services /></PageLiquid>} />
          <Route path="services/:id" element={<PageLiquid><ServiceDetail /></PageLiquid>} />
          <Route path="gallery" element={<PageLiquid><Gallery /></PageLiquid>} />
          <Route path="book-us" element={<PageLiquid><BookUs /></PageLiquid>} />
          <Route path="shop" element={<PageLiquid><Shop /></PageLiquid>} />
          <Route path="shop/:id" element={<PageLiquid><ProductDetail /></PageLiquid>} />
          <Route path="cart" element={<PageLiquid><Cart /></PageLiquid>} />
          <Route path="wishlist" element={<PageLiquid><Wishlist /></PageLiquid>} />
          <Route path="checkout" element={<PageLiquid><Checkout /></PageLiquid>} />
          <Route path="contact" element={<PageLiquid><Contact /></PageLiquid>} />
          <Route path="login" element={<PageLiquid><Login /></PageLiquid>} />
          <Route path="signup" element={<PageLiquid><Signup /></PageLiquid>} />
          <Route path="profile" element={<Navigate to="/dashboard/profile" replace />} />
        </Route>

        <Route
          path="dashboard"
          element={
            <ProtectedRoute roles={['customer', 'admin']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="orders" element={<Orders />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="cart" element={<Cart />} />
        </Route>

        <Route
          path="admin"
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="catalog" element={<AdminCatalog />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="content" element={<AdminContent />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}
