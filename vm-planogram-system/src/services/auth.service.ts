import axios from 'axios';
import { User, ApiResponse } from '../types';

const API_BASE_URL = '/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

interface AuthResponse {
  user: User;
  message: string;
}

class AuthService {
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await this.axiosInstance.post<AuthResponse>('/auth/login', credentials);
      return response.data.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  }

  async register(userData: RegisterData): Promise<User> {
    try {
      const response = await this.axiosInstance.post<AuthResponse>('/auth/register', userData);
      return response.data.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  }

  async logout(): Promise<void> {
    try {
      await this.axiosInstance.post('/auth/logout');
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Logout failed');
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await this.axiosInstance.get<{ user: User }>('/auth/me');
      return response.data.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to get user');
    }
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await this.axiosInstance.put<AuthResponse>('/auth/profile', userData);
      return response.data.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Profile update failed');
    }
  }
}

export const authService = new AuthService();