import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useOrder } from '../contexts/OrderContext';
import { useState, useEffect } from 'react';
import CartItem from '../components/CartItem';
import PaymentPopup from '../components/PaymentPopup';
import '../components/componentStyles/Cart.css';

const Cart: React.FC = () => {
  const { cart, loading: cartLoading, clearCart, refreshCart, error: cartError, clearError } = useCart();
  const { placeOrder, loading: orderLoading, error: orderError } = useOrder();
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<any>(null);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);

  // Alert states
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error" | "info">("success");

  const loading = cartLoading || orderLoading;
  const error = cartError || orderError;

  useEffect(() => {
    if (error) {
      showAlertMessage(error, "error");
      const timer = setTimeout(() => {
        clearError?.();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const showAlertMessage = (message: string, type: "success" | "error" | "info") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);

    // Auto-hide alert after 5 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  const handleCheckout = async () => {
    try {
      const order = await placeOrder();
      setPlacedOrder(order);
      setShowPaymentPopup(true);
    } catch (error) {
      console.error('Checkout failed:', error);
      showAlertMessage("Failed to process checkout. Please try again.", "error");
    }
  };

  const getOrderDisplayId = (order: any) => {
    const orderId = order?._id || order?.id;
    return orderId ? `#${orderId.slice(-6)}` : '#------';
  };

  const handlePaymentSuccess = (paymentId: string) => {
    setShowPaymentPopup(false);
    setCheckoutSuccess(true);
    refreshCart();
    showAlertMessage("Payment successful! Your order has been confirmed.", "success");
  };

  const handleClearCart = () => {
    clearCart();
    showAlertMessage("Cart cleared successfully!", "info");
  };

  // Show error message if any
  if (error && !checkoutSuccess) {
    return (
      <div className="cart-restaurant-container">
        {/* Alert Message */}
        {showAlert && (
          <div className={`cart-alert cart-alert-${alertType}`}>
            <div className="cart-alert-content">
              <div className="cart-alert-icon">
                {alertType === "success" && <i className="fas fa-check-circle"></i>}
                {alertType === "error" && <i className="fas fa-exclamation-circle"></i>}
                {alertType === "info" && <i className="fas fa-info-circle"></i>}
              </div>
              <div className="cart-alert-message">
                <p>{alertMessage}</p>
              </div>
              <button
                className="cart-alert-close"
                onClick={() => setShowAlert(false)}
                aria-label="Close alert"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="cart-alert-progress"></div>
          </div>
        )}

        <div className="cart-container-wrapper">
          <div className="cart-error-message">
            <div className="error-content">
              <i className="fa-solid fa-exclamation-triangle"></i>
              <h3>Oops! Something went wrong</h3>
              <p>{error}</p>
              <button
                onClick={clearError}
                className="cart-button"
              >
                <i className="fa-solid fa-xmark me-2"></i>
                Dismiss
              </button>
              <Link
                to="/menu"
                className="cart-button cart-button-outline"
              >
                <i className="fa-solid fa-arrow-left me-2"></i>
                Back to Menu
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show payment popup if needed
  if (showPaymentPopup && placedOrder) {
    return (
      <>
        <PaymentPopup
          orderId={placedOrder._id || placedOrder.id}
          amount={placedOrder.totalPrice}
          onClose={() => setShowPaymentPopup(false)}
          onSuccess={handlePaymentSuccess}
        />
        {/* Blurred background */}
        <div className="cart-restaurant-container blurred">
          {/* Alert Message */}
          {showAlert && (
            <div className={`cart-alert cart-alert-${alertType}`}>
              <div className="cart-alert-content">
                <div className="cart-alert-icon">
                  {alertType === "success" && <i className="fas fa-check-circle"></i>}
                  {alertType === "error" && <i className="fas fa-exclamation-circle"></i>}
                  {alertType === "info" && <i className="fas fa-leaf"></i>}
                </div>
                <div className="cart-alert-message">
                  <p>{alertMessage}</p>
                </div>
                <button
                  className="cart-alert-close"
                  onClick={() => setShowAlert(false)}
                  aria-label="Close alert"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="cart-alert-progress"></div>
            </div>
          )}

          <div className="cart-container-wrapper">
            <div className="cart-hero-section">
              <div className="hero-content">
                <div className="hero-text">
                  <h1>Complete Payment</h1>
                  <p>Secure payment processing for your order</p>
                </div>
              </div>
            </div>

            <section className="cart-gap">
              <div className="cart-container-wrapper">
                <div className="cart-main-container">
                  <div className="cart-header">
                    <div className="cart-heading-two">
                      <h2>Order #{getOrderDisplayId(placedOrder)}</h2>
                      <div className="cart-line"></div>
                    </div>
                  </div>

                  <div className="order-summary-blurred">
                    <div className="summary-header">
                      <i className="fa-solid fa-credit-card"></i>
                      <div>
                        <h3>Payment Processing</h3>
                        <p className="summary-subtitle">Complete payment to confirm your order</p>
                      </div>
                    </div>

                    <div className="summary-details">
                      <div className="summary-row">
                        <span className="summary-label">Order Amount:</span>
                        <span className="summary-value">
                          ${placedOrder.totalPrice?.toFixed(2) || '0.00'}
                        </span>
                      </div>
                      <div className="summary-row">
                        <span className="summary-label">Status:</span>
                        <span className="summary-value status-pending">
                          <i className="fa-solid fa-clock me-2"></i>
                          Awaiting Payment
                        </span>
                      </div>
                      <div className="summary-row total">
                        <span className="summary-label">Total Due:</span>
                        <span className="summary-value total-price">
                          ${placedOrder.totalPrice?.toFixed(2) || '0.00'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </>
    );
  }

  // Success message after payment
  if (checkoutSuccess && placedOrder) {
    return (
      <div className="cart-restaurant-container">
        {/* Alert Message */}
        {showAlert && (
          <div className={`cart-alert cart-alert-${alertType}`}>
            <div className="cart-alert-content">
              <div className="cart-alert-icon">
                {alertType === "success" && <i className="fas fa-check-circle"></i>}
                {alertType === "error" && <i className="fas fa-exclamation-circle"></i>}
                {alertType === "info" && <i className="fas fa-leaf"></i>}
              </div>
              <div className="cart-alert-message">
                <p>{alertMessage}</p>
              </div>
              <button
                className="cart-alert-close"
                onClick={() => setShowAlert(false)}
                aria-label="Close alert"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="cart-alert-progress"></div>
          </div>
        )}

        <div className="cart-container-wrapper">
          <div className="cart-success-message">
            <div className="success-content">
              <div className="success-icon">
                <i className="fa-solid fa-check"></i>
              </div>
              <h2>Order Placed Successfully!</h2>
              <p className="success-subtitle">
                Thank you for your order. Your delicious meal is being prepared!
              </p>

              <div className="order-details-card">
                <div className="order-header">
                  <i className="fa-solid fa-receipt"></i>
                  <h4>Order Details</h4>
                </div>
                <div className="order-info">
                  <div className="info-row">
                    <span className="info-label">Order Number:</span>
                    <span className="info-value">{getOrderDisplayId(placedOrder)}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Total Amount:</span>
                    <span className="info-value total-price">
                      ${placedOrder.totalPrice?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Status:</span>
                    <span className="info-value status-success">
                      <i className="fa-solid fa-check-circle me-2"></i>
                      Confirmed
                    </span>
                  </div>
                </div>
              </div>

              <div className="success-actions">
                <Link
                  to="/orders"
                  className="cart-button"
                >
                  <i className="fa-solid fa-history me-2"></i>
                  View Order History
                </Link>
                <Link
                  to="/menu"
                  className="cart-button cart-button-outline"
                >
                  <i className="fa-solid fa-utensils me-2"></i>
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Original cart empty state
  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart-restaurant-container">
        {/* Alert Message */}
        {showAlert && (
          <div className={`cart-alert cart-alert-${alertType}`}>
            <div className="cart-alert-content">
              <div className="cart-alert-icon">
                {alertType === "success" && <i className="fas fa-check-circle"></i>}
                {alertType === "error" && <i className="fas fa-exclamation-circle"></i>}
                {alertType === "info" && <i className="fas fa-leaf"></i>}
              </div>
              <div className="cart-alert-message">
                <p>{alertMessage}</p>
              </div>
              <button
                className="cart-alert-close"
                onClick={() => setShowAlert(false)}
                aria-label="Close alert"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="cart-alert-progress"></div>
          </div>
        )}

        {/* Hero Section - Matching Dashboard */}
        <section className="cart-hero-section">
          <div className="cart-container-wrapper">
            <div className="hero-content">
              <div className="hero-text">
                <h1>Your Shopping Cart</h1>
                <p>Add delicious items to start your order</p>
              </div>
            </div>
          </div>
        </section>

        <section className="cart-gap">
          <div className="cart-container-wrapper">
            <div className="cart-empty-state">
              <div className="empty-content">
                <div className="empty-icon">
                  <i className="fa-solid fa-shopping-basket"></i>
                </div>
                <h2>Your Cart is Empty</h2>
                <p className="empty-subtitle">
                  Looks like you haven't added any delicious items to your cart yet.
                </p>
                <div className="empty-actions">
                  <Link
                    to="/menu"
                    className="cart-button"
                  >
                    <i className="fa-solid fa-plus me-2"></i>
                    Browse Our Menu
                  </Link>
                </div>

                <div className="featured-items">
                  <h4><i className="fa-solid fa-fire me-2"></i>Popular This Week</h4>
                  <div className="items-grid">
                    <div className="featured-item">
                      <img
                        src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                        alt="Gourmet Burger"
                      />
                      <div className="item-info">
                        <h5>Gourmet Burger</h5>
                        <p className="price">$24.99</p>
                        <ul className="cart-star">
                          {[...Array(5)].map((_, i) => (
                            <li key={i}><i className="fa-solid fa-star"></i></li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="featured-item">
                      <img
                        src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                        alt="Truffle Pizza"
                      />
                      <div className="item-info">
                        <h5>Truffle Pizza</h5>
                        <p className="price">$29.99</p>
                        <ul className="cart-star">
                          {[...Array(5)].map((_, i) => (
                            <li key={i}><i className="fa-solid fa-star"></i></li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="featured-item">
                      <img
                        src="https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                        alt="Pasta Carbonara"
                      />
                      <div className="item-info">
                        <h5>Pasta Carbonara</h5>
                        <p className="price">$22.99</p>
                        <ul className="cart-star">
                          {[...Array(5)].map((_, i) => (
                            <li key={i}><i className="fa-solid fa-star"></i></li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Original cart with items
  return (
    <div className="cart-restaurant-container">
      {/* Alert Message */}
      {showAlert && (
        <div className={`cart-alert cart-alert-${alertType}`}>
          <div className="cart-alert-content">
            <div className="cart-alert-icon">
              {alertType === "success" && <i className="fas fa-check-circle"></i>}
              {alertType === "error" && <i className="fas fa-exclamation-circle"></i>}
              {alertType === "info" && <i className="fas fa-leaf"></i>}
            </div>
            <div className="cart-alert-message">
              <p>{alertMessage}</p>
            </div>
            <button
              className="cart-alert-close"
              onClick={() => setShowAlert(false)}
              aria-label="Close alert"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="cart-alert-progress"></div>
        </div>
      )}

      {/* Hero Section - Matching Dashboard */}
      <section className="cart-hero-section">
        <div className="cart-container-wrapper">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Your Shopping Cart</h1>
              <p>Review your selected items and proceed to checkout</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cart-gap">
        <div className="cart-container-wrapper">
          <div className="cart-main-container">
            {/* Cart Header */}
            <div className="cart-header">
              <div className="cart-heading-two">
                <h2>Cart Items</h2>
                <div className="cart-line"></div>
              </div>
              <button
                onClick={handleClearCart}
                disabled={loading}
                className="cart-button cart-button-clear"
              >
                <i className="fa-solid fa-trash-can me-2"></i>
                Clear Cart
              </button>
            </div>

            {/* Cart Items */}
            <div className="cart-items-container">
              {cart.items.map((item) => (
                <CartItem key={item.menuItemId} item={item} />
              ))}
            </div>

            {/* Order Summary */}
            <div className="order-summary">
              <div className="summary-header">
                <i className="fa-solid fa-file-invoice-dollar"></i>
                <h3>Order Summary</h3>
              </div>

              <div className="summary-details">
                <div className="summary-row">
                  <span className="summary-label">Subtotal</span>
                  <span className="summary-value">
                    ${cart.totalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Delivery Fee</span>
                  <span className="summary-value">$0.00</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Tax</span>
                  <span className="summary-value">
                    ${(cart.totalPrice * 0.1).toFixed(2)}
                  </span>
                </div>
                <div className="summary-row discount">
                  <span className="summary-label">
                    <i className="fa-solid fa-tag me-2"></i>
                    Discount
                  </span>
                  <span className="summary-value">-$5.00</span>
                </div>
                <div className="summary-row total">
                  <span className="summary-label">Total</span>
                  <span className="summary-value total-price">
                    ${(cart.totalPrice * 1.1 - 5).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Cart Stats */}
              <div className="cart-stats">
                <div className="stat-card">
                  <i className="fa-solid fa-box"></i>
                  <h3>{cart.totalItems}</h3>
                  <p>Total Items</p>
                </div>
              </div>

              {/* Checkout Actions */}
              <div className="checkout-actions">
                <Link
                  to="/menu"
                  className="cart-button cart-button-outline"
                >
                  <i className="fa-solid fa-plus me-2"></i>
                  Continue Shopping
                </Link>
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="cart-button checkout-btn"
                >
                  {loading ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin me-2"></i>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-lock me-2"></i>
                      Proceed to Payment
                    </>
                  )}
                </button>
              </div>

              {/* Payment Methods */}
              <div className="payment-methods">
                <p>We Accept:</p>
                <div className="payment-icons">
                  <i className="fa-brands fa-cc-visa"></i>
                  <i className="fa-brands fa-cc-mastercard"></i>
                  <i className="fa-brands fa-cc-amex"></i>
                  <i className="fa-brands fa-cc-paypal"></i>
                  <i className="fa-brands fa-cc-apple-pay"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="special-offers cart-gap cart-no-top">
        <div className="cart-container-wrapper">
          <h4 className="offers-title">
            <i className="fa-solid fa-gift me-2"></i>
            Special Offers for You
          </h4>
          <div className="offers-grid">
            <div className="offer-card">
              <div className="offer-icon">
                <i className="fa-solid fa-percent"></i>
              </div>
              <div className="offer-content">
                <h5>First Order Discount</h5>
                <p>Get 15% off on your first order</p>
              </div>
            </div>
            <div className="offer-card">
              <div className="offer-icon">
                <i className="fa-solid fa-utensils"></i>
              </div>
              <div className="offer-content">
                <h5>Free Appetizer</h5>
                <p>On orders above $40</p>
              </div>
            </div>
            <div className="offer-card">
              <div className="offer-icon">
                <i className="fa-solid fa-star"></i>
              </div>
              <div className="offer-content">
                <h5>Loyalty Points</h5>
                <p>Earn points on every order</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cart;