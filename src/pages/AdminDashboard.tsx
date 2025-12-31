import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import OrderManagement from './admin/OrderManagement';
import MenuManagement from './admin/MenuManagement';
import UserManagement from './admin/UserManagement';
import ReviewManagement from './admin/ReviewManagement';
import BookingManagement from './admin/BookingManagement';
import '.././components/componentStyles/AdminDashboard.css';
import PaymentManagement from './admin/PaymentManagement';


const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    'orders' | 'menu' | 'users' | 'reviews' | 'analytics' | 'bookings' | 'payments' 
  >('orders');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (user?.role !== 'admin') {
    return (
      <div className="admin-access-denied">
        <div className="access-denied-card">
          <div className="denied-icon">
            <i className="fa-solid fa-shield-xmark"></i>
          </div>
          <h2>Access Denied</h2>
          <p>Admin privileges required to access this panel.</p>
          <button
            onClick={() => navigate('/')}
            className="denied-home-btn"
          >
            <i className="fa-solid fa-home"></i>
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Admin Header - Updated to match Layout style */}
      <header className="admin-header">
        <div className="admin-header-container">
          {/* Admin Logo */}
          <div className="admin-logo">
            <div className="admin-logo-icon">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <div className="admin-logo-text">
              <h1>Delicious Bites</h1>
              <span>ADMIN CONTROL PANEL</span>
            </div>
          </div>

          {/* Admin User Info */}
          <div className="admin-user-info">
            <div className="admin-user-avatar">
              {user?.firstName?.[0] || 'A'}
            </div>
            <div className="admin-user-details">
              <span className="admin-user-name">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="admin-user-role">
                <i className="fa-solid fa-crown"></i>
                Administrator
              </span>
            </div>
            <div className="admin-divider"></div>
            <button
              onClick={handleLogout}
              className="admin-logout-btn"
              title="Logout"
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Admin Main Content */}
      <main className="admin-main">
        <div className="admin-container">
          {/* Admin Welcome Banner */}
          <div className="admin-welcome-banner">
            <div className="welcome-content">
              <h2>
                <i className="fa-solid fa-gem"></i>
                Welcome to Admin Dashboard
              </h2>
              <p>Manage your restaurant operations efficiently</p>
            </div>
            <div className="welcome-stats">
              <div className="stat-card">
                <i className="fa-solid fa-chart-line"></i>
                <span className="stat-label">Total Revenue</span>
                <span className="stat-value">$12,345</span>
              </div>
              <div className="stat-card">
                <i className="fa-solid fa-receipt"></i>
                <span className="stat-label">Orders Today</span>
                <span className="stat-value">24</span>
              </div>
              <div className="stat-card">
                <i className="fa-solid fa-users"></i>
                <span className="stat-label">Active Users</span>
                <span className="stat-value">156</span>
              </div>
            </div>
          </div>

          {/* Tab Navigation - Updated Design */}
          <div className="admin-tabs-container">
            <nav className="admin-tabs">
              <button
                onClick={() => setActiveTab('orders')}
                className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
                title="Manage Orders"
              >
                <i className="fa-solid fa-box-open"></i>
                <span>Orders</span>
                {activeTab === 'orders' && <div className="tab-indicator"></div>}
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`admin-tab ${activeTab === 'payments' ? 'active' : ''}`}
                title="Manage Payments"
              >
                <i className="fa-solid fa-money-check-dollar"></i> {/* Updated icon */}
                <span>Payments</span>
                {activeTab === 'payments' && <div className="tab-indicator"></div>}
              </button>

              <button
                onClick={() => setActiveTab('menu')}
                className={`admin-tab ${activeTab === 'menu' ? 'active' : ''}`}
                title="Manage Menu Items"
              >
                <i className="fa-solid fa-utensils"></i>
                <span>Menu</span>
                {activeTab === 'menu' && <div className="tab-indicator"></div>}
              </button>

              <button
                onClick={() => setActiveTab('users')}
                className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
                title="Manage Users"
              >
                <i className="fa-solid fa-users-gear"></i>
                <span>Users</span>
                {activeTab === 'users' && <div className="tab-indicator"></div>}
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`admin-tab ${activeTab === 'reviews' ? 'active' : ''}`}
                title="Manage Reviews"
              >
                <i className="fa-solid fa-star"></i>
                <span>Reviews</span>
                {activeTab === 'reviews' && <div className="tab-indicator"></div>}
              </button>

              <button
                onClick={() => setActiveTab('bookings')}
                className={`admin-tab ${activeTab === 'bookings' ? 'active' : ''}`}
                title="Manage Bookings"
              >
                <i className="fa-solid fa-calendar-days"></i>
                <span>Bookings</span>
                {activeTab === 'bookings' && <div className="tab-indicator"></div>}
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`admin-tab ${activeTab === 'analytics' ? 'active' : ''}`}
                title="View Analytics"
              >
                <i className="fa-solid fa-chart-pie"></i>
                <span>Analytics</span>
                {activeTab === 'analytics' && <div className="tab-indicator"></div>}
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="admin-content">
            {activeTab === 'orders' && (
              <div className="tab-content">
                <OrderManagement />
              </div>
            )}
            {activeTab === 'payments' && ( // Add this section
              <div className="tab-content">
                <PaymentManagement />
              </div>
            )}
            {activeTab === 'menu' && (
              <div className="tab-content">
                <MenuManagement />
              </div>
            )}
            {activeTab === 'users' && (
              <div className="tab-content">
                <UserManagement />
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="tab-content">
                <ReviewManagement />
              </div>
            )}
            {activeTab === 'bookings' && (
              <div className="tab-content">
                <BookingManagement />
              </div>
            )}
            {activeTab === 'analytics' && (
              <div className="tab-content">
                <div className="analytics-dashboard">
                  <h3 className="analytics-title">
                    <i className="fa-solid fa-chart-simple"></i>
                    Analytics Dashboard
                  </h3>
                  <div className="analytics-grid">
                    <div className="analytic-card revenue">
                      <div className="analytic-icon">
                        <i className="fa-solid fa-money-bill-trend-up"></i>
                      </div>
                      <div className="analytic-content">
                        <span className="analytic-label">Total Revenue</span>
                        <span className="analytic-value">$12,345</span>
                        <span className="analytic-trend positive">
                          <i className="fa-solid fa-arrow-up"></i>
                          12.5%
                        </span>
                      </div>
                    </div>

                    <div className="analytic-card orders">
                      <div className="analytic-icon">
                        <i className="fa-solid fa-receipt"></i>
                      </div>
                      <div className="analytic-content">
                        <span className="analytic-label">Orders Today</span>
                        <span className="analytic-value">24</span>
                        <span className="analytic-trend positive">
                          <i className="fa-solid fa-arrow-up"></i>
                          8.3%
                        </span>
                      </div>
                    </div>

                    <div className="analytic-card menu">
                      <div className="analytic-icon">
                        <i className="fa-solid fa-utensils"></i>
                      </div>
                      <div className="analytic-content">
                        <span className="analytic-label">Menu Items</span>
                        <span className="analytic-value">45</span>
                        <span className="analytic-trend neutral">
                          <i className="fa-solid fa-minus"></i>
                          0%
                        </span>
                      </div>
                    </div>

                    <div className="analytic-card users">
                      <div className="analytic-icon">
                        <i className="fa-solid fa-users"></i>
                      </div>
                      <div className="analytic-content">
                        <span className="analytic-label">Active Users</span>
                        <span className="analytic-value">156</span>
                        <span className="analytic-trend positive">
                          <i className="fa-solid fa-arrow-up"></i>
                          5.2%
                        </span>
                      </div>
                    </div>

                    <div className="analytic-card reviews">
                      <div className="analytic-icon">
                        <i className="fa-solid fa-star"></i>
                      </div>
                      <div className="analytic-content">
                        <span className="analytic-label">Avg. Rating</span>
                        <span className="analytic-value">4.7</span>
                        <span className="analytic-trend positive">
                          <i className="fa-solid fa-arrow-up"></i>
                          0.3%
                        </span>
                      </div>
                    </div>

                    <div className="analytic-card bookings">
                      <div className="analytic-icon">
                        <i className="fa-solid fa-calendar-check"></i>
                      </div>
                      <div className="analytic-content">
                        <span className="analytic-label">Today's Bookings</span>
                        <span className="analytic-value">18</span>
                        <span className="analytic-trend negative">
                          <i className="fa-solid fa-arrow-down"></i>
                          2.1%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Quick Actions FAB */}
      <button
        onClick={() => navigate('/')}
        className="admin-fab"
        title="Go to Main Site"
      >
        <i className="fa-solid fa-house"></i>
      </button>
    </div>
  );
};

export default AdminDashboard;