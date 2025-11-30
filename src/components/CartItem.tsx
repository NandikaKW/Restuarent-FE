import type { CartItem as CartItemType } from '../types/cart';
import { useCart } from '../contexts/CartContext';

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
    <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm border">
      <img
        src={item.image}
        alt={item.name}
        className="w-16 h-16 object-cover rounded-md"
      />
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-gray-900 truncate">
          {item.name}
        </h3>
        <p className="text-lg font-bold text-gray-900">${item.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={loading || item.quantity <= 1}
          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
        >
          <span className="text-lg font-semibold">-</span>
        </button>
        <span className="w-8 text-center font-semibold">{item.quantity}</span>
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          disabled={loading}
          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
        >
          <span className="text-lg font-semibold">+</span>
        </button>
      </div>
      <div className="text-right min-w-20">
        <p className="text-lg font-bold text-gray-900">${subtotal.toFixed(2)}</p>
        <button
          onClick={() => removeFromCart(item.menuItemId)}
          disabled={loading}
          className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50 transition duration-200"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;