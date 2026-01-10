import { useEffect, useState } from 'react';
import { useOrder } from '../contexts/OrderContext';
import { Link } from 'react-router-dom';
import { orderStatusService } from '../services/orderStatusService';
import '../components/componentStyles/OrderHistory.css';

// Define types for better TypeScript support
interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  _id?: string;
  id?: string;
  status: string;
  createdAt: string;
  totalPrice: number;
  items: OrderItem[];
}

const OrderHistoryPage: React.FC = () => {
  const { orders, loading, error, getOrderHistory } = useOrder();
  const [statusDetails, setStatusDetails] = useState<{ [key: string]: string }>({});
  const [expandedOrders, setExpandedOrders] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    getOrderHistory();
  }, []);

  const getOrderDisplayId = (order: Order) => {
    const orderId = order?._id || order?.id;
    return orderId ? `#${orderId.slice(-6)}` : '#------';
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'fa-solid fa-check-circle';
      case 'preparing':
      case 'processing':
        return 'fa-solid fa-utensils';
      case 'pending':
      case 'confirmed':
        return 'fa-solid fa-clock';
      case 'out_for_delivery':
        return 'fa-solid fa-truck';
      case 'cancelled':
        return 'fa-solid fa-times-circle';
      default:
        return 'fa-solid fa-box';
    }
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('completed') || statusLower.includes('delivered')) 
      return 'order-status-completed';
    if (statusLower.includes('preparing') || statusLower.includes('processing')) 
      return 'order-status-preparing';
    if (statusLower.includes('pending') || statusLower.includes('confirmed')) 
      return 'order-status-pending';
    if (statusLower.includes('cancelled')) 
      return 'order-status-cancelled';
    if (statusLower.includes('out_for_delivery')) 
      return 'order-status-delivery';
    return 'order-status-default';
  };

  const getStatusText = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('completed')) return 'Completed';
    if (statusLower.includes('delivered')) return 'Delivered';
    if (statusLower.includes('preparing')) return 'Preparing';
    if (statusLower.includes('processing')) return 'Processing';
    if (statusLower.includes('pending')) return 'Pending';
    if (statusLower.includes('confirmed')) return 'Confirmed';
    if (statusLower.includes('out_for_delivery')) return 'On the Way';
    if (statusLower.includes('cancelled')) return 'Cancelled';
    return status;
  };

  const getEstimatedTime = (status: string): string => {
    const statusLower = status.toLowerCase();
    const estimatedTimes: { [key: string]: string } = {
      'pending': '15-25 minutes',
      'confirmed': '10-20 minutes',
      'preparing': '5-15 minutes',
      'processing': '5-10 minutes',
      'ready': 'Ready for pickup',
      'out_for_delivery': '15-30 minutes',
      'delivered': 'Delivered',
      'completed': 'Completed',
      'cancelled': 'Order cancelled'
    };
    
    return estimatedTimes[statusLower] || 'Processing...';
  };

  const toggleOrderDetails = async (orderId: string, status: string) => {
    if (!orderId) return;

    // Toggle expanded state
    const isExpanded = expandedOrders[orderId];
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !isExpanded
    }));

    // If we're expanding and don't have details yet, fetch them
    if (!isExpanded && !statusDetails[orderId]) {
      try {
        const explanation = await orderStatusService.getExplanation(status);
        setStatusDetails(prev => ({
          ...prev,
          [orderId]: explanation
        }));
      } catch (error) {
        console.error("Failed to get status details:", error);
        
        const restaurantStatusMessages: { [key: string]: string } = {
          'pending': 'Your order has been received and is awaiting confirmation from our kitchen team.',
          'confirmed': 'Order confirmed! Our chefs have started preparing your meal. Estimated preparation time: 15-25 minutes.',
          'preparing': 'Our kitchen team is actively preparing your order with fresh ingredients. Estimated completion: 10-15 minutes.',
          'processing': 'Your order is being processed for quality check and packaging.',
          'ready': 'Your order is ready! Please proceed to the pickup counter or wait for delivery.',
          'out_for_delivery': 'Your order is on the way! Our delivery partner will arrive shortly.',
          'delivered': 'Order has been successfully delivered. Enjoy your meal!',
          'completed': 'Order completed successfully. Thank you for dining with us!',
          'cancelled': 'This order has been cancelled as per your request or restaurant policy.',
        };
        
        const statusKey = status.toLowerCase();
        const fallback = restaurantStatusMessages[statusKey] || 
          `Your order status: "${status}". Our restaurant team is handling your order.`;
        
        setStatusDetails(prev => ({
          ...prev,
          [orderId]: fallback
        }));
      }
    }
  };

  if (loading) {
    return (
      <div className="order-history-container">
        <div className="order-loading">
          <div className="order-loading-spinner">
            <i className="fa-solid fa-utensils fa-spin"></i>
          </div>
          <p className="order-loading-text">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-history-container">
        <div className="order-error-state">
          <div className="order-error-icon">
            <i className="fa-solid fa-exclamation-triangle"></i>
          </div>
          <h3 className="order-error-title">Something Went Wrong</h3>
          <p className="order-error-message">{error}</p>
          <button
            onClick={() => getOrderHistory()}
            className="order-retry-btn"
          >
            <i className="fa-solid fa-rotate-right"></i>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-history-container">
      {/* Hero Section */}
      <section className="order-history-hero">
        <div className="order-hero-content">
          <div className="order-hero-text">
            <h1>Your Order History</h1>
            <p>Track and review all your past orders in one place</p>
          </div>
        </div>
      </section>

      <div className="order-history-wrapper">
        <main className="order-history-main">
          {/* Header */}
          <div className="order-history-header">
            <div className="order-heading-two">
              <h2>Previous Orders</h2>
              <div className="order-line"></div>
            </div>
            <div className="order-stats-summary">
              <div className="order-stat-item">
                <i className="fa-solid fa-clock-rotate-left"></i>
                <div>
                  <h3>{orders.length}</h3>
                  <p>Total Orders</p>
                </div>
              </div>
              <Link to="/menu" className="order-continue-shopping">
                <i className="fa-solid fa-plus"></i>
                Order More Food
              </Link>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="order-empty-state">
              <div className="order-empty-icon">
                <i className="fa-solid fa-receipt"></i>
              </div>
              <h3 className="order-empty-title">No Orders Yet</h3>
              <p className="order-empty-text">
                You haven't placed any orders yet. Start your culinary journey now!
              </p>
              <Link to="/menu" className="order-empty-btn">
                <i className="fa-solid fa-utensils"></i>
                Explore Our Menu
              </Link>
            </div>
          ) : (
            <div className="orders-grid">
              {orders.map((order) => {
                const orderId = order._id || order.id || '';
                const isExpanded = expandedOrders[orderId];
                
                return (
                  <div key={orderId} className="order-card">
                    {/* Order Header */}
                    <div className="order-card-header">
                      <div className="order-id-section">
                        <div className="order-id-badge">
                          <i className="fa-solid fa-hashtag"></i>
                          Order {getOrderDisplayId(order)}
                        </div>
                        <div className="order-date">
                          <i className="fa-solid fa-calendar-days"></i>
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                      
                      <div className="order-status-section">
                        <div className="order-price">
                          ${(order.totalPrice || 0).toFixed(2)}
                        </div>
                        <div className={`order-status-badge ${getStatusColor(order.status)}`}>
                          <i className={getStatusIcon(order.status)}></i>
                          {getStatusText(order.status)}
                        </div>
                      </div>
                    </div>

                    {/* Restaurant Status Details */}
                    <div className="order-status-details-section">
                      <div className="status-details-header">
                        <div className="status-time-estimate">
                          <i className="fa-solid fa-clock"></i>
                          <div>
                            <span className="time-label">Estimated Time</span>
                            <span className="time-value">{getEstimatedTime(order.status)}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleOrderDetails(orderId, order.status)}
                          className="status-details-btn"
                        >
                          <i className={`fa-solid ${isExpanded ? 'fa-eye-slash' : 'fa-circle-info'}`}></i>
                          {isExpanded ? 'Hide Details' : 'View Order Details'}
                        </button>
                      </div>

                      {isExpanded && statusDetails[orderId] && (
                        <div className="restaurant-status-box">
                          <div className="restaurant-status-header">
                            <div className="restaurant-icon">
                              <i className="fa-solid fa-store"></i>
                            </div>
                            <div className="restaurant-info">
                              <h4>Restaurant Update</h4>
                              <p className="restaurant-time">
                                <i className="fa-solid fa-clock"></i>
                                Updated just now
                              </p>
                            </div>
                          </div>
                          <div className="status-details-content">
                            <p className="status-description">
                              {statusDetails[orderId]}
                            </p>
                            <div className="status-next-step">
                              <i className="fa-solid fa-arrow-right"></i>
                              <span>
                                {order.status.toLowerCase().includes('delivered') || 
                                 order.status.toLowerCase().includes('completed')
                                  ? 'Thank you for your order!'
                                  : 'Next update will be provided shortly'}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Order Items */}
                    <div className="order-items-section">
                      <div className="order-items-header">
                        <i className="fa-solid fa-list-check"></i>
                        <h4>Order Items</h4>
                      </div>
                      
                      <div className="order-items-list">
                        {order.items?.map((item, index) => (
                          <div key={`${orderId}-${index}`} className="order-item">
                            <div className="order-item-image">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="item-image"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80';
                                }}
                              />
                            </div>
                            <div className="order-item-details">
                              <h5 className="item-name">{item.name}</h5>
                              <div className="item-meta">
                                <span className="item-quantity">
                                  <i className="fa-solid fa-layer-group"></i>
                                  Qty: {item.quantity}
                                </span>
                                <span className="item-price">
                                  ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Footer */}
                    <div className="order-card-footer">
                      <div className="order-total">
                        <span>Order Total:</span>
                        <span className="total-amount">${(order.totalPrice || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Order History Tips */}
          {orders.length > 0 && (
            <div className="order-tips-section">
              <div className="order-tips-header">
                <i className="fa-solid fa-circle-info"></i>
                <h3>Order Tracking Tips</h3>
              </div>
              <div className="order-tips-grid">
                <div className="order-tip">
                  <div className="tip-icon">
                    <i className="fa-solid fa-clock"></i>
                  </div>
                  <div className="tip-content">
                    <h4>Real-time Updates</h4>
                    <p>Check back for live status updates on your orders</p>
                  </div>
                </div>
                <div className="order-tip">
                  <div className="tip-icon">
                    <i className="fa-solid fa-utensils"></i>
                  </div>
                  <div className="tip-content">
                    <h4>Kitchen Updates</h4>
                    <p>Get detailed preparation updates from our restaurant</p>
                  </div>
                </div>
                <div className="order-tip">
                  <div className="tip-icon">
                    <i className="fa-solid fa-headset"></i>
                  </div>
                  <div className="tip-content">
                    <h4>Need Help?</h4>
                    <p>Contact support for any order-related questions</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default OrderHistoryPage;