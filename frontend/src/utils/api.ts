import axios from 'axios';
import { ApiResponse } from '@/types';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const apiClient = {
  get: <T>(url: string) => api.get<ApiResponse<T>>(url).then(res => res.data),
  post: <T>(url: string, data?: any) => api.post<ApiResponse<T>>(url, data).then(res => res.data),
  put: <T>(url: string, data?: any) => api.put<ApiResponse<T>>(url, data).then(res => res.data),
  delete: <T>(url: string) => api.delete<ApiResponse<T>>(url).then(res => res.data),
};

export default api;
