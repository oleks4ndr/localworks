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

export async function getMyProfile() {
  const response = await api.get('/api/profiles/me');
  return response.data.profile;
}

export async function createProfile(profileData) {
  const response = await api.post('/api/profiles', profileData);
  return response.data;
}

export async function updateProfile(profileId, profileData) {
  const response = await api.put(`/api/profiles/${profileId}`, profileData);
  return response.data;
}

export async function updateUserRole(userId) {
  const response = await api.patch(`/api/profiles/${userId}/role`);
  return response.data;
}

// ===== CONTACT MESSAGE FUNCTIONS =====

export async function sendContactMessage(messageData) {
  const response = await api.post('/api/contact-messages', messageData);
  return response.data;
}

export async function getReceivedMessages() {
  const response = await api.get('/api/contact-messages/received');
  return response.data.messages;
}

export async function markMessageAsRead(messageId) {
  const response = await api.patch(`/api/contact-messages/${messageId}/read`);
  return response.data;
}

export async function deleteContactMessage(messageId) {
  const response = await api.delete(`/api/contact-messages/${messageId}`);
  return response.data;
}

export async function getUnreadMessageCount() {
  const response = await api.get('/api/contact-messages/unread-count');
  return response.data.unreadCount;
}

export async function testAPI() {
  const response = await api.get('/api');
  return response.data;
}