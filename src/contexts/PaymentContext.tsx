import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { paymentService } from '../services/paymentService';
import type { PaymentData, PaymentResponse, PaymentStatus } from '../types/payment';

interface PaymentContextType {
  createPayment: (data: PaymentData) => Promise<PaymentResponse>;
  getPaymentStatus: (paymentId: string) => Promise<PaymentStatus>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

interface PaymentProviderProps {
  children: ReactNode;
}

export const PaymentProvider: React.FC<PaymentProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPayment = async (data: PaymentData): Promise<PaymentResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await paymentService.createPayment(data);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Payment failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getPaymentStatus = async (paymentId: string): Promise<PaymentStatus> => {
    setLoading(true);
    try {
      return await paymentService.getPaymentStatus(paymentId);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to get payment status';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    createPayment,
    getPaymentStatus,
    loading,
    error,
    clearError,
  };

  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
};