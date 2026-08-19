import api from './api';

export const serviceService = {
  getServices: async () => {
    return await api.get('/services');
  },
  getAll: async () => {
    return await api.get('/services');
  },
  getServiceById: async (id) => {
    return await api.get(`/services/${id}`);
  },
  createService: async (data) => {
    return await api.post('/services', data);
  },
  updateService: async (id, data) => {
    return await api.put(`/services/${id}`, data);
  },
  deleteService: async (id) => {
    return await api.delete(`/services/${id}`);
  },
};

export default serviceService;

