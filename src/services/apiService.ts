import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuthStore } from '../stores/authStore';

// Base API configuration
const baseConfig: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
};

// Create axios instance
const apiClient: AxiosInstance = axios.create(baseConfig);

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Get token from auth store
    const token = useAuthStore.getState().token;
    
    // If token exists, add to headers
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      // Logout user if token is invalid
      useAuthStore.getState().logout();
    }
    
    return Promise.reject(error);
  }
);

// API service with typed methods
export const apiService = {
  // Customer endpoints
  customers: {
    getAll: (): Promise<AxiosResponse<any>> => {
      return apiClient.get('/customers');
    },
    getById: (id: string): Promise<AxiosResponse<any>> => {
      return apiClient.get(`/customers/${id}`);
    },
    create: (data: any): Promise<AxiosResponse<any>> => {
      return apiClient.post('/customers', data);
    },
    update: (id: string, data: any): Promise<AxiosResponse<any>> => {
      return apiClient.put(`/customers/${id}`, data);
    },
    delete: (id: string): Promise<AxiosResponse<any>> => {
      return apiClient.delete(`/customers/${id}`);
    },
    import: (file: File): Promise<AxiosResponse<any>> => {
      const formData = new FormData();
      formData.append('file', file);
      
      return apiClient.post('/customers/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
  },
  
  // Order endpoints
  orders: {
    getAll: (): Promise<AxiosResponse<any>> => {
      return apiClient.get('/orders');
    },
    getById: (id: string): Promise<AxiosResponse<any>> => {
      return apiClient.get(`/orders/${id}`);
    },
    create: (data: any): Promise<AxiosResponse<any>> => {
      return apiClient.post('/orders', data);
    }
  },
  
  // Segment endpoints
  segments: {
    getAll: (): Promise<AxiosResponse<any>> => {
      return apiClient.get('/segments');
    },
    getById: (id: string): Promise<AxiosResponse<any>> => {
      return apiClient.get(`/segments/${id}`);
    },
    create: (data: any): Promise<AxiosResponse<any>> => {
      return apiClient.post('/segments', data);
    },
    update: (id: string, data: any): Promise<AxiosResponse<any>> => {
      return apiClient.put(`/segments/${id}`, data);
    },
    delete: (id: string): Promise<AxiosResponse<any>> => {
      return apiClient.delete(`/segments/${id}`);
    },
    calculateAudience: (rules: any): Promise<AxiosResponse<any>> => {
      return apiClient.post('/segments/calculate', { rules });
    }
  },
  
  // Campaign endpoints
  campaigns: {
    getAll: (): Promise<AxiosResponse<any>> => {
      return apiClient.get('/campaigns');
    },
    getById: (id: string): Promise<AxiosResponse<any>> => {
      return apiClient.get(`/campaigns/${id}`);
    },
    create: (data: any): Promise<AxiosResponse<any>> => {
      return apiClient.post('/campaigns', data);
    },
    send: (id: string): Promise<AxiosResponse<any>> => {
      return apiClient.post(`/campaigns/${id}/send`);
    },
    getStats: (id: string): Promise<AxiosResponse<any>> => {
      return apiClient.get(`/campaigns/${id}/stats`);
    }
  },
  
  // AI endpoints
  ai: {
    generateSegmentRules: (query: string): Promise<AxiosResponse<any>> => {
      return apiClient.post('/ai/generate-segment', { query });
    },
    generateCampaignMessages: (data: { 
      objective: string, 
      audience: string,
      productType?: string
    }): Promise<AxiosResponse<any>> => {
      return apiClient.post('/ai/generate-messages', data);
    },
    generateCampaignInsights: (campaignId: string): Promise<AxiosResponse<any>> => {
      return apiClient.get(`/ai/campaign-insights/${campaignId}`);
    },
    getSendTimeRecommendations: (): Promise<AxiosResponse<any>> => {
      return apiClient.get('/ai/send-time-recommendations');
    }
  }
};

export default apiService;