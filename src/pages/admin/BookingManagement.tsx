import React, { useEffect, useState } from 'react';
import { useBooking } from '../../contexts/BookingContext';
import { format, isToday, isPast, isFuture } from 'date-fns';
import "../../components/componentStyles/AdminBookingManagement.css"; 

interface Booking {
  _id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  message?: string;
  status?: string;
  createdAt?: string;
}

const BookingManagement: React.FC = () => {
  const { bookings, loading, error, fetchAllBookings, cancelBooking } = useBooking();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    upcoming: 0,
    past: 0
  });

  useEffect(() => {
    fetchAllBookings();
  }, []);

  useEffect(() => {
    if (bookings.length > 0) {
      const statsData = {
        total: bookings.length,
        today: bookings.filter(b => isToday(new Date(b.date))).length,
        upcoming: bookings.filter(b => isFuture(new Date(b.date))).length,
        past: bookings.filter(b => isPast(new Date(b.date))).length
      };
      setStats(statsData);
    }
  }, [bookings]);

  const handleCancel = async (id: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      await cancelBooking(id);
      setShowCancelModal(false);
      setSelectedBooking(null);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.date);
    const searchTerm = search.toLowerCase();
    
    const matchesFilter = filter === 'all' || 
      (filter === 'today' && isToday(bookingDate)) ||
      (filter === 'upcoming' && isFuture(bookingDate)) ||
      (filter === 'past' && isPast(bookingDate));
    
    const matchesSearch = search === '' ||
      booking.name.toLowerCase().includes(searchTerm) ||
      booking.email.toLowerCase().includes(searchTerm) ||
      booking.phone.includes(search);
    
    return matchesFilter && matchesSearch;
  });

  const getStatus = (booking: Booking) => {
    if (isPast(new Date(booking.date))) return 'Completed';
    return 'Confirmed';
  };

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  };

  return (
    <div className="booking-management-page">
      {/* Header */}
      <div className="bk-header">
        <h2>Booking Management</h2>
        <p>Manage all table reservations</p>
      </div>

      {/* Stats */}
      <div className="bk-stats">
        <div className="bk-stat-card">
          <div className="bk-stat-icon">
            <i className="fas fa-calendar-alt"></i>
          </div>
          <div className="bk-stat-content">
            <h3>{stats.total}</h3>
            <p>Total Bookings</p>
          </div>
        </div>

        <div className="bk-stat-card">
          <div className="bk-stat-icon">
            <i className="fas fa-calendar-day"></i>
          </div>
          <div className="bk-stat-content">
            <h3>{stats.today}</h3>
            <p>Today</p>
          </div>
        </div>

        <div className="bk-stat-card">
          <div className="bk-stat-icon">
            <i className="fas fa-calendar-check"></i>
          </div>
          <div className="bk-stat-content">
            <h3>{stats.upcoming}</h3>
            <p>Upcoming</p>
          </div>
        </div>

        <div className="bk-stat-card">
          <div className="bk-stat-icon">
            <i className="fas fa-history"></i>
          </div>
          <div className="bk-stat-content">
            <h3>{stats.past}</h3>
            <p>Completed</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bk-controls">
        <div className="bk-search">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bk-filter-select"
        >
          <option value="all">All Bookings</option>
          <option value="today">Today</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Completed</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="bk-error">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error}</span>
          <button onClick={fetchAllBookings} className="bk-retry-btn">
            Retry
          </button>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="bk-loading">
          <div className="bk-loading-spinner"></div>
          <p>Loading bookings...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bk-empty">
          <i className="fas fa-calendar-times"></i>
          <h3>No Bookings Found</h3>
          <p>No bookings found matching your search criteria.</p>
        </div>
      ) : (
        <div className="bk-table-wrapper">
          <table className="bk-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Date & Time</th>
                <th>Details</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => {
                const status = getStatus(booking);
                const isCompleted = status === 'Completed';
                
                return (
                  <tr key={booking._id} className={isCompleted ? 'bk-completed' : ''}>
                    <td>
                      <div className="bk-customer-name">{booking.name}</div>
                      <div className="bk-customer-email">{booking.email}</div>
                      <div className="bk-customer-phone">{formatPhoneNumber(booking.phone)}</div>
                    </td>
                    
                    <td>
                      <div>{format(new Date(booking.date), 'MMM dd, yyyy')}</div>
                      <div>{booking.time}</div>
                    </td>
                    
                    <td>
                      <div>{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</div>
                      {booking.message && (
                        <div className="bk-message">{booking.message.substring(0, 30)}...</div>
                      )}
                    </td>
                    
                    <td>
                      <div className={`bk-status ${isCompleted ? 'bk-status-completed' : 'bk-status-confirmed'}`}>
                        {status}
                      </div>
                    </td>
                    
                    <td>
                      <div className="bk-actions">
                        <button 
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowDetailsModal(true);
                          }}
                          className="bk-view-btn"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        {!isCompleted && (
                          <button 
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowCancelModal(true);
                            }}
                            className="bk-cancel-btn"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      {!loading && filteredBookings.length > 0 && (
        <div className="bk-footer">
          <div>Showing {filteredBookings.length} of {bookings.length} bookings</div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="bk-modal-overlay">
          <div className="bk-modal">
            <div className="bk-modal-header">
              <h3>Booking Details</h3>
              <button onClick={() => setShowDetailsModal(false)} className="bk-modal-close">
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="bk-modal-body">
              <div className="bk-modal-section">
                <h4>Customer Information</h4>
                <div className="bk-modal-row">
                  <div><strong>Name:</strong> {selectedBooking.name}</div>
                  <div><strong>Email:</strong> {selectedBooking.email}</div>
                  <div><strong>Phone:</strong> {formatPhoneNumber(selectedBooking.phone)}</div>
                </div>
              </div>
              
              <div className="bk-modal-section">
                <h4>Booking Details</h4>
                <div className="bk-modal-row">
                  <div><strong>Date:</strong> {format(new Date(selectedBooking.date), 'MMM dd, yyyy')}</div>
                  <div><strong>Time:</strong> {selectedBooking.time}</div>
                  <div><strong>Guests:</strong> {selectedBooking.guests}</div>
                </div>
              </div>
              
              {selectedBooking.message && (
                <div className="bk-modal-section">
                  <h4>Special Request</h4>
                  <p>{selectedBooking.message}</p>
                </div>
              )}
            </div>
            
            <div className="bk-modal-footer">
              <button onClick={() => setShowDetailsModal(false)} className="bk-close-btn">
                Close
              </button>
              {!isPast(new Date(selectedBooking.date)) && (
                <button 
                  onClick={() => {
                    setShowDetailsModal(false);
                    setShowCancelModal(true);
                  }}
                  className="bk-cancel-action-btn"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && selectedBooking && (
        <div className="bk-modal-overlay">
          <div className="bk-modal">
            <div className="bk-modal-header bk-cancel-header">
              <h3>Cancel Booking</h3>
              <button onClick={() => setShowCancelModal(false)} className="bk-modal-close">
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="bk-modal-body">
              <div className="bk-cancel-warning">
                <i className="fas fa-exclamation-triangle"></i>
                <p>Are you sure you want to cancel this booking?</p>
              </div>
              
              <div className="bk-cancel-details">
                <div><strong>Customer:</strong> {selectedBooking.name}</div>
                <div><strong>Date:</strong> {format(new Date(selectedBooking.date), 'MMM dd, yyyy')}</div>
                <div><strong>Time:</strong> {selectedBooking.time}</div>
                <div><strong>Guests:</strong> {selectedBooking.guests}</div>
              </div>
            </div>
            
            <div className="bk-modal-footer">
              <button onClick={() => setShowCancelModal(false)} className="bk-keep-btn">
                Keep Booking
              </button>
              <button onClick={() => handleCancel(selectedBooking._id)} className="bk-confirm-cancel-btn">
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;