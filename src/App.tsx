import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { OrderProvider } from './contexts/OrderContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Cart from './pages/Cart';
import Menu from './pages/Menu';
import OrderHistory from './pages/OrderHistory';
import AdminDashboard from './pages/AdminDashboard';
import { useAuth } from './contexts/AuthContext';


function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to={user.role === 'admin' ? "/admin" : "/dashboard"} replace />}
      />
      <Route
        path="/signup"
        element={!user ? <Signup /> : <Navigate to={user.role === 'admin' ? "/admin" : "/dashboard"} replace />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {user?.role === 'admin' ? (
              <Navigate to="/admin" replace />
            ) : (
              <Layout>
                <Dashboard />
              </Layout>
            )}
          </ProtectedRoute>
        }
      />
      <Route
        path="/menu"
        element={
          <ProtectedRoute>
            {user?.role === 'admin' ? (
              <Navigate to="/admin" replace />
            ) : (
              <Layout>
                <Menu />
              </Layout>
            )}
          </ProtectedRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            {user?.role === 'admin' ? (
              <Navigate to="/admin" replace />
            ) : (
              <Layout>
                <Cart />
              </Layout>
            )}
          </ProtectedRoute>
        }
      />
      {/* Add OrderHistory route */}
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            {user?.role === 'admin' ? (
              <Navigate to="/admin" replace />
            ) : (
              <Layout>
                <OrderHistory />
              </Layout>
            )}
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            {user?.role !== 'admin' ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AdminDashboard />
            )}
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          <Navigate to={
            user
              ? (user.role === 'admin' ? "/admin" : "/dashboard")
              : "/login"
          } replace />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          {/* Add ReviewProvider here */}
          <AppRoutes />
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;