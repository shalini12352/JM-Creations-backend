import api from './api';

export const enquiryService = {
  getEnquiries: async () => {
    return await api.get('/enquiries');
  },
  getEnquiryById: async (id) => {
    return await api.get(`/enquiries/${id}`);
  },
  createEnquiry: async (data) => {
    return await api.post('/enquiries', data);
  },
  updateEnquiry: async (id, data) => {
    return await api.put(`/enquiries/${id}`, data);
  },
  deleteEnquiry: async (id) => {
    return await api.delete(`/enquiries/${id}`);
  },
};

export default enquiryService;
