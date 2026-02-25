import React, { useState } from 'react';
import { usePayment } from '../contexts/PaymentContext';
import { type CardDetails } from '../types/payment';
import '../components/componentStyles/PaymentPopup.css';

interface PaymentPopupProps {
  orderId: string;
  amount: number;
  onClose: () => void;
  onSuccess: (paymentId: string) => void;
}

const PaymentPopup: React.FC<PaymentPopupProps> = ({
  orderId,
  amount,
  onClose,
  onSuccess
}) => {
  const { createPayment, loading, error, clearError } = usePayment();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'cash'>('card');
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      const paymentData = {
        orderId,
        paymentMethod,
        ...(paymentMethod === 'card' && { cardDetails })
      };

      const response = await createPayment(paymentData);
      onSuccess(response.payment.id);
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  const handleCardDetailChange = (field: keyof CardDetails, value: string) => {
    setCardDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="payment-popup-overlay">
      <div className="payment-popup-container">
        
        {/* Header - Fixed */}
        <div className="payment-popup-header">
          <div className="payment-title">
            <div className="payment-icon">
              <i className="fa-solid fa-lock fa-lg ssl-icon"></i>
            </div>
            <div>
              <h2>Secure Payment</h2>
              <p className="payment-subtitle">
                <i className="fa-solid fa-shield-check ssl-text-icon"></i>
                256-bit SSL Encrypted Connection
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="payment-close-btn"
            disabled={loading}
            aria-label="Close payment popup"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="payment-popup-content">
          {/* Order Summary */}
          <div className="payment-order-summary">
            <div className="summary-header">
              <i className="fa-solid fa-receipt"></i>
              <div>
                <h3>Order Summary</h3>
                <p className="summary-subtitle">Your payment details</p>
              </div>
            </div>
            <div className="summary-content">
              <div className="summary-row">
                <span className="summary-label">Order ID:</span>
                <span className="summary-value">{orderId.slice(-8)}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Payment Amount:</span>
                <span className="summary-value amount">${amount.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Status:</span>
                <span className="summary-value status-pending">
                  <i className="fa-solid fa-clock me-2"></i>
                  Awaiting Payment
                </span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="payment-error-message" role="alert">
              <div className="error-content">
                <i className="fa-solid fa-exclamation-triangle"></i>
                <div>
                  <h4>Payment Error</h4>
                  <p>{error}</p>
                </div>
              </div>
              <button onClick={clearError} className="error-dismiss" aria-label="Dismiss error">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          )}

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="payment-form">
            {/* Payment Method Selection */}
            <div className="payment-method-section">
              <div className="section-header">
                <i className="fa-solid fa-credit-card"></i>
                <h3>Select Payment Method</h3>
              </div>
              <div className="payment-methods-grid">
                <button
                  type="button"
                  className={`payment-method-card ${paymentMethod === 'card' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                  aria-pressed={paymentMethod === 'card'}
                >
                  <div className="method-icon">
                    <i className="fa-solid fa-credit-card"></i>
                  </div>
                  <div className="method-info">
                    <h4>Credit/Debit Card</h4>
                    <p>Pay with Visa, Mastercard, etc.</p>
                  </div>
                  {paymentMethod === 'card' && (
                    <div className="method-check">
                      <i className="fa-solid fa-check"></i>
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  className={`payment-method-card ${paymentMethod === 'paypal' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('paypal')}
                  aria-pressed={paymentMethod === 'paypal'}
                >
                  <div className="method-icon paypal">
                    <i className="fa-brands fa-paypal"></i>
                  </div>
                  <div className="method-info">
                    <h4>PayPal</h4>
                    <p>Secure online payments</p>
                  </div>
                  {paymentMethod === 'paypal' && (
                    <div className="method-check">
                      <i className="fa-solid fa-check"></i>
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  className={`payment-method-card ${paymentMethod === 'cash' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('cash')}
                  aria-pressed={paymentMethod === 'cash'}
                >
                  <div className="method-icon cash">
                    <i className="fa-solid fa-money-bill-wave"></i>
                  </div>
                  <div className="method-info">
                    <h4>Direct Cash</h4>
                    <p>Pay directly with cash</p>
                  </div>
                  {paymentMethod === 'cash' && (
                    <div className="method-check">
                      <i className="fa-solid fa-check"></i>
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Card Details */}
            {paymentMethod === 'card' && (
              <div className="card-details-section">
                <div className="section-header">
                  <i className="fa-solid fa-id-card"></i>
                  <h3>Card Information</h3>
                </div>
                
                <div className="form-group">
                  <label htmlFor="cardNumber" className="form-label">
                    <i className="fa-solid fa-credit-card me-2"></i>
                    Card Number
                  </label>
                  <div className="input-with-icon">
                    <i className="input-icon fa-solid fa-credit-card"></i>
                    <input
                      id="cardNumber"
                      type="text"
                      value={formatCardNumber(cardDetails.cardNumber)}
                      onChange={(e) => handleCardDetailChange('cardNumber', e.target.value)}
                      className="form-input"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      required
                      aria-label="Card number"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="cardHolder" className="form-label">
                    <i className="fa-solid fa-user me-2"></i>
                    Card Holder Name
                  </label>
                  <div className="input-with-icon">
                    <i className="input-icon fa-solid fa-user"></i>
                    <input
                      id="cardHolder"
                      type="text"
                      value={cardDetails.cardHolder}
                      onChange={(e) => handleCardDetailChange('cardHolder', e.target.value)}
                      className="form-input"
                      placeholder="John Doe"
                      required
                      aria-label="Card holder name"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="expiryDate" className="form-label">
                      <i className="fa-solid fa-calendar me-2"></i>
                      Expiry Date
                    </label>
                    <div className="input-with-icon">
                      <i className="input-icon fa-solid fa-calendar"></i>
                      <input
                        id="expiryDate"
                        type="text"
                        value={formatExpiryDate(cardDetails.expiryDate)}
                        onChange={(e) => handleCardDetailChange('expiryDate', e.target.value)}
                        className="form-input"
                        placeholder="MM/YY"
                        maxLength={5}
                        required
                        aria-label="Expiry date"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="cvv" className="form-label">
                      <i className="fa-solid fa-shield me-2"></i>
                      CVV
                    </label>
                    <div className="input-with-icon">
                      <i className="input-icon fa-solid fa-shield"></i>
                      <input
                        id="cvv"
                        type="password"
                        value={cardDetails.cvv}
                        onChange={(e) => handleCardDetailChange('cvv', e.target.value)}
                        className="form-input"
                        placeholder="123"
                        maxLength={3}
                        required
                        aria-label="CVV security code"
                      />
                    </div>
                  </div>
                </div>

                <div className="card-security-note">
                  <i className="fa-solid fa-lock"></i>
                  <p>Your card details are secured with 256-bit SSL encryption</p>
                </div>
              </div>
            )}

            {/* PayPal Message */}
            {paymentMethod === 'paypal' && (
              <div className="payment-method-message paypal-message">
                <div className="message-icon">
                  <i className="fa-brands fa-paypal"></i>
                </div>
                <div className="message-content">
                  <h4>Redirecting to PayPal</h4>
                  <p>You will be securely redirected to PayPal to complete your payment. Click "Complete Payment" to proceed.</p>
                </div>
              </div>
            )}

            {/* Cash Message */}
            {paymentMethod === 'cash' && (
              <div className="payment-method-message cash-message">
                <div className="message-icon">
                  <i className="fa-solid fa-money-bill-wave"></i>
                </div>
                <div className="message-content">
                  <h4>Direct Cash Payment</h4>
                  <p>Pay directly with cash at the time of purchase.</p>
                </div>
              </div>
            )}

            {/* Action Buttons - Fixed at bottom */}
            <div className="payment-actions-sticky">
              <div className="payment-actions">
                <button
                  type="button"
                  onClick={onClose}
                  className="button button-outline"
                  disabled={loading}
                >
                  <i className="fa-solid fa-arrow-left me-2"></i>
                  Cancel Payment
                </button>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="button payment-submit-btn green-border-btn"
                  aria-label={`Complete payment of $${amount.toFixed(2)}`}
                >
                  {loading ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin me-2"></i>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-lock me-2"></i>
                      Complete Payment
                      <span className="payment-amount">${amount.toFixed(2)}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentPopup;