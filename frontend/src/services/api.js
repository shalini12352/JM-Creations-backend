const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Generic fetch wrapper with JSON handling and error handling
 */
export async function apiRequest(endpoint, method = 'GET', data = null) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    if (!response.ok) {
      const errorMsg = result.message || `Request failed with status ${response.status}`;
      const error = new Error(errorMsg);
      error.status = response.status;
      error.data = result;
      throw error;
    }

    return result;
  } catch (err) {
    if (!err.status) {
      console.error(`Network or Server error connecting to ${url}:`, err);
      const networkErr = new Error('Unable to connect to the backend server.');
      networkErr.status = 500;
      throw networkErr;
    }
    throw err;
  }
}
