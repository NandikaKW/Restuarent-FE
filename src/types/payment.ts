export interface CardDetails {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

export interface PaymentData {
  orderId: string;
  paymentMethod: 'card' | 'paypal' | 'cash';
  cardDetails?: CardDetails;
}

export interface PaymentResponse {
  message: string;
  payment: {
    id: string;
    orderId: string;
    amount: number;
    paymentMethod: 'card' | 'paypal' | 'cash';
    status: 'pending' | 'success' | 'failed';
  };
}

export interface PaymentStatus {
  paymentId: string;
  orderId: string;
  amount: number;
  status: 'pending' | 'success' | 'failed';
  paymentMethod: string;
  paymentDate: string;
}