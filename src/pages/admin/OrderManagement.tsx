import { useState, useEffect } from 'react';
import { adminOrderService } from '../../services/adminOrderService';
import type { Order, OrderUser, PaymentInfo } from '../../types/admin';

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

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
      console.log('Processed orders data:', ordersData);
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
      const response = await adminOrderService.updateOrderStatus(orderId, newStatus);
      // Instead of just updating the order, refresh the entire list to get latest payment data
      await fetchOrders(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update order status');
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-700 border border-green-200';
      case 'preparing':
        return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
      case 'pending':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'failed':
        return 'bg-rose-50 text-rose-700 border border-rose-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  const getOrderDisplayId = (order: Order) => {
    return order._id ? `#${order._id.slice(-8).toUpperCase()}` : '#------';
  };

  // Enhanced user info extraction
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
        lastName: order.userId.slice(-6),
        email: 'Not populated'
      };
    }
    
    
    return {
      firstName: 'Unknown',
      lastName: 'User',
      email: 'No information available'
    };
  };

  // Get payment info
  const getPaymentInfo = (order: Order) => {
    
    if (order.paymentId && typeof order.paymentId === 'object') {
      const payment = order.paymentId as PaymentInfo;
      return {
        status: payment.status || 'pending',
        method: payment.paymentMethod || 'unknown',
        amount: payment.amount || order.totalPrice,
        date: payment.paymentDate || null,
        id: payment._id || 'N/A'
      };
    }
    
    
    if (typeof order.paymentId === 'string') {
      return {
        status: 'pending',
        method: 'Not linked',
        amount: order.totalPrice,
        date: null,
        id: order.paymentId.slice(-8)
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
      case 'card':
        return '💳 Card';
      case 'paypal':
        return '💰 PayPal';
      case 'cash':
        return '💵 Cash';
      default:
        return `📋 ${method}`;
    }
  };

  const getStatusIcon = (type: 'order' | 'payment', status: string) => {
    if (type === 'order') {
      switch (status) {
        case 'completed': return '✓';
        case 'preparing': return '👨‍🍳';
        case 'pending': return '⏳';
        case 'cancelled': return '✗';
        default: return '?';
      }
    } else {
      switch (status) {
        case 'success': return '💰';
        case 'pending': return '⏳';
        case 'failed': return '❌';
        case 'not_found': return '🔍';
        default: return '?';
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
        <button 
          onClick={() => fetchOrders(true)}
          className="ml-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  
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
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
          <p className="text-sm text-gray-600 mt-1">Manage orders and track payment status</p>
        </div>
        <button
          onClick={() => fetchOrders(false)}
          disabled={refreshing}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
        >
          {refreshing ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Refreshing...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Orders
            </>
          )}
        </button>
      </div>

      {/* Summary Cards - Clear separation */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm p-5 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Total Orders</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{paymentSummary.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-xl">📦</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl shadow-sm p-5 border border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-700">Paid Orders</p>
              <p className="text-2xl font-bold text-emerald-900 mt-1">{paymentSummary.paid}</p>
              <p className="text-xs text-emerald-600 mt-1">
                {paymentSummary.total > 0 ? `${((paymentSummary.paid / paymentSummary.total) * 100).toFixed(1)}% success rate` : 'No orders'}
              </p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-lg">
              <span className="text-xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-sm p-5 border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-700">Pending Payments</p>
              <p className="text-2xl font-bold text-amber-900 mt-1">{paymentSummary.pending}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <span className="text-xl">⏳</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm p-5 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Total Revenue</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">${paymentSummary.revenue.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <span className="text-xl">💸</span>
            </div>
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📦</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600 mb-4">There are no orders to display.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const userInfo = getUserInfo(order);
            const paymentInfo = getPaymentInfo(order);
            
            return (
              <div key={order._id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
                {/* Order Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-3 md:space-y-0">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <span className="text-green-600 font-semibold">#</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            Order {getOrderDisplayId(order)}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        ${order.totalPrice?.toFixed(2) || '0.00'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{order.totalItems || 0} items</p>
                    </div>
                  </div>
                </div>

                {/* Customer & Status Section */}
                <div className="px-6 py-4 border-b">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Customer Info */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <span className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
                          <span className="text-blue-600 text-xs">👤</span>
                        </span>
                        Customer Information
                      </h4>
                      <div className="space-y-1 pl-7">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{userInfo.firstName} {userInfo.lastName}</span>
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <span>📧</span>
                          {userInfo.email}
                        </p>
                      </div>
                    </div>

                    {/* Status Cards - Clearly Separated */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Status Overview</h4>
                      <div className="flex flex-wrap gap-3">
                        {/* Order Status Card */}
                        <div className={`flex-1 min-w-[140px] rounded-lg p-3 ${getOrderStatusColor(order.status)}`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold uppercase tracking-wide">Order Status</span>
                            <span className="text-lg">{getStatusIcon('order', order.status)}</span>
                          </div>
                          <div className="text-sm font-semibold">
                            {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Unknown'}
                          </div>
                        </div>

                        {/* Payment Status Card */}
                        <div className={`flex-1 min-w-[140px] rounded-lg p-3 ${getPaymentStatusColor(paymentInfo.status)}`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold uppercase tracking-wide">Payment Status</span>
                            <span className="text-lg">{getStatusIcon('payment', paymentInfo.status)}</span>
                          </div>
                          <div className="text-sm font-semibold">
                            {paymentInfo.status === 'not_found' ? 'Not Found' : 
                             paymentInfo.status.charAt(0).toUpperCase() + paymentInfo.status.slice(1)}
                          </div>
                          {paymentInfo.method !== 'Not available' && (
                            <div className="text-xs mt-1 opacity-75">
                              {formatPaymentMethod(paymentInfo.method)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Details & Actions */}
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Payment Details - Expanded */}
                    <div className="lg:col-span-2">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <span className="w-5 h-5 bg-emerald-100 rounded flex items-center justify-center">
                          <span className="text-emerald-600 text-xs">💰</span>
                        </span>
                        Payment Details
                      </h4>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs text-gray-500">Payment ID</p>
                            <p className="text-sm font-medium text-gray-900">{paymentInfo.id}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Amount</p>
                            <p className="text-sm font-medium text-gray-900">${paymentInfo.amount.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Method</p>
                            <p className="text-sm font-medium text-gray-900">{formatPaymentMethod(paymentInfo.method)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Payment Date</p>
                            <p className="text-sm font-medium text-gray-900">
                              {paymentInfo.date 
                                ? new Date(paymentInfo.date).toLocaleDateString() 
                                : 'Not paid yet'}
                            </p>
                          </div>
                        </div>
                        {paymentInfo.status === 'pending' && (
                          <div className="bg-amber-50 border border-amber-100 rounded p-2 text-center">
                            <p className="text-xs text-amber-700">
                              ⚠️ Payment is pending. This order is awaiting payment confirmation.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Order Items */}
                      <h4 className="text-sm font-semibold text-gray-700 mt-4 mb-3">Order Items</h4>
                      <div className="space-y-2">
                        {order.items?.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded-lg border"
                              />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                              </div>
                            </div>
                            <p className="text-sm font-medium text-gray-900">
                              ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Actions */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <span className="w-5 h-5 bg-green-100 rounded flex items-center justify-center">
                          <span className="text-green-600 text-xs">⚙️</span>
                        </span>
                        Update Order Status
                      </h4>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        {['pending', 'preparing', 'completed', 'cancelled'].map((status) => (
                          <button
                            key={status}
                            onClick={() => updateOrderStatus(order._id, status as Order['status'])}
                            disabled={order.status === status}
                            className={`w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                              order.status === status
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300'
                                : 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-700 hover:border-green-200 border border-gray-200'
                            }`}
                          >
                            {order.status === status ? (
                              <div className="flex items-center justify-between">
                                <span>✓ Current: {status.charAt(0).toUpperCase() + status.slice(1)}</span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between">
                                <span>Mark as {status}</span>
                                <span className="text-xs opacity-75">→</span>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>

                      {/* Payment Status Warning */}
                      {paymentInfo.status !== 'success' && order.status === 'completed' && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg">
                          <div className="flex items-start gap-2">
                            <span className="text-red-500 text-sm">⚠️</span>
                            <div>
                              <p className="text-xs font-medium text-red-700">Payment Issue</p>
                              <p className="text-xs text-red-600 mt-1">
                                Order is marked as completed but payment is {paymentInfo.status}. 
                                Please verify payment status.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderManagement;