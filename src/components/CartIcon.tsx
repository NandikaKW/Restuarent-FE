import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const CartIcon: React.FC = () => {
  const { cart } = useCart();

  const totalItems = cart?.totalItems || 0;

  return (
    <Link
      to="/cart"
      className="relative inline-flex items-center p-2 text-sm font-medium text-center text-gray-700 hover:text-blue-600 transition duration-200"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
          {totalItems}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;