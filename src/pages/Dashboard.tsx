import { useAuth } from '../contexts/AuthContext';
import Preloader from '../components/Preloader';
import '../components/componentStyles/Dashboard.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showStoryPopup, setShowStoryPopup] = useState(false);
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/embed/V5w1OGknhlc');


  const chefs = [
    {
      id: 1,
      name: "Maria Rodriguez",
      role: "Head Chef",
      image: "https://images.unsplash.com/photo-1583394293214-28ded15ee548?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      name: "James Wilson",
      role: "Pastry Chef",
      image: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      name: "Sarah Chen",
      role: "Sous Chef",
      image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    }
  ];

  // Story popup content
  const StoryPopup = () => (
    <div className="story-popup-overlay" onClick={() => setShowStoryPopup(false)}>
      <div className="story-popup-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="story-popup-close"
          onClick={() => setShowStoryPopup(false)}
        >
          &times;
        </button>
        <h2>Our Story</h2>
        <div className="story-content">
          <p>
            <strong>Delicious Bites</strong> began as a small family-owned restaurant in 2010,
            founded by Chef Maria Rodriguez and her husband James. What started as a humble
            kitchen serving authentic Italian-American cuisine has grown into a beloved
            culinary destination.
          </p>
          <p>
            Our philosophy is simple: use the freshest ingredients, prepare every dish with
            passion, and treat every guest like family. We believe that great food brings
            people together and creates lasting memories.
          </p>
          <p>
            Over the years, we've expanded our menu to include gourmet burgers, artisanal
            pizzas, handmade pasta, and decadent desserts—all while maintaining our commitment
            to quality and tradition.
          </p>
          <div className="story-highlights">
            <div className="story-highlight">
              <i className="fa-solid fa-heart"></i>
              <span>Family-Owned Since 2010</span>
            </div>
            <div className="story-highlight">
              <i className="fa-solid fa-award"></i>
              <span>15+ Culinary Awards</span>
            </div>
            <div className="story-highlight">
              <i className="fa-solid fa-users"></i>
              <span>10,000+ Happy Customers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Video Popup Component
  const VideoPopup = () => (
    <div className="video-popup-overlay" onClick={() => setShowVideoPopup(false)}>
      <div className="video-popup-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="video-popup-close"
          onClick={() => setShowVideoPopup(false)}
        >
          &times;
        </button>
        <h3>Our Restaurant Story</h3>
        <div className="video-container">
          <iframe
            width="100%"
            height="400"
            src={videoUrl}
            title="Delicious Bites Restaurant Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <p className="video-description">
          A delicious burger-making food video showcasing fresh ingredients and mouth-watering preparation.
        </p>
      </div>
    </div>
  );

  return (
    <>
      <Preloader />

      <div className="dashboard-restaurant-container">
        {/* Hero Section */}
        <section className="slider-hero">
          <div className="hero-section">
            <div className="container">
              <div className="row align-items-end">
                <div className="col-xl-6">
                  <div className="featured-area">
                    <h2>Welcome Back, {user?.firstName}!</h2>
                    <h5>Your personal dashboard at Delicious Bites - Where every bite tells a story</h5>
                    <div className="d-flex align-items-center">
                      <button
                        className="button"
                        onClick={() => navigate('/menu')}
                      >
                        Explore Menu
                      </button>

                      {/* Video Button */}
                      <div className="video">
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setShowVideoPopup(true);
                          }}
                        >
                          <i>
                            <svg width="15" height="22" viewBox="0 0 11 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M11 8.5L0.5 0.272758L0.5 16.7272L11 8.5Z" fill="#fff" />
                            </svg>
                          </i>
                          Watch Video
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="weekly-special">
            <span>Weekly Special</span>
            <div>
              <h4><sup>$</sup>24.99</h4>
              <h5>Gourmet Burger</h5>
              <ul className="star">
                {[...Array(5)].map((_, i) => (
                  <li key={i}><i className="fa-solid fa-star"></i></li>
                ))}
              </ul>
            </div>
            <img
              alt="Burger"
              src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80"
              width="100"
            />
          </div>
        </section>

        {/* Profile Section - Elegant Design */}
        <section className="gap profile-section-elegant">
          <div className="container">
            <div className="profile-header">
              <div className="profile-header-content">
                <h2>
                  <i className="fa-solid fa-user-circle"></i>
                  Welcome Back, {user?.firstName}!
                </h2>
                <p>Your personalized dashboard at Delicious Bites</p>
              </div>
              <div className="profile-header-badge">
                <div className="badge-icon">
                  <i className="fa-solid fa-award"></i>
                </div>
                <div className="badge-content">
                  <span className="badge-title">Gold Member</span>
                  <span className="badge-desc">Premium Dining Access</span>
                </div>
              </div>
            </div>

            <div className="profile-content-grid">
              {/* Profile Card */}
              <div className="profile-card-elegant">
                <div className="profile-card-header">
                  <div className="profile-avatar">
                    <div className="avatar-initials">
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </div>
                    <div className="online-status"></div>
                  </div>
                  <div className="profile-title">
                    <h3>Account Profile</h3>
                    <p>Manage your personal information</p>
                  </div>
                </div>

                <div className="profile-details-elegant">
                  <div className="detail-row">
                    <div className="detail-label">
                      <i className="fa-solid fa-id-badge"></i>
                      <span>Full Name</span>
                    </div>
                    <div className="detail-value">
                      {user?.firstName} {user?.lastName}
                    </div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-label">
                      <i className="fa-solid fa-envelope"></i>
                      <span>Email Address</span>
                    </div>
                    <div className="detail-value">
                      {user?.email}
                    </div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-label">
                      <i className="fa-solid fa-fingerprint"></i>
                      <span>User ID</span>
                    </div>
                    <div className="detail-value user-id">
                      {user?.id}
                    </div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-label">
                      <i className="fa-solid fa-user-tag"></i>
                      <span>Account Type</span>
                    </div>
                    <div className="detail-value">
                      <div className={`role-badge-elegant ${user?.role?.toLowerCase()}`}>
                        <i className="fa-solid fa-shield"></i>
                        {user?.role}
                      </div>
                    </div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-label">
                      <i className="fa-solid fa-calendar-check"></i>
                      <span>Member Since</span>
                    </div>
                    <div className="detail-value">
                      January 2024
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid - Elegant Version */}
              <div className="stats-grid-elegant">
                <div className="stats-header">
                  <h3>Your Activity</h3>
                  <p>Monthly overview</p>
                </div>

                <div className="stats-cards-elegant">
                  <div className="stat-card-elegant">
                    <div className="stat-icon orders">
                      <i className="fa-solid fa-utensils"></i>
                    </div>
                    <div className="stat-content">
                      <h4>24</h4>
                      <p>Total Orders</p>
                      <div className="stat-progress">
                        <div className="progress-bar" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="stat-card-elegant">
                    <div className="stat-icon reviews">
                      <i className="fa-solid fa-star"></i>
                    </div>
                    <div className="stat-content">
                      <h4>15</h4>
                      <p>Reviews</p>
                      <div className="stat-progress">
                        <div className="progress-bar" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="stat-card-elegant">
                    <div className="stat-icon favorites">
                      <i className="fa-solid fa-heart"></i>
                    </div>
                    <div className="stat-content">
                      <h4>8</h4>
                      <p>Favorites</p>
                      <div className="stat-progress">
                        <div className="progress-bar" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="stat-card-elegant">
                    <div className="stat-icon visits">
                      <i className="fa-solid fa-calendar-days"></i>
                    </div>
                    <div className="stat-content">
                      <h4>12</h4>
                      <p>Restaurant Visits</p>
                      <div className="stat-progress">
                        <div className="progress-bar" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Membership Card */}
                {/* <div className="membership-card">
                  <div className="membership-header">
                    <h4>Membership Status</h4>
                    <span className="membership-level gold">GOLD</span>
                  </div>
                  <div className="membership-content">
                    <div className="membership-progress">
                      <div className="progress-text">
                        <span>Progress to Platinum</span>
                        <span>75%</span>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    <div className="membership-benefits">
                      <div className="benefit">
                        <i className="fa-solid fa-check"></i>
                        <span>Free dessert on orders</span>
                      </div>
                      <div className="benefit">
                        <i className="fa-solid fa-check"></i>
                        <span>Priority reservations</span>
                      </div>
                      <div className="benefit">
                        <i className="fa-solid fa-check"></i>
                        <span>10% discount on all orders</span>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </section>

        {/* Chefs Section with Book Table Button */}
        <section className="gap no-top">
          <div className="container">
            <div className="heading-two">
              <h2>Meet Our Experts</h2>
              <div className="line"></div>
            </div>

            <div className="row">
              {chefs.map((chef, index) => (
                <div key={chef.id} className="col-xl-4">
                  <div className={`chef ${index === 2 ? 'mb-0' : ''}`}>
                    <img
                      alt="chef"
                      src={chef.image}
                      width="400"
                      height="500"
                    />
                    <div className="chef-text">
                      <div>
                        <span>{chef.role}</span>
                        <a href="#"><h3>{chef.name}</h3></a>
                        <ul className="social-media">
                          <li><a href="#"><i className="fa-brands fa-facebook-f"></i></a></li>
                          <li><a href="#"><i className="fa-brands fa-twitter"></i></a></li>
                          <li><a href="#"><i className="fa-brands fa-linkedin-in"></i></a></li>
                        </ul>
                        <svg width="100" height="10" viewBox="0 0 100 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2 5C33.3333 1.66667 66.6667 1.66667 98 5" stroke="#f3274c" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Book Table Section */}
            <div className="book-table-section-enhanced">
              <div className="book-table-container">
                <div className="book-table-header">
                  <span className="book-table-badge">
                    <i className="fa-solid fa-crown"></i>
                    Premium Experience
                  </span>
                  <h3>Ready for an Exclusive Dining Experience?</h3>
                  <p className="book-table-subtitle">
                    Reserve your table now and enjoy a culinary journey crafted by our master chefs
                  </p>
                </div>

                <div className="book-table-features">
                  <div className="feature-item">
                    <div className="feature-icon">
                      <i className="fa-solid fa-star"></i>
                    </div>
                    <div className="feature-content">
                      <h5>Best Tables</h5>
                      <p>Window views & private booths</p>
                    </div>
                  </div>

                  <div className="feature-item">
                    <div className="feature-icon">
                      <i className="fa-solid fa-clock"></i>
                    </div>
                    <div className="feature-content">
                      <h5>Flexible Timing</h5>
                      <p>Choose your preferred slot</p>
                    </div>
                  </div>

                  <div className="feature-item">
                    <div className="feature-icon">
                      <i className="fa-solid fa-gift"></i>
                    </div>
                    <div className="feature-content">
                      <h5>Welcome Drink</h5>
                      <p>Complimentary signature cocktail</p>
                    </div>
                  </div>

                  <div className="feature-item">
                    <div className="feature-icon">
                      <i className="fa-solid fa-shield-alt"></i>
                    </div>
                    <div className="feature-content">
                      <h5>Instant Confirm</h5>
                      <p>Real-time table availability</p>
                    </div>
                  </div>
                </div>

                <div className="book-table-cta">
                  <button
                    className="button book-table-btn-enhanced"
                    onClick={() => navigate('/booking')}
                  >
                    <div className="btn-content">
                      <i className="fa-solid fa-calendar-check"></i>
                      <div className="btn-text">
                        <span className="btn-title">Book Table Now</span>
                        <span className="btn-subtitle">Only a few spots left for tonight!</span>
                      </div>
                      <i className="fa-solid fa-arrow-right"></i>
                    </div>
                  </button>

                  <div className="book-table-stats">
                    <div className="stat">
                      <i className="fa-solid fa-users"></i>
                      <div>
                        <span className="stat-number">12</span>
                        <span className="stat-label">Tables Available</span>
                      </div>
                    </div>
                    <div className="stat">
                      <i className="fa-solid fa-clock-rotate-left"></i>
                      <div>
                        <span className="stat-number">24/7</span>
                        <span className="stat-label">Booking Open</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="book-table-footer">
                  <p>
                    <i className="fa-solid fa-check-circle"></i>
                    <span>No cancellation fee • Free rescheduling • Priority seating</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Restaurant Section */}
        <section className="about-section gap no-top">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-xl-6 col-lg-6 col-md-12">
                <div className="about-images">
                  <div className="main-image">
                    <img
                      src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                      alt="Restaurant Interior"
                      className="img-fluid"
                    />
                    <div className="experience-badge">
                      <div className="badge-content">
                        <span className="years">5+</span>
                        <span className="text">Years Serving</span>
                      </div>
                    </div>
                  </div>
                  <div className="floating-image floating-1">
                    <img
                      src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80"
                      alt="Fresh Ingredients"
                    />
                  </div>
                  <div className="floating-image floating-2">
                    <img
                      src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80"
                      alt="Delicious Food"
                    />
                  </div>
                </div>
              </div>

              <div className="col-xl-6 col-lg-6 col-md-12">
                <div className="about-content">
                  <div className="heading heading-two">
                    <span>About Our Restaurant</span>
                    <h2>Crafting Memorable Dining Experiences</h2>
                    <div className="line"></div>
                  </div>

                  <div className="about-text">
                    <p>
                      Welcome to <strong>Delicious Bites</strong>, where passion meets perfection on every plate.
                      We specialize in serving the finest pizzas, burgers, desserts, drinks, pasta, and snacks.
                    </p>

                    <div className="features-grid">
                      <div className="feature-item">
                        <div className="feature-icon">
                          <i className="fa-solid fa-pizza-slice"></i>
                        </div>
                        <div className="feature-text">
                          <h5>Authentic Pizzas</h5>
                          <p>Wood-fired oven baked perfection</p>
                        </div>
                      </div>

                      <div className="feature-item">
                        <div className="feature-icon">
                          <i className="fa-solid fa-burger"></i>
                        </div>
                        <div className="feature-text">
                          <h5>Gourmet Burgers</h5>
                          <p>100% premium beef patties</p>
                        </div>
                      </div>

                      <div className="feature-item">
                        <div className="feature-icon">
                          <i className="fa-solid fa-ice-cream"></i>
                        </div>
                        <div className="feature-text">
                          <h5>Artisan Desserts</h5>
                          <p>Handcrafted sweet creations</p>
                        </div>
                      </div>

                      <div className="feature-item">
                        <div className="feature-icon">
                          <i className="fa-solid fa-martini-glass-citrus"></i>
                        </div>
                        <div className="feature-text">
                          <h5>Craft Drinks</h5>
                          <p>Signature cocktails & mocktails</p>
                        </div>
                      </div>
                    </div>

                    <div className="stats-container">
                      <div className="stat-item">
                        <h3>50+</h3>
                        <p>Menu Items</p>
                      </div>
                      <div className="stat-item">
                        <h3>10k+</h3>
                        <p>Happy Customers</p>
                      </div>
                      <div className="stat-item">
                        <h3>24/7</h3>
                        <p>Online Orders</p>
                      </div>
                      <div className="stat-item">
                        <h3>15</h3>
                        <p>Awards Won</p>
                      </div>
                    </div>

                    <div className="about-buttons">
                      <button
                        className="button"
                        onClick={() => setShowStoryPopup(true)}
                      >
                        Our Story
                      </button>
                      <a
                        href="#"
                        className="button button-outline"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowVideoPopup(true);
                        }}
                      >
                        <i className="fa-solid fa-play me-2"></i>
                        Watch Video
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Story Popup */}
      {showStoryPopup && <StoryPopup />}

      {/* Video Popup */}
      {showVideoPopup && <VideoPopup />}
    </>
  );
};

export default Dashboard;
