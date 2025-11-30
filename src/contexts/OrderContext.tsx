import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { Order } from '../types/order';
import { orderService } from '../services/orderService';

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  error: string | null;
  placeOrder: () => Promise<Order>;
  getOrderHistory: () => Promise<void>;
  clearError: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const placeOrder = async (): Promise<Order> => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.placeOrder();
      // Refresh order history after placing order
      await getOrderHistory();
      return response.order;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to place order';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getOrderHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const orderHistory = await orderService.getOrderHistory();
      setOrders(orderHistory);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch order history';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    orders,
    loading,
    error,
    placeOrder,
    getOrderHistory,
    clearError,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};