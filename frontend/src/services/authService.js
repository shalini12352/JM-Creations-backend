import api from './api';

const TOKEN_KEY = 'jmc_token';
const USER_KEY = 'jmc_user';

export const authService = {
  // Login with email and password
  async login(email, password) {
    const data = await api.post('/auth/login', { email, password });
    if (data.success && data.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    }
    return data;
  },

  // Fetch current user from backend using saved token
  async getMe() {
    const token = this.getToken();
    if (!token) {
      throw { status: 401, message: 'No authentication token found' };
    }
    const data = await api.get('/auth/me');
    if (data.success && data.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    }
    return data;
  },

  // Logout admin
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore errors on logout
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      // Clean legacy auth flag if present
      localStorage.removeItem('jmc_admin_auth');
    }
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser() {
    try {
      const userStr = localStorage.getItem(USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated() {
    return !!this.getToken();
  }
};

export default authService;
