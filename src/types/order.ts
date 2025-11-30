export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  _id?: string;  // MongoDB uses _id
  id?: string;   // Some APIs might use id
  userId: string;
  items: OrderItem[];
  totalPrice: number;
  totalItems: number;
  status: 'pending' | 'preparing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface PlaceOrderResponse {
  message: string;
  order: Order;
}