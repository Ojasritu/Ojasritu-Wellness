/**
 * API Configuration
 * Update these settings to manage backend connection
 */

// Environment detection
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

// API Base URLs
export const API_CONFIG = {
  // Development: Vite proxy routes to http://127.0.0.1:8000
  development: {
    baseUrl: '/api',
    description: 'Development (via Vite proxy)'
  },
  
  // Production: Direct backend API
  production: {
    baseUrl: `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/api`,
    description: 'Production (direct)'
  }
};

// Get current API base URL
export const getApiBaseUrl = () => {
  const config = isDevelopment ? API_CONFIG.development : API_CONFIG.production;
  return config.baseUrl;
};

// Timeout settings (milliseconds)
export const API_TIMEOUTS = {
  short: 5000,    // 5 seconds
  medium: 10000,  // 10 seconds
  long: 30000,    // 30 seconds
};

// Default fetch options
export const DEFAULT_FETCH_OPTIONS = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  credentials: 'include', // Include cookies for CSRF and session auth
};

// Retry configuration
export const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelayMs: 1000,
  backoffMultiplier: 2,
};

// Log all API requests in development
export const logApiRequests = isDevelopment;

console.log(`
╔════════════════════════════════════════╗
║   API CONFIGURATION INITIALIZED        ║
╠════════════════════════════════════════╣
║ Environment: ${isDevelopment ? 'DEVELOPMENT' : 'PRODUCTION     '}          ║
║ Base URL: ${getApiBaseUrl().padEnd(33)}║
║ ${isDevelopment ? 'Vite proxy → http://127.0.0.1:8000' : 'Direct backend connection         '}║
╚════════════════════════════════════════╝
`);
