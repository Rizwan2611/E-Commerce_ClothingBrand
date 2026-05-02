import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import IntroLoader from './components/IntroLoader';
import { useAuth } from './context/AuthContext';

// Customer Pages
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LocationPage from './pages/LocationPage';
import CustomerOrdersPage from './pages/CustomerOrdersPage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminSettings from './pages/admin/AdminSettings';

function App() {
  const { customer, loading: authLoading } = useAuth();
  const [showIntro, setShowIntro] = useState(true);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Skip intro for admin routes immediately
  const shouldDisplayIntro = showIntro && !isAdminRoute;
  
  // Member's Only Gate: Show login if not authenticated after intro (only for customer routes)
  const showAuthGate = !shouldDisplayIntro && !customer && !isAdminRoute && !['/login', '/register'].includes(location.pathname);

  if (authLoading) return <LoadingSpinner />;

  return (
    <>
      {shouldDisplayIntro && <IntroLoader onComplete={() => setShowIntro(false)} />}
      
      {/* Hide customer navbar on admin routes or if intro is showing */}
      {!isAdminRoute && !shouldDisplayIntro && !showAuthGate && <Navbar />}

      {!shouldDisplayIntro && (
        <Routes>
          {/* Main App Routes */}
          {showAuthGate ? (
            <Route path="*" element={<LoginPage />} />
          ) : (
            <Route path="*" element={
              <Routes>
                {/* Public Customer Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/location" element={<LocationPage />} />

                {/* Protected Customer Routes */}
                <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><CustomerOrdersPage /></ProtectedRoute>} />

                {/* Admin Routes (Completely Isolated Auth) */}
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
                <Route path="/admin/products" element={<AdminProtectedRoute><AdminProducts /></AdminProtectedRoute>} />
                <Route path="/admin/orders" element={<AdminProtectedRoute><AdminOrders /></AdminProtectedRoute>} />
                <Route path="/admin/settings" element={<AdminProtectedRoute><AdminSettings /></AdminProtectedRoute>} />
                <Route path="/admin" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
              </Routes>
            } />
          )}
        </Routes>
      )}
    </>
  );
}

export default App;
