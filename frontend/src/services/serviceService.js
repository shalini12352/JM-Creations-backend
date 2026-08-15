import { apiRequest } from './api';

export const serviceService = {
  // GET /api/services
  getAll: async () => {
    return await apiRequest('/api/services', 'GET');
  },

  // GET /api/services/:id
  getById: async (id) => {
    return await apiRequest(`/api/services/${id}`, 'GET');
  },

  // POST /api/services
  create: async (data) => {
    return await apiRequest('/api/services', 'POST', data);
  },

  // PUT /api/services/:id
  update: async (id, data) => {
    return await apiRequest(`/api/services/${id}`, 'PUT', data);
  },

  // DELETE /api/services/:id
  delete: async (id) => {
    return await apiRequest(`/api/services/${id}`, 'DELETE');
  }
};
