import { api } from './api';
import type { AdminUser, UserStats, UpdateUserRoleResponse } from '../types/admin';

// Define the response type for createUser
export interface CreateUserResponse {
  message: string;
  user: AdminUser;
}

export const adminUserService = {
  // Get all users
  getAllUsers: async (): Promise<AdminUser[]> => {
    const response = await api.get<AdminUser[]>('/admin/users');
    return response.data;
  },

  // Get user statistics
  getUserStats: async (): Promise<UserStats> => {
    const response = await api.get<UserStats>('/admin/users/stats');
    return response.data;
  },

  // CREATE NEW USER (ADMIN DASHBOARD ONLY)
  createUser: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
  }): Promise<CreateUserResponse> => {
    const response = await api.post<CreateUserResponse>('/admin/users', userData);
    return response.data;
  },

  // Update user role
  updateUserRole: async (userId: string, role: 'user' | 'admin'): Promise<UpdateUserRoleResponse> => {
    const response = await api.patch<UpdateUserRoleResponse>(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  // Delete user
  deleteUser: async (userId: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/admin/users/${userId}`);
    return response.data;
  },
};