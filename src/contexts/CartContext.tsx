import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Cart, CartItem, AddToCartData, UpdateCartData } from '../types/cart';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  getCart: () => Promise<void>;
  addToCart: (itemData: AddToCartData) => Promise<void>;
  updateCartItem: (menuItemId: string, quantity: number) => Promise<void>;
  removeFromCart: (menuItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  clearError: () => void; 
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const getCart = async () => {
    if (!user) {
      setCart(null);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const cartData = await cartService.getCart();
      setCart(cartData);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch cart';
      setError(errorMessage);
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (itemData: AddToCartData) => {
    if (!user) throw new Error('User must be logged in to add to cart');
    
    setLoading(true);
    setError(null);
    try {
      const updatedCart = await cartService.addToCart(itemData);
      setCart(updatedCart);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to add item to cart';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (menuItemId: string, quantity: number) => {
    if (!cart) return;

    const updatedItems = cart.items.map(item =>
      item.menuItemId === menuItemId ? { ...item, quantity } : item
    ).filter(item => item.quantity > 0);

    await updateCart({ items: updatedItems });
  };

  const removeFromCart = async (menuItemId: string) => {
    await updateCartItem(menuItemId, 0);
  };

  const updateCart = async (cartData: UpdateCartData) => {
    if (!user) throw new Error('User must be logged in to update cart');
    
    setLoading(true);
    setError(null);
    try {
      const updatedCart = await cartService.updateCart(cartData);
      setCart(updatedCart);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update cart';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const updatedCart = await cartService.clearCart();
      setCart(updatedCart);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to clear cart';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refreshCart = async () => {
    await getCart();
  };

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    if (user) {
      getCart();
    } else {
      setCart(null);
      setError(null);
    }
  }, [user]);

  const value = {
    cart,
    loading,
    error,
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart,
    clearError, // Added this
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};