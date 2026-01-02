// src/components/Signup.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../components/componentStyles/SignupPage.css';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'password') {
      const strength = checkPasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const checkPasswordStrength = (password: string): string => {
    if (password.length === 0) return '';
    if (password.length < 6) return 'weak';
    if (password.length < 10) return 'medium';
    if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
      return 'strong';
    }
    return 'medium';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signup(formData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page-container">
      {/* Hero Section */}
      <section className="signup-page-hero">
        <div className="signup-hero-content">
          <div className="signup-hero-text">
            <h1>Join Our Culinary Family</h1>
            <p>Create an account to unlock exclusive features and personalized dining experiences</p>
          </div>
        </div>
      </section>

      <div className="signup-page-wrapper">
        {/* Main Content */}
        <main className="signup-page-main">
          <div className="signup-page-header">
            <div className="signup-heading-two">
              <h2>Create Your Account</h2>
              <div className="signup-line"></div>
            </div>
            <p className="signup-subtitle">
              Join thousands of food enthusiasts who trust us for their dining adventures
            </p>
          </div>

          {/* Stats */}
          <div className="signup-stats-grid">
            <div className="signup-stat-card">
              <i className="fa-solid fa-users"></i>
              <div>
                <h3>10K+</h3>
                <p>Food Lovers</p>
              </div>
            </div>
            <div className="signup-stat-card">
              <i className="fa-solid fa-utensils"></i>
              <div>
                <h3>500+</h3>
                <p>Restaurants</p>
              </div>
            </div>
            <div className="signup-stat-card">
              <i className="fa-solid fa-star"></i>
              <div>
                <h3>4.8</h3>
                <p>Avg Rating</p>
              </div>
            </div>
          </div>

          {/* Signup Form */}
          <div className="signup-form-container">
            {error && (
              <div className="signup-error-message">
                <i className="fa-solid fa-exclamation-triangle"></i>
                <span>{error}</span>
                <button onClick={() => setError('')} className="signup-error-close">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            )}

            <form className="signup-page-form" onSubmit={handleSubmit}>
              <div className="signup-form-header">
                <i className="fa-solid fa-user-plus"></i>
                <div>
                  <h3>Personal Information</h3>
                  <p>Let's get to know you better</p>
                </div>
              </div>

              <div className="signup-name-grid">
                <div className="signup-input-group">
                  <label className="signup-input-label">
                    <i className="fa-solid fa-user"></i>
                    First Name
                  </label>
                  <input
                    name="firstName"
                    type="text"
                    required
                    className="signup-form-input"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>

                <div className="signup-input-group">
                  <label className="signup-input-label">
                    <i className="fa-solid fa-user-friends"></i>
                    Last Name
                  </label>
                  <input
                    name="lastName"
                    type="text"
                    required
                    className="signup-form-input"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="signup-input-group">
                <label className="signup-input-label">
                  <i className="fa-solid fa-envelope"></i>
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="signup-form-input"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="signup-input-group">
                <label className="signup-input-label">
                  <i className="fa-solid fa-lock"></i>
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  className="signup-form-input"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                />

                {passwordStrength && (
                  <div className="signup-password-strength">
                    <div className="signup-strength-indicator">
                      <div className={`signup-strength-dot ${passwordStrength === 'weak' ? 'active' : ''}`}></div>
                      <div className={`signup-strength-dot ${passwordStrength === 'medium' ? 'active' : ''}`}></div>
                      <div className={`signup-strength-dot ${passwordStrength === 'strong' ? 'active' : ''}`}></div>
                    </div>
                    <div className="signup-strength-labels">
                      <span className={`signup-strength-label ${passwordStrength === 'weak' ? 'active' : ''}`}>Weak</span>
                      <span className={`signup-strength-label ${passwordStrength === 'medium' ? 'active' : ''}`}>Medium</span>
                      <span className={`signup-strength-label ${passwordStrength === 'strong' ? 'active' : ''}`}>Strong</span>
                    </div>
                    <div className="signup-strength-text">
                      <i className={`fa-solid ${passwordStrength === 'weak' ? 'fa-exclamation-triangle' : passwordStrength === 'medium' ? 'fa-check-circle' : 'fa-shield-check'}`}></i>
                      <span className={`signup-strength-value ${passwordStrength}`}>
                        {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)} Password
                      </span>
                    </div>
                  </div>
                )}

                <div className="signup-password-hints">
                  <p><i className="fa-solid fa-info-circle"></i> Password must include:</p>
                  <ul>
                    <li className={formData.password.length >= 6 ? 'valid' : ''}>
                      <i className={formData.password.length >= 6 ? 'fa-solid fa-check' : 'fa-solid fa-circle'}></i>
                      At least 6 characters
                    </li>
                    <li className={/[A-Z]/.test(formData.password) ? 'valid' : ''}>
                      <i className={/[A-Z]/.test(formData.password) ? 'fa-solid fa-check' : 'fa-solid fa-circle'}></i>
                      One uppercase letter
                    </li>
                    <li className={/[0-9]/.test(formData.password) ? 'valid' : ''}>
                      <i className={/[0-9]/.test(formData.password) ? 'fa-solid fa-check' : 'fa-solid fa-circle'}></i>
                      One number
                    </li>
                  </ul>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="signup-submit-button"
              >
                {loading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    Creating Your Account...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-user-plus"></i>
                    Create Account
                  </>
                )}
              </button>

              <div className="signup-terms-agreement">
                <div className="signup-terms-checkbox">
                  <input type="checkbox" id="terms" required />
                  <label htmlFor="terms">
                    I agree to the <Link to="/terms" className="signup-terms-link">Terms of Service</Link> and <Link to="/privacy" className="signup-terms-link">Privacy Policy</Link>
                  </label>
                </div>
              </div>

              <div className="signup-login-section">
                <div className="signup-divider">
                  <span>Already have an account?</span>
                </div>
                <Link to="/login" className="signup-login-link">
                  <i className="fa-solid fa-sign-in-alt"></i>
                  Sign In to Your Account
                </Link>
              </div>
            </form>

            {/* Benefits Sidebar */}
            <div className="signup-benefits-sidebar">
              <div className="signup-benefits-header">
                <i className="fa-solid fa-gift"></i>
                <h3>Sign Up Benefits</h3>
              </div>
              
              <div className="signup-benefits-list">
                <div className="signup-benefit-item">
                  <div className="signup-benefit-icon">
                    <i className="fa-solid fa-percent"></i>
                  </div>
                  <div className="signup-benefit-content">
                    <h4>Exclusive Discounts</h4>
                    <p>Get 15% off your first order</p>
                  </div>
                </div>
                
                <div className="signup-benefit-item">
                  <div className="signup-benefit-icon">
                    <i className="fa-solid fa-star"></i>
                  </div>
                  <div className="signup-benefit-content">
                    <h4>Reward Points</h4>
                    <p>Earn points on every purchase</p>
                  </div>
                </div>
                
                <div className="signup-benefit-item">
                  <div className="signup-benefit-icon">
                    <i className="fa-solid fa-clock"></i>
                  </div>
                  <div className="signup-benefit-content">
                    <h4>Priority Service</h4>
                    <p>Faster order processing</p>
                  </div>
                </div>
                
                <div className="signup-benefit-item">
                  <div className="signup-benefit-icon">
                    <i className="fa-solid fa-bell"></i>
                  </div>
                  <div className="signup-benefit-content">
                    <h4>Personalized Alerts</h4>
                    <p>Customized food recommendations</p>
                  </div>
                </div>
              </div>
              
              <div className="signup-security-note">
                <i className="fa-solid fa-shield-alt"></i>
                <div>
                  <h4>100% Secure</h4>
                  <p>Your data is encrypted and protected</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Signup;
