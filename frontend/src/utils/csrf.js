// CSRF Token utility for Django backend

let csrfToken = null;

/**
 * Fetch CSRF token from Django backend
 * @returns {Promise<string>} CSRF token
 */
export async function getCSRFToken() {
  if (csrfToken) {
    return csrfToken;
  }

  try {
    const response = await fetch('/api/auth/csrf/', {
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      csrfToken = data.csrftoken;
      return csrfToken;
    }
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
  }

  // Fallback: try to get from cookie
  const cookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='));
  
  if (cookie) {
    csrfToken = cookie.split('=')[1];
    return csrfToken;
  }

  return null;
}

/**
 * Make a POST request with CSRF token
 * @param {string} url - API endpoint
 * @param {object} data - Request body data
 * @param {object} options - Additional fetch options
 * @returns {Promise<Response>}
 */
export async function postWithCSRF(url, data, options = {}) {
  const token = await getCSRFToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['X-CSRFToken'] = token;
  }

  return fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers,
    body: JSON.stringify(data),
    ...options,
  });
}

/**
 * Make a DELETE request with CSRF token
 * @param {string} url - API endpoint
 * @param {object} options - Additional fetch options
 * @returns {Promise<Response>}
 */
export async function deleteWithCSRF(url, options = {}) {
  const token = await getCSRFToken();
  
  const headers = {
    ...(options.headers || {}),
  };

  if (token) {
    headers['X-CSRFToken'] = token;
  }

  return fetch(url, {
    method: 'DELETE',
    credentials: 'include',
    headers,
    ...options,
  });
}

export default { getCSRFToken, postWithCSRF, deleteWithCSRF };
