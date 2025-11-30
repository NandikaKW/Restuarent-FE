import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useOrder } from '../contexts/OrderContext';
import { useState, useEffect } from 'react';
import CartItem from '../components/CartItem';

const Cart: React.FC = () => {
  const { cart, loading: cartLoading, clearCart, refreshCart, error: cartError, clearError } = useCart();
  const { placeOrder, loading: orderLoading, error: orderError } = useOrder();
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<any>(null);

  const loading = cartLoading || orderLoading;
  const error = cartError || orderError;

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError?.();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleCheckout = async () => {
    try {
      const order = await placeOrder();
      setPlacedOrder(order);
      setCheckoutSuccess(true);
      await refreshCart();
    } catch (error) {
      console.error('Checkout failed:', error);
    }
  };

  // Safe function to get order display ID
  const getOrderDisplayId = (order: any) => {
    // Try _id first (MongoDB), then id, then fallback
    const orderId = order?._id || order?.id;
    return orderId ? `#${orderId.slice(-6)}` : '#------';
  };

  // Show error message if any
  if (error && !checkoutSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            <button 
              onClick={clearError}
              className="float-right text-red-900 font-bold"
            >
              ×
            </button>
          </div>
          <div className="text-center">
            <Link
              to="/menu"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition duration-200"
            >
              Back to Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success message after order placement
  if (checkoutSuccess && placedOrder) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
            <p className="text-gray-600 mb-4">
              Thank you for your order. Your order number is <strong>{getOrderDisplayId(placedOrder)}</strong>
            </p>
            <p className="text-gray-600 mb-6">
              Total: <strong>${placedOrder.totalPrice?.toFixed(2) || '0.00'}</strong>
            </p>
            <div className="flex space-x-4 justify-center">
              <Link
                to="/orders"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition duration-200"
              >
                View Order History
              </Link>
              <Link
                to="/menu"
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md font-medium transition duration-200"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Original cart empty state
  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <svg
              className="mx-auto h-24 w-24 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Your cart is empty</h2>
            <p className="mt-2 text-gray-600">Start adding some delicious food to your cart!</p>
            <Link
              to="/menu"
              className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition duration-200"
            >
              Browse Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Original cart with items
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <button
            onClick={clearCart}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 transition duration-200"
          >
            Clear Cart
          </button>
        </div>

        <div className="space-y-4 mb-8">
          {cart.items.map((item) => (
            <CartItem key={item.menuItemId} item={item} />
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-semibold text-gray-900">Total Items:</span>
            <span className="text-xl font-bold text-gray-900">{cart.totalItems}</span>
          </div>
          <div className="flex justify-between items-center mb-6">
            <span className="text-2xl font-bold text-gray-900">Total Price:</span>
            <span className="text-2xl font-bold text-blue-600">
              ${cart.totalPrice.toFixed(2)}
            </span>
          </div>
          <div className="mt-6 flex space-x-4">
            <Link
              to="/menu"
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-center py-3 px-4 rounded-md font-medium transition duration-200"
            >
              Continue Shopping
            </Link>
            <button 
              onClick={handleCheckout}
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md font-medium disabled:opacity-50 transition duration-200"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;