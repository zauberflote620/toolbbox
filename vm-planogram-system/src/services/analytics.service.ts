import axios from 'axios';
import { AnalyticsInsight, PlacementRule, ApiResponse } from '../types';

const API_BASE_URL = '/api';

interface ParseAnalyticsResponse {
  originalText: string;
  insights: AnalyticsInsight[];
  confidence: number;
}

interface GenerateRulesResponse {
  rules: PlacementRule[];
  storeId?: string;
  generatedAt: string;
}

class AnalyticsService {
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

  async parseAnalytics(text: string, storeId?: string): Promise<ApiResponse<ParseAnalyticsResponse>> {
    try {
      const response = await this.axiosInstance.post<ApiResponse<ParseAnalyticsResponse>>('/analytics/parse', {
        text,
        storeId
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to parse analytics');
    }
  }

  async generateRules(insights: AnalyticsInsight[], storeId?: string): Promise<ApiResponse<GenerateRulesResponse>> {
    try {
      const response = await this.axiosInstance.post<ApiResponse<GenerateRulesResponse>>('/analytics/generate-rules', {
        insights,
        storeId: storeId || 'temp-store-id' // Temporary for demo
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to generate rules');
    }
  }
}

export const analyticsService = new AnalyticsService();