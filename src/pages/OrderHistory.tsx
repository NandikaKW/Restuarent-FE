import { useEffect, useState } from 'react';
import { useOrder } from '../contexts/OrderContext';
import { Link } from 'react-router-dom';
import { orderStatusService } from '../services/orderStatusService';

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

const OrderHistory: React.FC = () => {
  const { orders, loading, error, getOrderHistory } = useOrder();
  const [aiExplanation, setAiExplanation] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    getOrderHistory();
  }, []);

  const getOrderDisplayId = (order: Order) => {
    // Try _id first (MongoDB), then id, then fallback
    const orderId = order?._id || order?.id;
    return orderId ? `#${orderId.slice(-6)}` : '#------';
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

// OrderHistory.tsx (just update the handleExplainStatus function)
const handleExplainStatus = async (orderId: string, status: string) => {
  if (!orderId) return;

  // Prevent calling again for same order
  if (aiExplanation[orderId]) return;

  try {
    // Use the new service
    const explanation = await orderStatusService.getExplanation(status);
    setAiExplanation(prev => ({
      ...prev,
      [orderId]: explanation
    }));
  } catch (error) {
    console.error("Failed to get status explanation:", error);
    
    // Enhanced local fallback
    const fallbackExplanations: { [key: string]: string } = {
      'pending': 'Your order is waiting to be confirmed.',
      'confirmed': 'Order confirmed. Preparation will start soon.',
      'preparing': 'Kitchen is preparing your food now.',
      'ready': 'Your order is ready!',
      'out_for_delivery': 'Food is on the way to you!',
      'delivered': 'Order has been delivered.',
      'completed': 'Order completed successfully.',
      'cancelled': 'Order was cancelled.',
    };
    
    const statusKey = status.toLowerCase();
    const fallback = fallbackExplanations[statusKey] || 
      `Your order is "${status}". It's moving through our system.`;
    
    setAiExplanation(prev => ({
      ...prev,
      [orderId]: fallback
    }));
  }
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
            {error}
          </div>
          <button
            onClick={() => getOrderHistory()}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
          <Link
            to="/menu"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition duration-200"
          >
            Continue Shopping
          </Link>
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
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
            <Link
              to="/menu"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const orderId = order._id || order.id || '';
              return (
                <div key={orderId} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 border-b">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order {getOrderDisplayId(order)}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()} at{' '}
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          ${(order.totalPrice || 0).toFixed(2)}
                        </p>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Unknown'}
                        </span>
                        {orderId && (
                          <div className="mt-2">
                            <button
                              onClick={() => handleExplainStatus(orderId, order.status)}
                              className="block text-sm text-blue-600 hover:text-blue-800 underline"
                              disabled={!!aiExplanation[orderId]}
                            >
                              {aiExplanation[orderId] ? 'Explanation provided' : 'Why this status?'}
                            </button>

                            {aiExplanation[orderId] && (
                              <div className="mt-2 bg-blue-50 text-blue-800 p-3 rounded text-sm max-w-xs">
                                🤖 {aiExplanation[orderId]}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Items:</h4>
                    <ul className="space-y-2">
                      {order.items?.map((item, index) => (
                        <li key={`${orderId}-${index}`} className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 object-cover rounded"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=Item';
                              }}
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{item.name}</p>
                              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="text-sm font-medium text-gray-900">
                            ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
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
    </div>
  );
};

export default OrderHistory;