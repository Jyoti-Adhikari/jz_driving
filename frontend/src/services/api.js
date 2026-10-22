const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Custom API Error class to expose HTTP status and backend message
 */
export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Universal request wrapper around browser native fetch
 *
 * @param {string} endpoint - API path (e.g. '/auth/login' or 'courses')
 * @param {object} options - Standard fetch options + custom body
 * @returns {Promise<any>}
 */
export async function request(endpoint, options = {}) {
  const { headers = {}, body, ...customConfig } = options;

  const config = {
    method: customConfig.method || (body ? 'POST' : 'GET'),
    headers: { ...headers },
    ...customConfig,
  };

  // Attach token from localStorage if present and not already provided
  const token = localStorage.getItem('token');
  if (token && !config.headers['Authorization']) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  // Handle FormData vs JSON bodies
  if (body !== undefined && body !== null) {
    if (body instanceof FormData) {
      config.body = body;
      // Let the browser set multipart/form-data boundary automatically
      delete config.headers['Content-Type'];
    } else {
      config.headers['Content-Type'] = 'application/json';
      config.body = typeof body === 'string' ? body : JSON.stringify(body);
    }
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${cleanEndpoint}`;

  let response;
  try {
    response = await fetch(url, config);
  } catch (networkError) {
    throw new ApiError(
      networkError.message || 'Network error: unable to connect to server',
      0,
      null
    );
  }

  // Parse JSON response if available, otherwise return text
  let data = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    try {
      data = await response.text();
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const message =
      (data && typeof data === 'object' && data.message)
        ? data.message
        : (typeof data === 'string' && data.length > 0)
          ? data
          : `Request failed with status ${response.status}`;

    throw new ApiError(message, response.status, data);
  }

  return data;
}

export const api = {
  get: (endpoint, options = {}) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PUT', body }),
  delete: (endpoint, options = {}) => request(endpoint, { ...options, method: 'DELETE' }),
  request,
};

export default api;
