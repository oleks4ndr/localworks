import axios from 'axios';
import { getAuth } from 'firebase/auth';

// for dev: use vite proxy
// in prod: VITE_API_URL from env
const API_BASE = import.meta.env.VITE_API_URL || '';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach Firebase token
api.interceptors.request.use(
  async (config) => {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - could redirect to login
      console.error('Authentication error:', error.response.data);
    }
    return Promise.reject(error);
  }
);

export default api;

// ===== API FUNCTIONS =====

export async function getTradeProfiles() {
  const response = await api.get('/dashboard/profiles');
  return response.data.profiles;
}

export async function testAPI() {
  const response = await api.get('/api');
  return response.data;
}