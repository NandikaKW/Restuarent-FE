import React, { useState, useEffect } from 'react';
import { paymentService } from '../../services/paymentService';
import { format } from 'date-fns';
import "../../components/componentStyles/PaymentManagement.css";


interface OrderInfo {
  _id?: string;
  totalPrice?: number;
  status?: string;
}

interface UserInfo {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface Payment {
  _id: string;
  orderId: OrderInfo | string;
  userId: UserInfo | string;
  amount: number;
  paymentMethod: 'card' | 'paypal' | 'cash';
  status: 'pending' | 'success' | 'failed';
  createdAt: string;
  paymentDate?: string;
}

const PaymentManagement: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newStatus, setNewStatus] = useState<'pending' | 'success' | 'failed'>('pending');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await paymentService.getAllPayments();

      if (Array.isArray(response)) {
        setPayments(response);
      } else {
        setPayments(response?.data || []);
      }
    } catch (err: any) {
      console.error('Error fetching payments:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const getUserInfo = (payment: Payment) => {
    if (typeof payment.userId === 'object' && payment.userId !== null) {
      const user = payment.userId as UserInfo;
      return {
        firstName: user.firstName || 'Unknown',
        lastName: user.lastName || 'User',
        email: user.email || 'unknown@example.com'
      };
    }
    return {
      firstName: 'Unknown',
      lastName: 'User',
      email: 'unknown@example.com'
    };
  };

  const getOrderInfo = (payment: Payment) => {
    if (typeof payment.orderId === 'object' && payment.orderId !== null) {
      const order = payment.orderId as OrderInfo;
      return {
        _id: order._id || 'N/A',
        totalPrice: order.totalPrice || payment.amount,
        status: order.status || 'unknown'
      };
    }
    return {
      _id: typeof payment.orderId === 'string' ? payment.orderId.slice(-8) : 'N/A',
      totalPrice: payment.amount,
      status: 'unknown'
    };
  };

  const handleStatusUpdate = async (paymentId: string) => {
    try {
      await paymentService.updatePaymentStatus(paymentId, { status: newStatus });
      setShowUpdateModal(false);
      setSelectedPayment(null);
      fetchPayments();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to update payment status');
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'success':
        return 'pm-status-success';
      case 'failed':
        return 'pm-status-failed';
      case 'pending':
        return 'pm-status-pending';
      default:
        return 'pm-status-unknown';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method?.toLowerCase()) {
      case 'card':
        return 'fa-credit-card';
      case 'paypal':
        return 'fa-paypal';
      case 'cash':
        return 'fa-money-bill-wave';
      default:
        return 'fa-wallet';
    }
  };

  const handleViewDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setNewStatus(payment.status);
    setShowUpdateModal(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusCount = (status: string) => {
    return payments.filter(payment => payment.status === status).length;
  };

  const filteredPayments = payments.filter(payment => {
    const userInfo = getUserInfo(payment);
    const fullName = `${userInfo.firstName} ${userInfo.lastName}`.toLowerCase();
    const email = userInfo.email.toLowerCase();

    const matchesFilter = filter === 'all' || payment.status === filter;

    const matchesSearch = search === '' ||
      fullName.includes(search.toLowerCase()) ||
      email.includes(search.toLowerCase()) ||
      payment._id.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const successRevenue = payments
    .filter(p => p.status === 'success')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="payment-management-page">
      {/* Header Section */}
      <div className="pm-header">
        <h2>Payment Management</h2>
        <p>Manage all payment transactions and revenue tracking</p>
      </div>

      {/* Stats Cards */}
      <div className="pm-stats">
        <div className="pm-stat-card">
          <div className="pm-stat-icon">
            <i className="fas fa-money-check-alt"></i>
          </div>
          <div className="pm-stat-content">
            <h3>{payments.length}</h3>
            <p>Total Payments</p>
          </div>
        </div>

        <div className="pm-stat-card">
          <div className="pm-stat-icon">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="pm-stat-content">
            <h3>{formatCurrency(totalRevenue)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>

        <div className="pm-stat-card">
          <div className="pm-stat-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="pm-stat-content">
            <h3>{formatCurrency(successRevenue)}</h3>
            <p>Successful Revenue</p>
          </div>
        </div>

        <div className="pm-stat-card">
          <div className="pm-stat-icon">
            <i className="fas fa-percentage"></i>
          </div>
          <div className="pm-stat-content">
            <h3>
              {payments.length > 0
                ? `${Math.round((getStatusCount('success') / payments.length) * 100)}%`
                : '0%'
              }
            </h3>
            <p>Success Rate</p>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="pm-controls">
        <div className="pm-search">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search by customer name, email, or payment ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="pm-filters">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pm-filter-select"
          >
            <option value="all">All Payments</option>
            <option value="success">Successful</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="pm-error">
          <i className="fas fa-exclamation-circle"></i>
          <span>Error: {error}</span>
          <button
            onClick={fetchPayments}
            className="pm-retry-btn"
          >
            <i className="fas fa-redo"></i>
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="pm-loading">
          <div className="pm-loading-spinner"></div>
          <p className="pm-loading-text">Loading payments...</p>
        </div>
      ) : filteredPayments.length === 0 ? (
        /* Empty State */
        <div className="pm-empty">
          <div className="pm-empty-icon">
            <i className="fas fa-receipt"></i>
          </div>
          <h3>No Payments Found</h3>
          <p>
            {filter !== 'all'
              ? `No ${filter} payments found matching your search criteria.`
              : "No payments found matching your search criteria."
            }
          </p>
        </div>
      ) : (
        /* Table Container */
        <div className="pm-table-wrapper">
          <div className="pm-table-container">
            <table className="pm-table">
              <thead>
                <tr>
                  <th className="pm-th-id">Payment ID</th>
                  <th className="pm-th-customer">Customer</th>
                  <th className="pm-th-order">Order ID</th>
                  <th className="pm-th-amount">Amount</th>
                  <th className="pm-th-method">Method</th>
                  <th className="pm-th-status">Status</th>
                  <th className="pm-th-date">Date & Time</th>
                  <th className="pm-th-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => {
                  const userInfo = getUserInfo(payment);
                  const orderInfo = getOrderInfo(payment);

                  return (
                    <tr key={payment._id}>
                      {/* Payment ID Column */}
                      <td className="pm-td-id">
                        <div className="pm-id-value">
                          #{payment._id.slice(-8)}
                        </div>
                      </td>

                      {/* Customer Column */}
                      <td className="pm-td-customer">
                        <div className="pm-customer-name">
                          {userInfo.firstName} {userInfo.lastName}
                        </div>
                        <div className="pm-customer-email">
                          <i className="fas fa-envelope"></i>
                          {userInfo.email}
                        </div>
                      </td>

                      {/* Order ID Column */}
                      <td className="pm-td-order">
                        <div className="pm-order-value">
                          #{typeof orderInfo._id === 'string' ? orderInfo._id.slice(-8) : 'N/A'}
                        </div>
                      </td>

                      {/* Amount Column */}
                      <td className="pm-td-amount">
                        <div className="pm-amount-value">
                          {formatCurrency(payment.amount)}
                        </div>
                      </td>

                      {/* Method Column */}
                      <td className="pm-td-method">
                        <div className="pm-method-badge">
                          <i className={`fas ${getPaymentMethodIcon(payment.paymentMethod)}`}></i>
                          <span>{payment.paymentMethod.charAt(0).toUpperCase() + payment.paymentMethod.slice(1)}</span>
                        </div>
                      </td>

                      {/* Status Column */}
                      <td className="pm-td-status">
                        <div className={`pm-status-badge ${getStatusBadgeClass(payment.status)}`}>
                          <i className="fas fa-circle"></i>
                          <span>{payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}</span>
                        </div>
                      </td>

                      {/* Date & Time Column */}
                      <td className="pm-td-datetime">
                        <div className="pm-date-display">
                          {format(new Date(payment.createdAt), 'MMM dd, yyyy')}
                        </div>
                        <div className="pm-time-display">
                          <i className="far fa-clock"></i>
                          {format(new Date(payment.createdAt), 'HH:mm')}
                        </div>
                      </td>

                      {/* Actions Column */}
                      <td className="pm-td-actions">
                        <button
                          onClick={() => handleViewDetails(payment)}
                          className="pm-view-details-btn"
                        >
                          <i className="fas fa-edit"></i>
                          <span>Update</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Footer Stats */}
      {!loading && filteredPayments.length > 0 && (
        <div className="pm-footer">
          <div className="pm-footer-stats">
            Showing <strong>{filteredPayments.length}</strong> of <strong>{payments.length}</strong> payments
          </div>
          <div className="pm-footer-filter">
            {filter === 'all'
              ? 'All Payments'
              : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Payments`
            }
          </div>
          <div className="pm-footer-revenue">
            Total Revenue: <strong>{formatCurrency(totalRevenue)}</strong>
          </div>
        </div>
      )}

      {/* Compact Update Status Modal - FIXED */}
      {showUpdateModal && selectedPayment && (
        <div className="pm-modal-overlay">
          <div className="pm-modal">
            {/* Modal Header - FIXED */}
            <div className="pm-modal-header">
              <div className="pm-modal-header-main">
                <div className="pm-modal-icon">
                  <i className={`fas ${getPaymentMethodIcon(selectedPayment.paymentMethod)}`}></i>
                </div>
                <div>
                  <h3>Update Payment Status</h3>
                  <p className="pm-modal-subtitle">Payment ID: #{selectedPayment._id?.slice(-8) || selectedPayment._id}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowUpdateModal(false);
                  setSelectedPayment(null);
                }}
                className="pm-modal-close"
                aria-label="Close modal"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Modal Body - Compact Layout */}
            <div className="pm-modal-body">
              {/* Payment Details Row */}
              <div className="pm-details-row">
                <div className="pm-detail-item">
                  <div className="pm-detail-label">
                    <i className="fas fa-user"></i>
                    Customer
                  </div>
                  <div className="pm-detail-value">
                    {(() => {
                      const userInfo = getUserInfo(selectedPayment);
                      return userInfo.firstName && userInfo.lastName 
                        ? `${userInfo.firstName} ${userInfo.lastName}`
                        : 'Unknown User';
                    })()}
                  </div>
                </div>

                <div className="pm-detail-item">
                  <div className="pm-detail-label">
                    <i className="fas fa-dollar-sign"></i>
                    Amount
                  </div>
                  <div className="pm-detail-value amount">
                    {formatCurrency(selectedPayment.amount)}
                  </div>
                </div>

                <div className="pm-detail-item">
                  <div className="pm-detail-label">
                    <i className="fas fa-calendar"></i>
                    Date
                  </div>
                  <div className="pm-detail-value">
                    {format(new Date(selectedPayment.createdAt), 'MM/dd/yyyy')}
                  </div>
                </div>

                <div className="pm-detail-item">
                  <div className="pm-detail-label">
                    <i className="fas fa-wallet"></i>
                    Method
                  </div>
                  <div className="pm-detail-value">
                    <div className={`pm-method-tag ${selectedPayment.paymentMethod}`}>
                      <i className={`fas ${getPaymentMethodIcon(selectedPayment.paymentMethod || 'card')}`}></i>
                      {selectedPayment.paymentMethod 
                        ? selectedPayment.paymentMethod.charAt(0).toUpperCase() + selectedPayment.paymentMethod.slice(1)
                        : 'Unknown'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Status */}
              <div className="pm-current-status-row">
                <div className="pm-status-label">
                  <i className="fas fa-info-circle"></i>
                  Current Status
                </div>
                <div className={`pm-current-status ${getStatusBadgeClass(selectedPayment.status)}`}>
                  <div className="pm-status-indicator">
                    {selectedPayment.status === 'success' && <i className="fas fa-check-circle"></i>}
                    {selectedPayment.status === 'pending' && <i className="fas fa-clock"></i>}
                    {selectedPayment.status === 'failed' && <i className="fas fa-times-circle"></i>}
                  </div>
                  <span className="pm-status-text">
                    {selectedPayment.status.charAt(0).toUpperCase() + selectedPayment.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Update Status Section */}
              <div className="pm-update-section">
                <div className="pm-update-title">
                  <i className="fas fa-sync-alt"></i>
                  Select New Status
                </div>
                <div className="pm-status-buttons">
                  {(['pending', 'success', 'failed'] as const).map((status) => (
                    <button
                      key={status}
                      className={`pm-status-option ${status} ${newStatus === status ? 'selected' : ''}`}
                      onClick={() => setNewStatus(status)}
                      type="button"
                    >
                      <div className="pm-option-icon">
                        {status === 'success' && <i className="fas fa-check-circle"></i>}
                        {status === 'pending' && <i className="fas fa-clock"></i>}
                        {status === 'failed' && <i className="fas fa-times-circle"></i>}
                      </div>
                      <span className="pm-option-label">
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                      {newStatus === status && (
                        <div className="pm-selected-check">
                          <i className="fas fa-check"></i>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pm-modal-footer">
              <div className="pm-footer-buttons">
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="pm-cancel-btn"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedPayment._id)}
                  className="pm-update-btn"
                  type="button"
                >
                  <i className="fas fa-check"></i>
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentManagement;