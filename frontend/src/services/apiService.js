/**
 * API Service for React Frontend
 * Handles all communication with the Django backend
 * Automatically uses the correct API base URL based on environment
 */

// Determine API base URL based on environment
const getApiBaseUrl = () => {
  // Check if we're in development (Vite dev server with proxy)
  if (import.meta.env.DEV) {
    return '/api'; // Use Vite proxy: /api -> http://127.0.0.1:8000/api
  }
  
  // Production: Use backend API directly
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const port = window.location.port ? `:${window.location.port}` : '';
  return `${protocol}//${hostname}${port}/api`;
};

const API_BASE_URL = getApiBaseUrl();

console.log(`🔗 API Service initialized. Base URL: ${API_BASE_URL}`);

// --- CSRF helpers (Django session auth) ---
const getCsrfFromCookie = () =>
  document.cookie
    .split('; ')
    .find((r) => r.startsWith('csrftoken='))
    ?.split('=')[1] || '';

const ensureCsrfCookie = async () => {
  if (getCsrfFromCookie()) return;
  try {
    // This endpoint sets csrftoken cookie; safe to call repeatedly.
    await fetch(`${API_BASE_URL}/auth/csrf/`, { credentials: 'include' });
  } catch {
    // ignore; subsequent requests may still succeed for csrf_exempt endpoints
  }
};

/**
 * Generic fetch wrapper with error handling
 */
const fetchWithErrorHandling = async (url, options = {}) => {
  const method = (options.method || 'GET').toUpperCase();
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const isUnsafeMethod = !['GET', 'HEAD', 'OPTIONS', 'TRACE'].includes(method);

  // For session-authenticated unsafe methods, Django requires CSRF.
  if (isUnsafeMethod) {
    await ensureCsrfCookie();
  }

  const defaultHeaders = {
    Accept: 'application/json',
  };

  // Only set JSON content-type when we're actually sending JSON.
  if (!isFormData && options.body != null) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  // Add token-based auth if available
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    defaultHeaders['Authorization'] = `Token ${token}`;
  }

  const csrfToken = isUnsafeMethod ? getCsrfFromCookie() : '';
  if (csrfToken) {
    defaultHeaders['X-CSRFToken'] = csrfToken;
  }

  const mergedOptions = {
    credentials: 'include', // Include cookies for CSRF and session auth
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  };

  const fullUrl = `${API_BASE_URL}${url}`;

  console.log(`📡 API Request: ${method} ${url}`);

  try {
    const response = await fetch(fullUrl, mergedOptions);

    // Handle non-OK responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(
        errorData.detail || errorData.message || `HTTP ${response.status}`
      );
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    const data = await response.json();
    console.log(`✅ API Response: ${response.status}`, data);
    return data;
  } catch (error) {
    console.error(`❌ API Error: ${error.message}`, error);
    throw error;
  }
};

/**
 * PRODUCTS API
 */
