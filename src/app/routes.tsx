import { createBrowserRouter } from 'react-router-dom';
import { Home } from './features/products/pages/Home';
import { Shop } from './features/products/pages/Shop';
import { ProductDetail } from './features/products/pages/ProductDetail';
import { Cart } from './features/cart/pages/Cart';
import { Checkout } from './features/cart/pages/Checkout';
import { OrderTracking } from './features/cart/pages/OrderTracking';
import { Dashboard } from './pages/Dashboard';
import { Wishlist } from './features/wishlist/pages/Wishlist';
import { NewArrivals } from './features/products/pages/NewArrivals';
import { LimitedEdition } from './features/products/pages/LimitedEdition';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { Toaster } from './components/ui/sonner';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { EmailVerification } from './pages/EmailVerification';
import { VerifyCode } from './pages/VerifyCode';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';

// Admin imports
import { AdminLayout } from './features/admin/components/AdminLayout';
import { AdminDashboard } from './features/admin/pages/AdminDashboard';
import { AdminProducts } from './features/admin/pages/AdminProducts';
import { AddNewHandbag } from './features/admin/pages/AddNewHandbag';
import { TestSaveButton } from './features/admin/pages/TestSaveButton';
import { AdminOrders } from './features/admin/pages/AdminOrders';
import { AdminCustomers } from './features/admin/pages/AdminCustomers';
import { AdminInventory } from './features/admin/pages/AdminInventory';
import { AdminPayments } from './features/admin/pages/AdminPayments';
import { AdminAnalytics } from './features/admin/pages/AdminAnalytics';
import { AdminPromotions } from './features/admin/pages/AdminPromotions';
import { AdminExpenses } from './features/admin/pages/AdminExpenses';
import { AdminSettings } from './features/admin/pages/AdminSettings';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <Toaster />
    </div>
  );
}

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">{children}</main>
      <Toaster />
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
  },
  {
    path: '/shop',
    element: (
      <Layout>
        <Shop />
      </Layout>
    ),
  },
  {
    path: '/product/:id',
    element: (
      <Layout>
        <ProductDetail />
      </Layout>
    ),
  },
  {
    path: '/cart',
    element: (
      <Layout>
        <Cart />
      </Layout>
    ),
  },
  {
    path: '/checkout',
    element: (
      <Layout>
        <ProtectedRoute>
          <Checkout />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: '/order/:orderId',
    element: (
      <Layout>
        <ProtectedRoute>
          <OrderTracking />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <Layout>
        <ProtectedRoute customerOnly>
          <Dashboard />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: '/wishlist',
    element: (
      <Layout>
        <ProtectedRoute customerOnly>
          <Wishlist />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: '/new',
    element: (
      <AuthLayout>
        <NewArrivals />
      </AuthLayout>
    ),
  },
  {
    path: '/limited',
    element: (
      <Layout>
        <LimitedEdition />
      </Layout>
    ),
  },
  {
    path: '/login',
    element: (
      <AuthLayout>
        <Login />
      </AuthLayout>
    ),
  },
  {
    path: '/register',
    element: (
      <AuthLayout>
        <Register />
      </AuthLayout>
    ),
  },
  {
    path: '/verify-email',
    element: (
      <AuthLayout>
        <EmailVerification />
      </AuthLayout>
    ),
  },
  {
    path: '/verify-code',
    element: (
      <AuthLayout>
        <VerifyCode />
      </AuthLayout>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <AuthLayout>
        <ForgotPassword />
      </AuthLayout>
    ),
  },
  {
    path: '/reset-password',
    element: (
      <Layout>
        <ProtectedRoute>
          <ResetPassword />
        </ProtectedRoute>
      </Layout>
    ),
  },
  // Admin Dashboard Routes (protected — admin role required)
  {
    path: '/admin',
    element: (
      <ProtectedRoute requiredRole="admin">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'products', element: <AdminProducts /> },
      { path: 'add-product', element: <AddNewHandbag /> },
      { path: 'test-save', element: <TestSaveButton /> },
      { path: 'orders', element: <AdminOrders /> },
      { path: 'customers', element: <AdminCustomers /> },
      { path: 'inventory', element: <AdminInventory /> },
      { path: 'payments', element: <AdminPayments /> },
      { path: 'analytics', element: <AdminAnalytics /> },
      { path: 'promotions', element: <AdminPromotions /> },
      { path: 'expenses', element: <AdminExpenses /> },
      { path: 'settings', element: <AdminSettings /> },
    ],
  },
  {
    path: '*',
    element: (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
            <p className="text-gray-600 mb-8">Page not found</p>
            <a
              href="/"
              className="inline-block px-6 py-3 bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] text-white rounded-full hover:shadow-lg transition-all"
            >
              Go Home
            </a>
          </div>
        </div>
      </Layout>
    ),
  },
]);