import { useState, useEffect } from 'react';
import { adminOrderService } from '../../services/adminOrderService';
import type { Order, OrderUser, PaymentInfo } from '../../types/admin';
import "../../components/componentStyles/AdminOrderManagement.css";

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPayment, setFilterPayment] = useState<string>("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    setError(null);
    try {
      const ordersData = await adminOrderService.getAllOrders();
      setOrders(ordersData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      if (showLoading) {
        setLoading(false);
      } else {
        setRefreshing(false);
      }
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await adminOrderService.updateOrderStatus(orderId, newStatus);
      await fetchOrders(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update order status');
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'om-status-success';
      case 'preparing': return 'om-status-preparing';
      case 'pending': return 'om-status-pending';
      case 'cancelled': return 'om-status-cancelled';
      default: return 'om-status-unknown';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'om-payment-success';
      case 'pending': return 'om-payment-pending';
      case 'failed': return 'om-payment-failed';
      default: return 'om-payment-unknown';
    }
  };

  const getOrderDisplayId = (order: Order) => {
    return order._id ? `#${order._id.slice(-6).toUpperCase()}` : '#------';
  };

  const getUserInfo = (order: Order) => {
    if (order.userId && typeof order.userId === 'object') {
      const user = order.userId as OrderUser;
      return {
        firstName: user.firstName || 'Unknown',
        lastName: user.lastName || 'User',
        email: user.email || 'No email available'
      };
    }
    
    if (typeof order.userId === 'string') {
      return {
        firstName: 'User ID:',
        lastName: order.userId.slice(-4),
        email: 'Not populated'
      };
    }
    
    return {
      firstName: 'Unknown',
      lastName: 'User',
      email: 'No information available'
    };
  };

  const getPaymentInfo = (order: Order) => {
    if (order.paymentId && typeof order.paymentId === 'object') {
      const payment = order.paymentId as PaymentInfo;
      return {
        status: payment.status || 'pending',
        method: payment.paymentMethod || 'unknown',
        amount: payment.amount || order.totalPrice,
        date: payment.paymentDate || null,
        id: payment._id ? payment._id.slice(-6) : 'N/A'
      };
    }
    
    if (typeof order.paymentId === 'string') {
      return {
        status: 'pending',
        method: 'Not linked',
        amount: order.totalPrice,
        date: null,
        id: order.paymentId.slice(-6)
      };
    }
    
    return {
      status: 'not_found',
      method: 'Not available',
      amount: order.totalPrice,
      date: null,
      id: 'N/A'
    };
  };

  const formatPaymentMethod = (method: string) => {
    switch (method?.toLowerCase()) {
      case 'card': return '💳 Card';
      case 'paypal': return '🅿️ PayPal';
      case 'cash': return '💵 Cash';
      default: return `📋 ${method}`;
    }
  };

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const filteredOrders = orders.filter(order => {
    const paymentInfo = getPaymentInfo(order);
    
    const matchesSearch = 
      search === "" ||
      getOrderDisplayId(order).toLowerCase().includes(search.toLowerCase()) ||
      order.items?.some(item => 
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    
    const matchesOrderStatus = 
      filterStatus === "all" || 
      order.status === filterStatus;
    
    const matchesPaymentStatus = 
      filterPayment === "all" || 
      paymentInfo.status === filterPayment;
    
    return matchesSearch && matchesOrderStatus && matchesPaymentStatus;
  });

  const paymentSummary = {
    total: orders.length,
    paid: orders.filter(order => {
      const payment = getPaymentInfo(order);
      return payment.status === 'success';
    }).length,
    pending: orders.filter(order => {
      const payment = getPaymentInfo(order);
      return payment.status === 'pending';
    }).length,
    failed: orders.filter(order => {
      const payment = getPaymentInfo(order);
      return payment.status === 'failed';
    }).length,
    revenue: orders.reduce((sum, order) => {
      const payment = getPaymentInfo(order);
      return payment.status === 'success' ? sum + order.totalPrice : sum;
    }, 0)
  };

  return (
    <div className="om-container">
      {/* Header Section */}
      <div className="om-header">
        <div className="om-header-content">
          <h2>Order Management</h2>
          <p>Track and manage all customer orders efficiently</p>
        </div>
        <button
          onClick={() => fetchOrders(false)}
          disabled={refreshing}
          className="om-refresh-btn"
        >
          <i className={`om-icon ${refreshing ? 'om-spinner om-rotate' : 'om-refresh-icon'}`}></i>
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="om-stats-grid">
        <div className="om-stat-card">
          <div className="om-stat-icon">
            <i className="om-icon om-box-icon"></i>
          </div>
          <div className="om-stat-content">
            <h3>{paymentSummary.total}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        
        <div className="om-stat-card">
          <div className="om-stat-icon">
            <i className="om-icon om-check-icon"></i>
          </div>
          <div className="om-stat-content">
            <h3>{paymentSummary.paid}</h3>
            <p>Paid Orders</p>
            <span className="om-stat-subtitle">
              {paymentSummary.total > 0 ? 
                `${((paymentSummary.paid / paymentSummary.total) * 100).toFixed(1)}% success` : 
                'No orders'
              }
            </span>
          </div>
        </div>
        
        <div className="om-stat-card">
          <div className="om-stat-icon">
            <i className="om-icon om-clock-icon"></i>
          </div>
          <div className="om-stat-content">
            <h3>{paymentSummary.pending}</h3>
            <p>Pending Payment</p>
          </div>
        </div>
        
        <div className="om-stat-card">
          <div className="om-stat-icon">
            <i className="om-icon om-chart-icon"></i>
          </div>
          <div className="om-stat-content">
            <h3>${paymentSummary.revenue.toFixed(2)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="om-controls-bar">
        <div className="om-search-box">
          <i className="om-icon om-search-icon"></i>
          <input
            type="text"
            placeholder="Search orders by ID or item name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="om-search-input"
          />
        </div>
        
        <div className="om-filters-container">
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="om-filter-dropdown"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="preparing">Preparing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          <select 
            value={filterPayment} 
            onChange={(e) => setFilterPayment(e.target.value)}
            className="om-filter-dropdown"
          >
            <option value="all">All Payments</option>
            <option value="success">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="om-error-alert">
          <i className="om-icon om-warning-icon"></i>
          <span className="om-error-text">{error}</span>
          <button 
            onClick={() => setError(null)}
            className="om-error-close-btn"
          >
            ×
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="om-loading-state">
          <div className="om-loading-spinner"></div>
          <p className="om-loading-text">Loading orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        /* Empty State */
        <div className="om-empty-state">
          <div className="om-empty-icon">
            <i className="om-icon om-empty-box-icon"></i>
          </div>
          <h3 className="om-empty-title">No orders found</h3>
          <p className="om-empty-description">
            {search || filterStatus !== "all" || filterPayment !== "all" 
              ? "No orders match your current filters."
              : "No orders available. Orders will appear here once placed."
            }
          </p>
          {(search || filterStatus !== "all" || filterPayment !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setFilterStatus("all");
                setFilterPayment("all");
              }}
              className="om-clear-filters-btn"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        /* Orders List - Large Horizontal Cards */
        <div className="om-orders-wrapper">
          <div className="om-orders-header">
            <h3 className="om-orders-title">Recent Orders ({filteredOrders.length})</h3>
            <div className="om-orders-counter">
              Showing <strong>{filteredOrders.length}</strong> orders
            </div>
          </div>

          <div className="om-cards-container">
            {filteredOrders.map((order) => {
              const userInfo = getUserInfo(order);
              const paymentInfo = getPaymentInfo(order);
              
              return (
                <div key={order._id} className="om-order-card">
                  {/* Card Header */}
                  <div className="om-card-header">
                    <div className="om-order-identifier">
                      <div className="om-id-badge">
                        <i className="om-icon om-hash-icon"></i>
                      </div>
                      <div className="om-id-details">
                        <h4 className="om-order-id">{getOrderDisplayId(order)}</h4>
                        <div className="om-order-time">
                          <i className="om-icon om-time-icon"></i>
                          {new Date(order.createdAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                    
                    <div className="om-order-summary">
                      <div className="om-total-label">Total Amount</div>
                      <div className="om-total-amount">${order.totalPrice?.toFixed(2)}</div>
                      <div className="om-items-count">
                        <i className="om-icon om-basket-icon"></i>
                        {order.totalItems || 0} items
                      </div>
                    </div>
                  </div>

                  {/* Card Body - Main Content */}
                  <div className="om-card-body">
                    {/* Left Column - Customer & Items */}
                    <div className="om-card-left-column">
                      {/* Customer Info */}
                      <div className="om-customer-section">
                        <div className="om-section-heading">
                          <i className="om-icon om-user-icon"></i>
                          <span>Customer Information</span>
                        </div>
                        <div className="om-customer-details">
                          <div className="om-customer-info">
                            <i className="om-icon om-user-circle-icon"></i>
                            <div className="om-customer-data">
                              <div className="om-customer-name">
                                {userInfo.firstName} {userInfo.lastName}
                              </div>
                              <div className="om-customer-email">
                                <i className="om-icon om-email-icon"></i>
                                {userInfo.email}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="om-items-section">
                        <div className="om-section-heading">
                          <i className="om-icon om-basket-icon"></i>
                          <span>Order Items</span>
                        </div>
                        <div className="om-items-grid">
                          {order.items?.slice(0, 3).map((item, index) => (
                            <div key={index} className="om-item-card">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="om-item-image"
                              />
                              <div className="om-item-details">
                                <div className="om-item-name">{item.name}</div>
                                <div className="om-item-meta">
                                  <span className="om-item-quantity">Qty: {item.quantity}</span>
                                  <span className="om-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                          {order.items && order.items.length > 3 && (
                            <div className="om-more-items">
                              <i className="om-icon om-ellipsis-icon"></i>
                              <span>+{order.items.length - 3} more items</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Status & Actions */}
                    <div className="om-card-right-column">
                      {/* Order Date */}
                      <div className="om-date-section">
                        <div className="om-date-label">Order Date</div>
                        <div className="om-date-value">
                          <i className="om-icon om-calendar-icon"></i>
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </div>

                      {/* Status Indicators */}
                      <div className="om-status-section">
                        <div className="om-status-row">
                          <div className="om-status-label">Order Status</div>
                          <div className={`om-status-indicator ${getOrderStatusColor(order.status)}`}>
                            <div className="om-status-dot"></div>
                            <span className="om-status-text">{formatStatus(order.status)}</span>
                          </div>
                        </div>
                        
                        <div className="om-status-row">
                          <div className="om-status-label">Payment Status</div>
                          <div className={`om-status-indicator ${getPaymentStatusColor(paymentInfo.status)}`}>
                            <div className="om-status-dot"></div>
                            <span className="om-status-text">{formatStatus(paymentInfo.status)}</span>
                          </div>
                        </div>

                        <div className="om-payment-method-row">
                          <div className="om-payment-label">Payment Method</div>
                          <div className="om-payment-method">
                            {formatPaymentMethod(paymentInfo.method)}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="om-actions-section">
                        <div className="om-section-heading">
                          <i className="om-icon om-cog-icon"></i>
                          <span>Quick Actions</span>
                        </div>
                        
                        {/* Status Update Dropdown */}
                        <div className="om-status-update">
                          <label className="om-update-label">Update Status:</label>
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value as Order['status'])}
                            className="om-status-dropdown"
                          >
                            <option value="pending">⏳ Pending</option>
                            <option value="preparing">👨‍🍳 Preparing</option>
                            <option value="completed">✓ Completed</option>
                            <option value="cancelled">✗ Cancelled</option>
                          </select>
                        </div>

                        {/* Action Buttons */}
                        <div className="om-action-buttons">
                          <button
                            onClick={() => updateOrderStatus(order._id, 'completed')}
                            className="om-complete-btn"
                            disabled={order.status === 'completed'}
                          >
                            <i className="om-icon om-check-circle-icon"></i>
                            {order.status === 'completed' ? 'Completed' : 'Mark Complete'}
                          </button>
                          
                          <button
                            onClick={() => updateOrderStatus(order._id, 'preparing')}
                            className="om-prepare-btn"
                            disabled={order.status === 'preparing' || order.status === 'completed'}
                          >
                            <i className="om-icon om-utensils-icon"></i>
                            {order.status === 'preparing' ? 'Preparing' : 'Start Preparing'}
                          </button>
                        </div>

                        {/* Warning for Payment Issues */}
                        {paymentInfo.status !== 'success' && order.status === 'completed' && (
                          <div className="om-payment-warning">
                            <i className="om-icon om-warning-icon"></i>
                            <span>Payment pending for completed order</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="om-card-footer">
                    <div className="om-footer-left">
                      <div className="om-full-order-id">
                        Order ID: <span className="om-order-id-code">{order._id}</span>
                      </div>
                    </div>
                    <div className="om-footer-right">
                      <div className="om-update-time">
                        <i className="om-icon om-time-icon"></i>
                        Updated: Just now
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;