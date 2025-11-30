import type { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import CartIcon from './CartIcon';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">FoodShop</h1>
            </div>
            {user && user.role === "user" && (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/menu')}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
                >
                  Menu
                </button>
                {/* Add Order History link */}
                <button
                  onClick={() => navigate('/orders')}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
                >
                  Order History
                </button>
                <CartIcon />
                <span className="text-gray-700">
                  Welcome, {user.firstName} {user.lastName}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
                >
                  Logout
                </button>
              </div>
            )}
            {user && user.role === "admin" && (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/admin')}
                  className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
                >
                  Admin Panel
                </button>
                <span className="text-gray-700">
                  Welcome, {user.firstName} {user.lastName} (Admin)
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
};

export default Layout;