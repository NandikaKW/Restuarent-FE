import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../components/componentStyles/LoginPage.css';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [success, setSuccess] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setShowSuccess(false);
    setLoading(true);

    try {
      await login(formData);
      setSuccess('Login successful! Welcome back. Redirecting to dashboard...');
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  return (
    <div className="login-page-container">
      {/* Hero Section */}
      <section className="login-page-hero">
        <div className="login-hero-content">
          <div className="login-hero-text">
            <h1>Welcome Back Delicious Bites!</h1>
            <p>Sign in to continue your delicious journey with us</p>
          </div>
        </div>
      </section>

      <div className="login-page-wrapper">
        {/* Main Content */}
        <main className="login-page-main">
          <div className="login-page-header">
            <div className="login-heading-two">
              <h2>Sign In to Your Account</h2>
              <div className="login-line"></div>
            </div>
            <p className="login-subtitle">
              Access personalized recommendations and exclusive offers
            </p>
          </div>

          {/* Quick Stats */}
          <div className="login-stats-grid">
            <div className="login-stat-card">
              <i className="fa-solid fa-clock-rotate-left"></i>
              <div>
                <h3>Last Login</h3>
                <p>Welcome back!</p>
              </div>
            </div>
            <div className="login-stat-card">
              <i className="fa-solid fa-gift"></i>
              <div>
                <h3>Active Offers</h3>
                <p>3 waiting for you</p>
              </div>
            </div>
          </div>

          {/* Login Form Container */}
          <div className="login-form-container">
            <div className="login-form-sidebar">
              <div className="login-features-header">
                <i className="fa-solid fa-star"></i>
                <h3>Your Benefits</h3>
              </div>
              
              <div className="login-features-list">
                <div className="login-feature-item">
                  <div className="login-feature-icon">
                    <i className="fa-solid fa-history"></i>
                  </div>
                  <div className="login-feature-content">
                    <h4>Order History</h4>
                    <p>Track all your previous orders</p>
                  </div>
                </div>
                
                <div className="login-feature-item">
                  <div className="login-feature-icon">
                    <i className="fa-solid fa-heart"></i>
                  </div>
                  <div className="login-feature-content">
                    <h4>Favorites</h4>
                    <p>Access your saved items</p>
                  </div>
                </div>
                
                <div className="login-feature-item">
                  <div className="login-feature-icon">
                    <i className="fa-solid fa-bolt"></i>
                  </div>
                  <div className="login-feature-content">
                    <h4>Quick Reorder</h4>
                    <p>Reorder in one click</p>
                  </div>
                </div>
                
                <div className="login-feature-item">
                  <div className="login-feature-icon">
                    <i className="fa-solid fa-percent"></i>
                  </div>
                  <div className="login-feature-content">
                    <h4>Exclusive Deals</h4>
                    <p>Member-only discounts</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Login Form */}
            <div className="login-form-content">
              {error && (
                <div className="login-error-message">
                  <i className="fa-solid fa-exclamation-triangle"></i>
                  <span>{error}</span>
                  <button onClick={() => setError('')} className="login-error-close">
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              )}

              {success && showSuccess && (
                <div className="login-success-message">
                  <i className="fa-solid fa-circle-check"></i>
                  <div className="login-success-content">
                    <h4>Welcome Back!</h4>
                    <p>{success}</p>
                  </div>
                  <div className="login-success-progress">
                    <div className="login-success-progress-bar"></div>
                  </div>
                </div>
              )}

              <form className="login-page-form" onSubmit={handleSubmit}>
                <div className="login-form-header">
                  <i className="fa-solid fa-sign-in-alt"></i>
                  <div>
                    <h3>Enter Your Credentials</h3>
                    <p>Secure login to your account</p>
                  </div>
                </div>

                <div className="login-input-group">
                  <label className="login-input-label">
                    <i className="fa-solid fa-envelope"></i>
                    Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="login-form-input"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <div className="login-input-hint">
                    <i className="fa-solid fa-info-circle"></i>
                    Enter the email you used during registration
                  </div>
                </div>

                <div className="login-input-group">
                  <label className="login-input-label">
                    <i className="fa-solid fa-lock"></i>
                    Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    required
                    className="login-form-input"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <div className="login-password-actions">
                    <div className="login-remember-me" onClick={toggleRememberMe}>
                      <div className={`login-remember-checkbox ${rememberMe ? 'checked' : ''}`}>
                        {rememberMe && <i className="fa-solid fa-check"></i>}
                      </div>
                      <span className="login-remember-text">Remember me</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="login-submit-button"
                >
                  {loading ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i>
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-sign-in-alt"></i>
                      Sign In
                    </>
                  )}
                </button>

                <div className="login-signup-section">
                  <div className="login-signup-text">
                    <i className="fa-solid fa-user-plus"></i>
                    <span>New to our platform?</span>
                  </div>
                  <Link to="/signup" className="login-signup-link">
                    Create Your Account
                    <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </div>
              </form>
            </div>
          </div>

          {/* Security Note */}
          <div className="login-security-note">
            <i className="fa-solid fa-shield-alt"></i>
            <div>
              <h4>Secure Login</h4>
              <p>Your credentials are protected with 256-bit SSL encryption</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Login;