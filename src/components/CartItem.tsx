import type { CartItem as CartItemType } from '../types/cart';
import { useCart } from '../contexts/CartContext';
import '../components/componentStyles/CartItem.css';


interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateCartItem, removeFromCart, loading } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(item.menuItemId);
    } else {
      updateCartItem(item.menuItemId, newQuantity);
    }
  };

  const subtotal = item.price * item.quantity;

  return (
    <div className="cart-item-card">
      {/* Item Image */}
      <div className="cart-item-image-container">
        <img
          src={item.image}
          alt={item.name}
          className="cart-item-image"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80';
          }}
        />
      </div>

      {/* Item Details */}
      <div className="cart-item-details">
        <div className="cart-item-header">
          <h3 className="cart-item-title">{item.name}</h3>
          <button
            onClick={() => removeFromCart(item.menuItemId)}
            disabled={loading}
            className="cart-remove-btn"
          >
            <i className="fa-solid fa-trash"></i>
          </button>
        </div>
        
        <div className="cart-item-price-section">
          <span className="cart-item-unit-price">
            ${item.price.toFixed(2)} each
          </span>
          <span className="cart-item-subtotal">
            ${subtotal.toFixed(2)}
          </span>
        </div>

        {/* Quantity Controls */}
        <div className="cart-quantity-controls">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={loading || item.quantity <= 1}
            className="cart-quantity-btn cart-quantity-minus"
          >
            <i className="fa-solid fa-minus"></i>
          </button>
          
          <div className="cart-quantity-display">
            <span className="cart-quantity-number">{item.quantity}</span>
            <span className="cart-quantity-label">Qty</span>
          </div>
          
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={loading}
            className="cart-quantity-btn cart-quantity-plus"
          >
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;