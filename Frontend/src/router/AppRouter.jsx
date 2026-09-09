import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router'
import PublicLayout from '../layouts/PublicLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import AdminLayout from '../layouts/AdminLayout'
import ProtectedRoute from './ProtectedRoute'
import ErrorBoundary from '../components/ErrorBoundary'

// Initial home page is direct for fast startup
import Home from '../pages/Home'

// Dynamic lazy imports for all secondary routes to enable route-level code splitting
const About = lazy(() => import('../pages/About'))
const Services = lazy(() => import('../pages/Services'))
const ServiceDetail = lazy(() => import('../pages/ServiceDetail'))
const Gallery = lazy(() => import('../pages/Gallery'))
const BookUs = lazy(() => import('../pages/BookUs'))
const Shop = lazy(() => import('../pages/Shop'))
const ProductDetail = lazy(() => import('../pages/ProductDetail'))
const Cart = lazy(() => import('../pages/Cart'))
const Checkout = lazy(() => import('../pages/Checkout'))
const Contact = lazy(() => import('../pages/Contact'))
const Login = lazy(() => import('../pages/Login'))
const Signup = lazy(() => import('../pages/Signup'))
const Wishlist = lazy(() => import('../pages/Wishlist'))

// Dashboard pages
const Dashboard = lazy(() => import('../pages/Dashboard'))
const Profile = lazy(() => import('../pages/Profile'))
const Orders = lazy(() => import('../pages/Orders'))

// Admin pages
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'))
const AdminCatalog = lazy(() => import('../pages/admin/Catalog'))
const AdminOrders = lazy(() => import('../pages/admin/Orders'))
const AdminCustomers = lazy(() => import('../pages/admin/Customers'))
const AdminContent = lazy(() => import('../pages/admin/Content'))

function PageLiquid({ children }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="min-h-screen bg-transparent" />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}

export default function AppRouter() {
  const location = useLocation()

  return (
    <Routes location={location}>
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
        <Route index element={<PageLiquid><Dashboard /></PageLiquid>} />
        <Route path="profile" element={<PageLiquid><Profile /></PageLiquid>} />
        <Route path="orders" element={<PageLiquid><Orders /></PageLiquid>} />
        <Route path="wishlist" element={<PageLiquid><Wishlist /></PageLiquid>} />
        <Route path="cart" element={<PageLiquid><Cart /></PageLiquid>} />
      </Route>

      <Route
        path="admin"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<PageLiquid><AdminDashboard /></PageLiquid>} />
        <Route path="catalog" element={<PageLiquid><AdminCatalog /></PageLiquid>} />
        <Route path="orders" element={<PageLiquid><AdminOrders /></PageLiquid>} />
        <Route path="customers" element={<PageLiquid><AdminCustomers /></PageLiquid>} />
        <Route path="content" element={<PageLiquid><AdminContent /></PageLiquid>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
