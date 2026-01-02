import type { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import CartIcon from './CartIcon';
import '../components/componentStyles/Layout.css';

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

  const getUserInitials = () => {
    if (!user) return '?';
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'U';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar with Perfect Horizontal Alignment */}
      <nav className="layout-navbar">
        <div className="layout-container">
          {/* Logo - Left Side */}
          <a 
            href="/" 
            className="layout-logo"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
          >
            <div className="logo-icon">
              <i className="fa-solid fa-utensils"></i>
            </div>
            <div className="logo-text">
              <h1>Delicious Bites</h1>
              <span>RESTAURANT & BAR</span>
            </div>
          </a>

          {/* Navigation Links - Center */}
          <div className="nav-container">
            {user && (
              <div className="nav-links">
                {user.role === "user" && (
                  <>
                    <a 
                      href="#" 
                      onClick={(e) => { 
                        e.preventDefault(); 
                        navigate('/menu'); 
                      }}
                      className="nav-link menu"
                      title="Browse Menu"
                    >
                      <i className="fa-solid fa-burger"></i>
                      <span>Menu</span>
                    </a>
                    
                    <a 
                      href="#" 
                      onClick={(e) => { 
                        e.preventDefault(); 
                        navigate('/booking'); 
                      }}
                      className="nav-link booking"
                      title="Book a Table"
                    >
                      <i className="fa-solid fa-calendar-check"></i>
                      <span>Book Table</span>
                    </a>
                    
                    <a 
                      href="#" 
                      onClick={(e) => { 
                        e.preventDefault(); 
                        navigate('/orders'); 
                      }}
                      className="nav-link orders"
                      title="View Order History"
                    >
                      <i className="fa-solid fa-receipt"></i>
                      <span>Order History</span>
                    </a>
                    
                    {/* Integrated CartIcon Component - SINGLE CART BUTTON */}
                    <div className="cart-icon-container">
                      <CartIcon />
                    </div>
                  </>
                )}
                
                {user.role === "admin" && (
                  <a 
                    href="#" 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      navigate('/admin'); 
                    }}
                    className="nav-link admin"
                    title="Admin Dashboard"
                  >
                    <i className="fa-solid fa-user-shield"></i>
                    <span>Admin Panel</span>
                  </a>
                )}
                
                {/* Special Offers */}
                <div className="offers-banner" title="View Special Offers">
                  <i className="fa-solid fa-tag"></i>
                  <span>Special Offers</span>
                </div>
              </div>
            )}
          </div>

          {/* User Section - Right Side */}
          {user && (
            <div className="user-section">
              <div 
                className="user-greeting"
                title={`${user.firstName} ${user.lastName} - ${user.role}`}
              >
                <div className="user-avatar">
                  {getUserInitials()}
                </div>
                <div className="user-info">
                  <span className="user-name">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="user-role">
                    <i className="fa-solid fa-crown"></i>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="nav-divider"></div>
              
              <button 
                onClick={handleLogout} 
                className="logout-button"
                title="Logout"
              >
                <i className="fa-solid fa-right-from-bracket"></i>
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="layout-main">
        {children}
      </main>

      {/* Floating Action Button for Quick Access */}
      <button 
        onClick={() => navigate('/menu')}
        className="fab-button"
        title="Quick Menu Access"
      >
        <i className="fa-solid fa-bolt"></i>
      </button>
    </div>
  );
};

export default Layout;
