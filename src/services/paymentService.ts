import { api } from './api';
import type { PaymentData, PaymentResponse, PaymentStatus } from '../types/payment';

export const paymentService = {
  // Create payment
  createPayment: async (paymentData: PaymentData): Promise<PaymentResponse> => {
    const response = await api.post('/payments/create', paymentData);
    return response.data;
  },

  // Get payment status
  getPaymentStatus: async (paymentId: string): Promise<PaymentStatus> => {
    const response = await api.get(`/payments/status/${paymentId}`);
    return response.data;
  },

  // Get payment history
  getPaymentHistory: async () => {
    const response = await api.get('/payments/history');
    return response.data;
  },

  // ADMIN: Get all payments
  getAllPayments: async () => {
    const response = await api.get('/payments/admin/all');
    return response.data;
  },

  // ADMIN: Update payment status
  updatePaymentStatus: async (paymentId: string, data: { status: string }) => {
    const response = await api.put(`/payments/admin/update/${paymentId}`, data);
    return response.data;
  },

  // Complete payment (for demo)
  completePayment: async (paymentId: string): Promise<PaymentStatus> => {
    const response = await api.post(`/payments/complete/${paymentId}`);
    return response.data;
  }
};