import React, { useState, useEffect } from 'react';
import { useBooking } from '../contexts/BookingContext';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { startLoading, stopLoading, setMessage, clearMessage } from '../store/uiSlice';
import type { RootState } from '../store';
import '../components/componentStyles/Booking.css';

const Booking: React.FC = () => {
  const { user } = useAuth();
  const { bookings, loading, error, createBooking, fetchUserBookings, cancelBooking } = useBooking();
  const [showForm, setShowForm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);
  const dispatch = useDispatch();
  const uiLoading = useSelector((state: RootState) => state.ui.loading);
  const uiMessage = useSelector((state: RootState) => state.ui.message);

  const [formData, setFormData] = useState({
    name: user ? `${user.firstName} ${user.lastName}` : '',
    email: user?.email || '',
    phone: '',
    date: '',
    time: '',
    guests: 2,
    message: '',
  });

  useEffect(() => {
    if (user) {
      fetchUserBookings();
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guests' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearMessage());
    dispatch(startLoading());

    await new Promise(res => setTimeout(res, 800));

    const result = await createBooking(formData);

    if (result.success) {
      dispatch(setMessage('Booking created successfully! We will get back to you soon.'));

      setFormData({
        name: user ? `${user.firstName} ${user.lastName}` : '',
        email: user?.email || '',
        phone: '',
        date: '',
        time: '',
        guests: 2,
        message: '',
      });

      setTimeout(() => {
        setShowForm(false);
      }, 1000);

    } else {
      dispatch(setMessage(result.message || 'Failed to create booking. Please try again.'));
    }

    dispatch(stopLoading());

    setTimeout(() => {
      dispatch(clearMessage());
    }, 4000);
  };

  const handleCancelClick = (id: string) => {
    setBookingToCancel(id);
    setShowCancelConfirm(true);
  };

  const handleConfirmCancel = async () => {
    if (bookingToCancel) {
      dispatch(startLoading());
      dispatch(setMessage('Cancelling booking...'));

      await cancelBooking(bookingToCancel);

      dispatch(setMessage('Booking cancelled successfully'));
      setShowCancelConfirm(false);
      setBookingToCancel(null);

      dispatch(stopLoading());

      setTimeout(() => {
        dispatch(clearMessage());
      }, 3000);
    }
  };

  const handleCancelConfirm = () => {
    setShowCancelConfirm(false);
    setBookingToCancel(null);
  };

  const handleRetry = () => {
    if (user) {
      fetchUserBookings();
    }
  };

  const timeSlots = [
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
  ];

  const getMessageType = (message: string): 'success' | 'error' | 'info' => {
    if (message.includes('successfully')) return 'success';
    if (message.includes('Error') || message.includes('Failed')) return 'error';
    return 'info';
  };

  return (
    <div className="booking-container">
      {/* Cancel Confirmation Alert */}
      {showCancelConfirm && (
        <div className="booking-alert-overlay">
          <div className="booking-alert-container">
            <div className="booking-alert-icon">
              <i className="fa-solid fa-leaf"></i>
            </div>
            <h3 className="booking-alert-title">Cancel Reservation</h3>
            <p className="booking-alert-message">Are you sure you want to cancel this reservation? This action cannot be undone.</p>
            <div className="booking-alert-buttons">
              <button
                onClick={handleCancelConfirm}
                className="booking-alert-btn booking-alert-btn-secondary"
              >
                Keep Reservation
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={uiLoading}
                className="booking-alert-btn booking-alert-btn-primary"
              >
                {uiLoading ? (
                  <>
                    <span className="booking-alert-spinner"></span>
                    Cancelling...
                  </>
                ) : (
                  'Yes, Cancel It'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="booking-hero">
        <div className="booking-hero-content">
          <div className="booking-hero-text">
            <h1>Table Reservations</h1>
            <p>Secure your spot for an unforgettable dining experience</p>
          </div>
        </div>
      </section>

      <div className="booking-wrapper">
        <main className="booking-main">
          {/* Booking Alert Message */}
          {uiMessage && (
            <div className={`booking-alert-message-container booking-alert-${getMessageType(uiMessage)}`}>
              <div className="booking-alert-message-content">
                <div className="booking-alert-message-icon">
                  {getMessageType(uiMessage) === 'success' && <i className="fas fa-check-circle"></i>}
                  {getMessageType(uiMessage) === 'error' && <i className="fas fa-exclamation-circle"></i>}
                  {getMessageType(uiMessage) === 'info' && <i className="fa-solid fa-leaf"></i>}
                </div>

                <div className="booking-alert-message-text">
                  <p>{uiMessage}</p>
                </div>

                <button
                  className="booking-alert-message-close"
                  onClick={() => dispatch(clearMessage())}
                  aria-label="Close alert"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="booking-alert-message-progress"></div>
            </div>
          )}

          {/* Header */}
          <div className="booking-header">
            <div className="booking-heading-two">
              <h2>Manage Your Bookings</h2>
              <div className="booking-line"></div>
            </div>
            <div className="booking-stats-summary">
              <div className="booking-stat-item">
                <i className="fa-solid fa-calendar-check"></i>
                <div>
                  <h3>{bookings.length}</h3>
                  <p>Active Bookings</p>
                </div>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="booking-new-btn"
              >
                <i className="fa-solid fa-plus"></i>
                {showForm ? 'Hide Form' : 'New Booking'}
              </button>
            </div>
          </div>

          {/* Booking Form */}
          {showForm && (
            <div className="booking-form-section">
              <div className="booking-form-container">
                <div className="booking-form-header">
                  <i className="fa-solid fa-calendar-plus"></i>
                  <h3>Make a Reservation</h3>
                </div>

                {error && (
                  <div className="booking-error">
                    <i className="fas fa-exclamation-circle"></i>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="booking-form">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        disabled={uiLoading}
                      />
                    </div>

                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        disabled={uiLoading}
                      />
                    </div>

                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        disabled={uiLoading}
                        placeholder="+1 (123) 456-7890"
                      />
                    </div>

                    <div className="form-group">
                      <label>Number of Guests</label>
                      <select
                        name="guests"
                        value={formData.guests}
                        onChange={handleInputChange}
                        required
                        disabled={uiLoading}
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'Guest' : 'Guests'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Date</label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                        disabled={uiLoading}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div className="form-group">
                      <label>Time</label>
                      <select
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        required
                        disabled={uiLoading}
                      >
                        <option value="">Select a time</option>
                        {timeSlots.map(time => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <label>Special Requests (Optional)</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Any special requirements or requests..."
                      disabled={uiLoading}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || uiLoading}
                    className="booking-submit-btn"
                  >
                    {uiLoading ? (
                      <>
                        <span className="booking-loading-spinner-btn"></span>
                        Processing...
                      </>
                    ) : loading ? 'Booking...' : 'Confirm Reservation'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* My Bookings Section */}
          <div className="bookings-section">
            {!user ? (
              <div className="booking-login-prompt">
                <div className="booking-login-icon">
                  <i className="fa-solid fa-user-circle"></i>
                </div>
                <h3 className="booking-login-title">Sign In Required</h3>
                <p className="booking-login-text">Please log in to view and manage your bookings</p>
              </div>
            ) : loading ? (
              <div className="booking-loading">
                <div className="booking-loading-spinner">
                  <i className="fa-solid fa-utensils fa-spin"></i>
                </div>
                <p className="booking-loading-text">Loading your bookings...</p>
              </div>
            ) : error ? (
              <div className="booking-error-state">
                <div className="booking-error-icon">
                  <i className="fa-solid fa-exclamation-triangle"></i>
                </div>
                <h3 className="booking-error-title">Something Went Wrong</h3>
                <p className="booking-error-message">{error}</p>
                <button
                  onClick={handleRetry}
                  className="booking-retry-btn"
                >
                  <i className="fa-solid fa-rotate-right"></i>
                  Try Again
                </button>
              </div>
            ) : bookings.length === 0 ? (
              <div className="booking-empty-state">
                <div className="booking-empty-icon">
                  <i className="fa-solid fa-calendar-alt"></i>
                </div>
                <h3 className="booking-empty-title">No Upcoming Bookings</h3>
                <p className="booking-empty-text">
                  You have no upcoming reservations. Book a table to enjoy our culinary experience!
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="booking-empty-btn"
                >
                  <i className="fa-solid fa-plus"></i>
                  Make Your First Booking
                </button>
              </div>
            ) : (
              <div className="bookings-grid">
                {bookings.map((booking) => (
                  <div key={booking._id} className="booking-card">
                    {/* Booking Header */}
                    <div className="booking-card-header">
                      <div className="booking-id-section">
                        <div className="booking-id-badge">
                          <i className="fa-solid fa-hashtag"></i>
                          Reservation #{booking._id?.slice(-6)}
                        </div>
                        <div className="booking-date">
                          <i className="fa-solid fa-calendar-days"></i>
                          {format(new Date(booking.date), 'MMM dd, yyyy')}
                        </div>
                      </div>

                      <div className="booking-status-section">
                        <div className="booking-guests">
                          <i className="fa-solid fa-user-friends"></i>
                          {booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}
                        </div>
                        <div className="booking-status-badge booking-status-confirmed">
                          <i className="fa-solid fa-check-circle"></i>
                          Confirmed
                        </div>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="booking-details-section">
                      <div className="booking-time-info">
                        <div className="booking-time-item">
                          <i className="fa-solid fa-clock"></i>
                          <div>
                            <span className="time-label">Reservation Time</span>
                            <span className="time-value">{booking.time}</span>
                          </div>
                        </div>
                        <div className="booking-contact-info">
                          <div className="contact-email">
                            <i className="fa-solid fa-envelope"></i>
                            {booking.email}
                          </div>
                          <div className="contact-phone">
                            <i className="fa-solid fa-phone"></i>
                            {booking.phone}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Special Requests */}
                    {booking.message && (
                      <div className="booking-requests-section">
                        <div className="requests-header">
                          <i className="fa-solid fa-comment-dots"></i>
                          <h4>Special Requests</h4>
                        </div>
                        <p className="requests-text">{booking.message}</p>
                      </div>
                    )}

                    {/* Booking Footer */}
                    <div className="booking-card-footer">
                      <button
                        onClick={() => handleCancelClick(booking._id)}
                        disabled={uiLoading}
                        className="booking-cancel-btn"
                      >
                        <i className="fa-solid fa-times"></i> Cancel Reservation
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Restaurant Information */}
          <div className="booking-info-section">
            <div className="booking-info-header">
              <i className="fa-solid fa-circle-info"></i>
              <h3>Restaurant Information</h3>
            </div>
            <div className="booking-info-grid">
              <div className="booking-info-card">
                <div className="info-icon">
                  <i className="fa-solid fa-clock"></i>
                </div>
                <div className="info-content">
                  <h4>Operating Hours</h4>
                  <p>Tuesday - Saturday: 12:00 PM - 11:00 PM</p>
                  <p>Sunday: Closed</p>
                  <p>Monday: Special Events Only</p>
                </div>
              </div>
              <div className="booking-info-card">
                <div className="info-icon">
                  <i className="fa-solid fa-utensils"></i>
                </div>
                <div className="info-content">
                  <h4>Dining Tips</h4>
                  <p>• Arrive 10 minutes before your reservation</p>
                  <p>• Special requests are accommodated when possible</p>
                  <p>• 24-hour cancellation policy applies</p>
                </div>
              </div>
              <div className="booking-info-card">
                <div className="info-icon">
                  <i className="fa-solid fa-headset"></i>
                </div>
                <div className="info-content">
                  <h4>Need Assistance?</h4>
                  <p>Contact our reservation team for any booking-related questions or special arrangements.</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Booking;