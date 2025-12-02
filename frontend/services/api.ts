/**
 * API Service for MobilePOS
 * Handles all HTTP requests to the backend API
 */

// Dynamic API URL based on current host
// This allows the app to work from localhost, PC IP, or mobile devices
const getApiUrl = () => {
  // If running in development mode on localhost, use localhost
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8000';
  }
  // Otherwise, use the same host as the frontend (for mobile access via IP)
  return `http://${window.location.hostname}:8000`;
};

const API_URL = getApiUrl();

// Debug: Log the API URL being used
console.log('🔗 API URL:', API_URL);
console.log('📱 Current hostname:', window.location.hostname);

// Helper function to get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// Helper function to make authenticated requests
async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });
}

// Authentication API
export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return handleResponse<{ access_token: string; token_type: string; role: string }>(response);
  },
};

// Products API
export const productsAPI = {
  getAll: async (searchQuery?: string) => {
    const url = searchQuery ? `/api/products?q=${encodeURIComponent(searchQuery)}` : '/api/products';
    const response = await fetchWithAuth(url);
    return handleResponse(response);
  },

  create: async (product: any) => {
    const response = await fetchWithAuth('/api/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
    return handleResponse(response);
  },

  update: async (id: number, product: any) => {
    const response = await fetchWithAuth(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
    return handleResponse(response);
  },

  delete: async (id: number) => {
    const response = await fetchWithAuth(`/api/products/${id}`, {
      method: 'DELETE',
    });
    if (response.status === 204) return;
    return handleResponse(response);
  },
};

// Tickets API
export const ticketsAPI = {
  getAll: async () => {
    const response = await fetchWithAuth('/api/tickets');
    return handleResponse(response);
  },

  getById: async (id: string) => {
    const response = await fetchWithAuth(`/api/tickets/${id}`);
    return handleResponse(response);
  },

  getDelinquents: async () => {
    const response = await fetchWithAuth('/api/tickets/delinquents');
    return handleResponse(response);
  },

  create: async (ticket: any) => {
    const response = await fetchWithAuth('/api/tickets', {
      method: 'POST',
      body: JSON.stringify(ticket),
    });
    return handleResponse(response);
  },

  markAsPaid: async (id: string) => {
    const response = await fetchWithAuth(`/api/tickets/${id}/pay`, {
      method: 'PUT',
    });
    return handleResponse(response);
  },
};

// Work Orders API
export const workOrdersAPI = {
  getAll: async (searchQuery?: string) => {
    const url = searchQuery ? `/api/work-orders?q=${encodeURIComponent(searchQuery)}` : '/api/work-orders';
    const response = await fetchWithAuth(url);
    return handleResponse(response);
  },

  create: async (workOrder: any) => {
    const response = await fetchWithAuth('/api/work-orders', {
      method: 'POST',
      body: JSON.stringify(workOrder),
    });
    return handleResponse(response);
  },

  update: async (id: string, workOrder: any) => {
    const response = await fetchWithAuth(`/api/work-orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(workOrder),
    });
    return handleResponse(response);
  },

  delete: async (id: string) => {
    const response = await fetchWithAuth(`/api/work-orders/${id}`, {
      method: 'DELETE',
    });
    if (response.status === 204) return;
    return handleResponse(response);
  },
};

// Parts API
export const partsAPI = {
  getAll: async (searchQuery?: string) => {
    const url = searchQuery ? `/api/parts?q=${encodeURIComponent(searchQuery)}` : '/api/parts';
    const response = await fetchWithAuth(url);
    return handleResponse(response);
  },

  create: async (part: any) => {
    const response = await fetchWithAuth('/api/parts', {
      method: 'POST',
      body: JSON.stringify(part),
    });
    return handleResponse(response);
  },

  update: async (id: number, part: any) => {
    const response = await fetchWithAuth(`/api/parts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(part),
    });
    return handleResponse(response);
  },

  delete: async (id: number) => {
    const response = await fetchWithAuth(`/api/parts/${id}`, {
      method: 'DELETE',
    });
    if (response.status === 204) return;
    return handleResponse(response);
  },
};

// Dashboard API
export const dashboardAPI = {
  getAdminSummary: async () => {
    const response = await fetchWithAuth('/api/dashboard/summary');
    return handleResponse(response);
  },

  getRepairsSummary: async () => {
    const response = await fetchWithAuth('/api/repairs/dashboard/summary');
    return handleResponse(response);
  },
};

// Export all APIs
export default {
  auth: authAPI,
  products: productsAPI,
  tickets: ticketsAPI,
  workOrders: workOrdersAPI,
  parts: partsAPI,
  dashboard: dashboardAPI,
};
