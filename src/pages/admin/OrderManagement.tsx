import { useState, useEffect } from 'react';
import { adminOrderService } from '../../services/adminOrderService';
import type { Order, OrderUser } from '../../types/admin';

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const ordersData = await adminOrderService.getAllOrders();
      console.log('Processed orders data:', ordersData);
      setOrders(ordersData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const response = await adminOrderService.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(order => 
        order._id === orderId ? response.order : order
      ));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update order status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrderDisplayId = (order: Order) => {
    return order._id ? `#${order._id.slice(-6)}` : '#------';
  };

  // Enhanced user info extraction
  const getUserInfo = (order: Order) => {
    console.log('Extracting user info from order:', order._id, order.userId);
    
    // Case 1: userId is a populated user object
    if (order.userId && typeof order.userId === 'object') {
      const user = order.userId as OrderUser;
      console.log('User object found:', user);
      return {
        firstName: user.firstName || 'Unknown',
        lastName: user.lastName || 'User',
        email: user.email || 'No email available'
      };
    }
    
    // Case 2: userId is just a string ID (not populated)
    if (typeof order.userId === 'string') {
      console.log('User ID string found (not populated):', order.userId);
      return {
        firstName: 'User ID:',
        lastName: order.userId.slice(-6),
        email: 'Not populated'
      };
    }
    
    // Case 3: No user information available
    console.log('No user information available');
    return {
      firstName: 'Unknown',
      lastName: 'User',
      email: 'No information available'
    };
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
          onClick={fetchOrders}
          className="ml-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
        <button
          onClick={fetchOrders}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium"
        >
          Refresh Orders
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <svg
            className="mx-auto h-16 w-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600">There are no orders to display.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const userInfo = getUserInfo(order);
            return (
              <div key={order._id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order {getOrderDisplayId(order)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Customer: <strong>{userInfo.firstName} {userInfo.lastName}</strong>
                      </p>
                      <p className="text-sm text-gray-600">
                        Email: <strong>{userInfo.email}</strong>
                      </p>
                      <p className="text-sm text-gray-600">
                        Date: {new Date(order.createdAt).toLocaleDateString()} at{' '}
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        ${order.totalPrice?.toFixed(2) || '0.00'}
                      </p>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-sm font-medium text-gray-700">Items:</h4>
                    <div className="flex space-x-2">
                      {['pending', 'preparing', 'completed', 'cancelled'].map((status) => (
                        <button
                          key={status}
                          onClick={() => updateOrderStatus(order._id, status as Order['status'])}
                          disabled={order.status === status}
                          className={`px-3 py-1 text-xs font-medium rounded ${
                            order.status === status
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          Mark as {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {order.items?.map((item, index) => (
                      <li key={index} className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                        </p>
                      </li>
                    ))}
                  </ul>
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