import api from './api';

export const careerService = {
  getCareers: async (params = {}) => {
    return await api.get('/careers', { params });
  },
  getCareerById: async (id) => {
    return await api.get(`/careers/${id}`);
  },
  createCareer: async (data) => {
    return await api.post('/careers', data);
  },
  updateCareer: async (id, data) => {
    return await api.put(`/careers/${id}`, data);
  },
  deleteCareer: async (id) => {
    return await api.delete(`/careers/${id}`);
  },
};

export default careerService;
