import axios from 'axios';
import { Planogram, CreatePlanogramRequest, ApiResponse } from '../types';

const API_BASE_URL = '/api';

class PlanogramService {
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

  async getPlanograms(storeId?: string): Promise<ApiResponse<Planogram[]>> {
    try {
      const url = storeId ? `/planograms?storeId=${storeId}` : '/planograms';
      const response = await this.axiosInstance.get<ApiResponse<Planogram[]>>(url);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch planograms');
    }
  }

  async getPlanogram(id: string): Promise<ApiResponse<Planogram>> {
    try {
      const response = await this.axiosInstance.get<ApiResponse<Planogram>>(`/planograms/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch planogram');
    }
  }

  async createPlanogram(planogramData: CreatePlanogramRequest): Promise<ApiResponse<Planogram>> {
    try {
      const response = await this.axiosInstance.post<ApiResponse<Planogram>>('/planograms', planogramData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create planogram');
    }
  }

  async updatePlanogram(id: string, planogramData: Partial<Planogram>): Promise<ApiResponse<Planogram>> {
    try {
      const response = await this.axiosInstance.put<ApiResponse<Planogram>>(`/planograms/${id}`, planogramData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update planogram');
    }
  }

  async deletePlanogram(id: string): Promise<void> {
    try {
      await this.axiosInstance.delete(`/planograms/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete planogram');
    }
  }
}

export const planogramService = new PlanogramService();