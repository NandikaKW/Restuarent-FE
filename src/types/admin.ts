export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Order {
  _id: string;
  userId: string | OrderUser;
  items: OrderItem[];
  totalPrice: number;
  totalItems: number;
  status: 'pending' | 'preparing' | 'completed' | 'cancelled';
  paymentId?: string | PaymentInfo;
  createdAt: string;
  updatedAt: string;
}
export interface PaymentInfo {
  _id: string;
  status: 'pending' | 'success' | 'failed';
  paymentMethod: 'card' | 'paypal' | 'cash';
  amount: number;
  createdAt: string;
  paymentDate?: string;
}
export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  preparingOrders: number;
  completedOrders: number;
  todayRevenue: number;
}

// Make sure this interface matches your backend response exactly
export interface UpdateOrderResponse {
  message: string;
  order: Order; // This should contain the updated order object
}
export interface AdminUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  totalUsers: number;
  adminUsers: number;
  regularUsers: number;
  usersToday: number;
}

export interface UpdateUserRoleResponse {
  message: string;
  user: AdminUser;
}
export interface AdminUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  totalUsers: number;
  adminUsers: number;
  regularUsers: number;
  usersToday: number;
}
export interface CreateUserResponse {
  message: string;
  user: AdminUser;
}