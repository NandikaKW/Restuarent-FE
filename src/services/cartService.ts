import { api } from './api';
import type { Cart, AddToCartData, UpdateCartData } from '../types/cart';

export const cartService = {
  getCart: async (): Promise<Cart> => {
    const response = await api.get<Cart>('/cart');
    return response.data;
  },

  updateCart: async (cartData: UpdateCartData): Promise<Cart> => {
    const response = await api.put<Cart>('/cart', cartData);
    return response.data;
  },

  addToCart: async (itemData: AddToCartData): Promise<Cart> => {
    const response = await api.post<Cart>('/cart/add', itemData);
    return response.data;
  },

  clearCart: async (): Promise<Cart> => {
    const response = await api.delete<Cart>('/cart/clear');
    return response.data;
  },
};