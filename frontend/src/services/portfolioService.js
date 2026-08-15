import { apiRequest } from './api';

export const portfolioService = {
  // GET /api/portfolio
  getAll: async () => {
    return await apiRequest('/api/portfolio', 'GET');
  },

  // GET /api/portfolio/:id
  getById: async (id) => {
    return await apiRequest(`/api/portfolio/${id}`, 'GET');
  },

  // POST /api/portfolio
  create: async (data) => {
    return await apiRequest('/api/portfolio', 'POST', data);
  },

  // PUT /api/portfolio/:id
  update: async (id, data) => {
    return await apiRequest(`/api/portfolio/${id}`, 'PUT', data);
  },

  // DELETE /api/portfolio/:id
  delete: async (id) => {
    return await apiRequest(`/api/portfolio/${id}`, 'DELETE');
  }
};
