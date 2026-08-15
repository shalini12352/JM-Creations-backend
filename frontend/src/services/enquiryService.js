import { apiRequest } from './api';

export const enquiryService = {
  // POST /api/enquiries
  create: async (data) => {
    return await apiRequest('/api/enquiries', 'POST', data);
  },

  // GET /api/enquiries
  getAll: async () => {
    return await apiRequest('/api/enquiries', 'GET');
  }
};
