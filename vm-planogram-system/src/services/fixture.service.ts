import axios from 'axios';
import { Fixture, ApiResponse } from '../types';

const API_BASE_URL = '/api';

interface GetFixturesParams {
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

interface FixturesResponse {
  data: Fixture[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

class FixtureService {
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

  async getFixtures(params: GetFixturesParams = {}): Promise<FixturesResponse> {
    try {
      const queryParams = new URLSearchParams();

      if (params.category) queryParams.set('category', params.category);
      if (params.search) queryParams.set('search', params.search);
      if (params.limit) queryParams.set('limit', params.limit.toString());
      if (params.offset) queryParams.set('offset', params.offset.toString());

      const response = await this.axiosInstance.get<FixturesResponse>(
        `/fixtures?${queryParams.toString()}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch fixtures');
    }
  }

  async getCategories(): Promise<ApiResponse<{ name: string; count: number }[]>> {
    try {
      const response = await this.axiosInstance.get<ApiResponse<{ name: string; count: number }[]>>(
        '/fixtures/categories'
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch categories');
    }
  }

  async getFixture(id: string): Promise<ApiResponse<Fixture>> {
    try {
      const response = await this.axiosInstance.get<ApiResponse<Fixture>>(`/fixtures/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch fixture');
    }
  }

  async createFixture(fixtureData: Partial<Fixture>): Promise<ApiResponse<Fixture>> {
    try {
      const response = await this.axiosInstance.post<ApiResponse<Fixture>>('/fixtures', fixtureData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create fixture');
    }
  }

  async updateFixture(id: string, fixtureData: Partial<Fixture>): Promise<ApiResponse<Fixture>> {
    try {
      const response = await this.axiosInstance.put<ApiResponse<Fixture>>(`/fixtures/${id}`, fixtureData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update fixture');
    }
  }

  async deleteFixture(id: string): Promise<void> {
    try {
      await this.axiosInstance.delete(`/fixtures/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete fixture');
    }
  }
}

export const fixtureService = new FixtureService();