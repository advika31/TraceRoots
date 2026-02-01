import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.1.8:8081'; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("[API Error]", error.response.status, error.response.data);
    } else if (error.request) {
      console.error("[API Network Error] Could not reach server at " + API_URL);
      console.error("1. Check if Laptop and Phone are on same Wi-Fi.");
      console.error("2. Check if Firewall is blocking Port 8000.");
    } else {
      console.error("[API Error]", error.message);
    }
    return Promise.reject(error);
  }
);

export const AuthAPI = {
  signup: async (userData: any) => {
    const response = await api.post('/farmers/signup', userData);
    return response.data;
  },
  login: async (credentials: any) => {
    const response = await api.post('/farmers/login', credentials);
    return response.data;
  },
};

export const CollectorAPI = {
  getStats: async (userId: number) => {
    const res = await api.get(`/farmers/${userId}/stats`);
    return res.data;
  },
  uploadBatch: async (formData: FormData) => {
    const response = await api.post('/batches/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  getHistory: async (userId: number) => {
    const res = await api.get(`/batches/farmer/${userId}`);
    return res.data;
  }
};

export default api;