// src/components/SidebarNavbar.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../components/componentStyles/SidebarNavbar.css';
import { useNavigate } from 'react-router-dom';

const SidebarNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); 

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Function to go to Dashboard
  const goToDashboard = () => {
    navigate('/dashboard'); // navigate to Dashboard route
    toggleSidebar(); // close sidebar if open
  };

  return (
    <>
      
      <button 
        className={`hamburger-menu ${isOpen ? 'open' : ''}`}
        onClick={toggleSidebar}
        aria-label="Toggle navigation"
      >
        {isOpen ? (
          <i className="fa-solid fa-times close-icon"></i>
        ) : (
          <>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
          </>
        )}
      </button>

      
      {isOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}

      
      <nav className={`sidebar-navbar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header"> ... </div>

        <div className="sidebar-content">
          <div className="nav-section">
            <h3 className="section-title">
              <i className="fa-solid fa-compass"></i>
              Explore Our Restaurant
            </h3>

            
            <div className="nav-item" onClick={goToDashboard}>
              <div className="nav-icon">
                <i className="fa-solid fa-home"></i>
              </div>
              <div className="nav-text">
                <h4>Home</h4>
                <p>Welcome to our restaurant</p>
              </div>
              <i className="nav-arrow fa-solid fa-chevron-right"></i>
            </div>

            <Link to="/about" className="nav-item" onClick={toggleSidebar}>
              <div className="nav-icon">
                <i className="fa-solid fa-building"></i>
              </div>
              <div className="nav-text">
                <h4>About Us</h4>
                <p>Our story & philosophy</p>
              </div>
              <i className="nav-arrow fa-solid fa-chevron-right"></i>
            </Link>

            <Link to="/chefs" className="nav-item" onClick={toggleSidebar}>
              <div className="nav-icon">
                <i className="fa-solid fa-user-tie"></i>
              </div>
              <div className="nav-text">
                <h4>Master Chefs</h4>
                <p>Meet our culinary experts</p>
              </div>
              <i className="nav-arrow fa-solid fa-chevron-right"></i>
            </Link>
          </div>

          
          <div className="nav-section">
            <h3 className="section-title">
              <i className="fa-solid fa-award"></i>
              Restaurant Highlights
            </h3>

            <div className="highlight-item">
              <div className="highlight-icon">
                <i className="fa-solid fa-clock"></i>
              </div>
              <div className="highlight-text">
                <h4>Opening Hours</h4>
                <p>Tuesday - Sunday: 12 PM - 11 PM</p>
              </div>
            </div>

            <div className="highlight-item">
              <div className="highlight-icon">
                <i className="fa-solid fa-medal"></i>
              </div>
              <div className="highlight-text">
                <h4>Awards & Recognition</h4>
                <p>Michelin Star 2022, 2023</p>
              </div>
            </div>

            <div className="highlight-item">
              <div className="highlight-icon">
                <i className="fa-solid fa-leaf"></i>
              </div>
              <div className="highlight-text">
                <h4>Fresh Ingredients</h4>
                <p>Locally sourced, organic produce</p>
              </div>
            </div>
          </div>

          
          <div className="nav-section">
            <h3 className="section-title">
              <i className="fa-solid fa-fire"></i>
              Chef's Special
            </h3>

            <div className="special-item">
              <img 
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" 
                alt="Weekly Special" 
                className="special-image"
              />
              <div className="special-info">
                <h4>Weekly Special</h4>
                <p>Gourmet Burger with Truffle Fries</p>
                <div className="special-price">
                  <span className="price">$24.99</span>
                  <span className="discount">15% OFF</span>
                </div>
              </div>
            </div>
          </div>

          
          <div className="cta-section">
            <Link to="/reservation" className="book-table-btn" onClick={toggleSidebar}>
              <i className="fa-solid fa-calendar-check"></i>
              Book a Table
            </Link>
            <Link to="/login" className="login-link" onClick={toggleSidebar}>
              Already have an account? <span>Sign In</span>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="contact-info">
            <p>
              <i className="fa-solid fa-phone"></i>
              +1 (555) 123-4567
            </p>
            <p>
              <i className="fa-solid fa-location-dot"></i>
              123 Gourmet Street, Food City
            </p>
          </div>
          <div className="social-links">
            <a href="#" className="social-link">
              <i className="fa-brands fa-facebook-f"></i>
            </a>
            <a href="#" className="social-link">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="#" className="social-link">
              <i className="fa-brands fa-twitter"></i>
            </a>
          </div>
        </div>
      </nav>
    </>
  );
};

export default SidebarNavbar;