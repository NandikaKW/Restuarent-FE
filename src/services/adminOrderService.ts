import { api } from './api';
import type { Order, OrderStats, UpdateOrderResponse } from '../types/admin';

export const adminOrderService = {
  getAllOrders: async (): Promise<Order[]> => {
    const response = await api.get<Order[]>('/admin/orders');
    console.log('Raw API response for orders:', response.data);
    return response.data;
  },

  updateOrderStatus: async (orderId: string, status: Order['status']): Promise<UpdateOrderResponse> => {
    const response = await api.patch<UpdateOrderResponse>(`/admin/orders/${orderId}/status`, { status });
    console.log('Update order status response:', response.data);
    return response.data;
  },

  getOrderStats: async (): Promise<OrderStats> => {
    const response = await api.get<OrderStats>('/admin/orders/stats');
    return response.data;
  },
};