export const productsAPI = {
  // Get all products with optional filters
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/products/?${queryString}` : '/products/';
    return fetchWithErrorHandling(url);
  },

  // Get single product by slug
  getBySlug: async (slug) => {
    return fetchWithErrorHandling(`/products/${slug}/`);
  },

  // Get products by category
  getByCategory: async (category) => {
    return fetchWithErrorHandling(`/products/?category=${category}`);
  },

  // Get best sellers
  getBestSellers: async () => {
    return fetchWithErrorHandling('/products/?bestseller=true');
  },
};

/**
 * CATEGORIES API
 */
export const categoriesAPI = {
  // Get all categories
  getAll: async () => {
    return fetchWithErrorHandling('/categories/');
  },

  // Get category by slug
  getBySlug: async (slug) => {
    return fetchWithErrorHandling(`/categories/${slug}/`);
  },
};

/**
 * CART API
 */
export const cartAPI = {
  // Get current cart
  get: async () => {
    return fetchWithErrorHandling('/cart/');
  },

  // Add item to cart
  addItem: async (productId, quantity = 1) => {
    return fetchWithErrorHandling('/cart/add/', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity }),
    });
  },

  // Remove item from cart
  removeItem: async (itemId) => {
    return fetchWithErrorHandling(`/cart/remove/${itemId}/`, {
      method: 'DELETE',
    });
  },
};

/**
 * ORDERS API
 */
export const ordersAPI = {
  // Get all orders for current user
  getAll: async () => {
    return fetchWithErrorHandling('/orders/');
  },

  // Get single order
  get: async (orderId) => {
    return fetchWithErrorHandling(`/orders/${orderId}/`);
  },

  // Create new order
  create: async (orderData) => {
    return fetchWithErrorHandling('/orders/', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },
};

/**
 * ARTICLES API (Blog)
 */
export const articlesAPI = {
  // Get all published articles
  getAll: async () => {
    return fetchWithErrorHandling('/articles/');
  },

  // Get article by slug
  getBySlug: async (slug) => {
    return fetchWithErrorHandling(`/articles/${slug}/`);
  },
};

/**
 * FAQS API
 */
export const faqsAPI = {
  // Get all FAQs
  getAll: async () => {
    return fetchWithErrorHandling('/faqs/');
  },
};

/**
 * CONTACT API
 */
export const contactAPI = {
  // Submit contact form
  submit: async (contactData) => {
    return fetchWithErrorHandling('/contact/', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  },
};

/**
 * OJAS GURUKUL API
 */
export const ojasGurukulAPI = {
  // Notify request for Ojas Gurukul updates
  notify: async (data) => {
    return fetchWithErrorHandling('/ojas-gurukul/notify/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

/**
 * PREBOOKING API
 */
export const prebookAPI = {
  // Pre-book a single product (existing backend endpoint)
  create: async (productId, quantity = 1) => {
    return fetchWithErrorHandling('/prebook/', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity }),
    });
  },

  // Pre-book the entire cart (added backend endpoint)
  createFromCart: async () => {
    return fetchWithErrorHandling('/prebook/cart/', {
      method: 'POST',
    });
  },
};

/**
 * AUTHENTICATION API
 */
export const authAPI = {
  // Get CSRF token
  getCsrfToken: async () => {
    return fetchWithErrorHandling('/auth/csrf/');
  },

  // Sign up
  signup: async (signupData) => {
    return fetchWithErrorHandling('/auth/signup/', {
      method: 'POST',
      body: JSON.stringify(signupData),
    });
  },

  // Login
  login: async (email, password) => {
    return fetchWithErrorHandling('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Logout
  logout: async () => {
    return fetchWithErrorHandling('/auth/logout/', {
      method: 'POST',
    });
  },

  // Check authentication status
  checkAuth: async () => {
    return fetchWithErrorHandling('/auth/check/');
  },

  // Get user profile
  getProfile: async () => {
    return fetchWithErrorHandling('/profile/');
  },

  // Google OAuth
  loginWithGoogle: async (idToken) => {
    return fetchWithErrorHandling('/auth/google/', {
      method: 'POST',
      body: JSON.stringify({ id_token: idToken }),
    });
  },

  // Forgot password
  forgotPassword: async (email) => {
    return fetchWithErrorHandling('/auth/forgot-password/', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Reset password
  resetPassword: async (uid, token, newPassword) => {
    return fetchWithErrorHandling('/auth/reset-password/', {
      method: 'POST',
      body: JSON.stringify({ uid, token, new_password: newPassword }),
    });
  },
};

/**
 * REBOOKINGS API
 */
export const rebookingsAPI = {
  // Get all rebookings
  getAll: async () => {
    return fetchWithErrorHandling('/rebookings/');
  },

  // Create rebooking
  create: async (rebookingData) => {
    return fetchWithErrorHandling('/rebookings/', {
      method: 'POST',
      body: JSON.stringify(rebookingData),
    });
  },
};

export default {
  productsAPI,
  categoriesAPI,
  cartAPI,
  ordersAPI,
  articlesAPI,
  faqsAPI,
  contactAPI,
  ojasGurukulAPI,
  authAPI,
  prebookAPI,
  rebookingsAPI,
};
