
const API_BASE_URL = 'http://localhost:5000/api';

// Auth token management
const getAuthToken = () => localStorage.getItem('token');
const setAuthToken = (token: string) => localStorage.setItem('token', token);
const removeAuthToken = () => localStorage.removeItem('token');

// Common fetch wrapper with auth
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
};

// Auth API
export const authAPI = {
  register: async (userData: { name: string; email: string; password: string }) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (response.token) {
      setAuthToken(response.token);
    }
    return response;
  },

  login: async (credentials: { email: string; password: string }) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (response.token) {
      setAuthToken(response.token);
    }
    return response;
  },

  logout: () => {
    removeAuthToken();
  },

  getCurrentUser: () => apiRequest('/auth/me'),
};

// Restaurants API
export const restaurantsAPI = {
  getAll: () => apiRequest('/restaurants'),
  getById: (id: string) => apiRequest(`/restaurants/${id}`),
  create: (data: any) => apiRequest('/restaurants', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`/restaurants/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/restaurants/${id}`, {
    method: 'DELETE',
  }),
};

// Menu API
export const menuAPI = {
  getAll: () => apiRequest('/menu'),
  getByRestaurant: (restaurantId: string) => apiRequest(`/menu/restaurant/${restaurantId}`),
  getById: (id: string) => apiRequest(`/menu/${id}`),
  create: (data: any) => apiRequest('/menu', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`/menu/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/menu/${id}`, {
    method: 'DELETE',
  }),
};

// Orders API
export const ordersAPI = {
  getAll: () => apiRequest('/orders'),
  getAdminOrders: () => apiRequest('/orders/admin'),
  getById: (id: string) => apiRequest(`/orders/${id}`),
  create: (data: any) => apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateStatus: (id: string, status: string) => apiRequest(`/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),
};

// Coupons API
export const couponsAPI = {
  getAll: () => apiRequest('/coupons'),
  validate: (code: string) => apiRequest('/coupons/validate', {
    method: 'POST',
    body: JSON.stringify({ code }),
  }),
  create: (data: any) => apiRequest('/coupons', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`/coupons/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/coupons/${id}`, {
    method: 'DELETE',
  }),
  use: (id: string) => apiRequest(`/coupons/${id}/use`, {
    method: 'POST',
  }),
};

// Payment API
export const paymentAPI = {
  createSession: (data: any) => apiRequest('/payment/create-session', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  verifyPayment: (sessionId: string) => apiRequest(`/payment/verify/${sessionId}`),
  getPaymentStatus: (orderId: string) => apiRequest(`/payment/status/${orderId}`),
};

export default {
  auth: authAPI,
  restaurants: restaurantsAPI,
  menu: menuAPI,
  orders: ordersAPI,
  coupons: couponsAPI,
  payment: paymentAPI,
};
