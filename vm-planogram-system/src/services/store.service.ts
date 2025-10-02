import axios from 'axios';
import { Store, CreateStoreRequest, ApiResponse } from '../types';

const API_BASE_URL = '/api';

class StoreService {
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getStores(): Promise<ApiResponse<Store[]>> {
    try {
      const response = await this.axiosInstance.get<ApiResponse<Store[]>>('/stores');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch stores');
    }
  }

  async getStore(id: string): Promise<ApiResponse<Store>> {
    try {
      const response = await this.axiosInstance.get<ApiResponse<Store>>(`/stores/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch store');
    }
  }

  async createStore(storeData: CreateStoreRequest): Promise<ApiResponse<Store>> {
    try {
      const response = await this.axiosInstance.post<ApiResponse<Store>>('/stores', storeData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create store');
    }
  }

  async updateStore(id: string, storeData: Partial<Store>): Promise<ApiResponse<Store>> {
    try {
      const response = await this.axiosInstance.put<ApiResponse<Store>>(`/stores/${id}`, storeData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update store');
    }
  }

  async deleteStore(id: string): Promise<void> {
    try {
      await this.axiosInstance.delete(`/stores/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete store');
    }
  }
}

export const storeService = new StoreService();