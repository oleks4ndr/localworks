import axios from 'axios';

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

export default api;

// ===== AUTH API =====

export async function register(name, email, password, role = 'user') {
  const response = await api.post('/auth/register', { name, email, password, role });
  return response.data;
}

export async function login(email, password) {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
}

export async function logout() {
  const response = await api.post('/auth/logout');
  return response.data;
}

export async function getCurrentUser() {
  const response = await api.get('/auth/me');
  return response.data;
}

// ===== OTHER TO DO FUNCS =====

export async function testAPI() {
  const response = await api.get('/api');
  return response.data;
}