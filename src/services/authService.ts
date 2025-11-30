import { api } from './api';
import type { LoginData, SignupData, AuthResponse } from '../types/auth';

export const authService = {
  login: async (loginData: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', loginData);
    return response.data;
  },

  signup: async (signupData: SignupData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/signup', signupData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};