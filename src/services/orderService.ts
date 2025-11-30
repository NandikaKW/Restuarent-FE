import { api } from './api';
import type { Order, PlaceOrderResponse } from '../types/order';

export const orderService = {
  placeOrder: async (): Promise<PlaceOrderResponse> => {
    const response = await api.post<PlaceOrderResponse>('/orders/place');
    console.log('Place Order Response:', response.data); // Add this line
    return response.data;
  },

  getOrderHistory: async (): Promise<Order[]> => {
    const response = await api.get<Order[]>('/orders/history');
    console.log('Order History Response:', response.data); // Add this line
    return response.data;
  },

  getOrderById: async (orderId: string): Promise<Order> => {
    const response = await api.get<Order>(`/orders/${orderId}`);
    return response.data;
  },
};