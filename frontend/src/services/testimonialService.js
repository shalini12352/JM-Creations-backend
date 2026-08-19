import api from './api';

export const testimonialService = {
  getTestimonials: async () => {
    return await api.get('/testimonials');
  },
  getTestimonialById: async (id) => {
    return await api.get(`/testimonials/${id}`);
  },
  createTestimonial: async (data) => {
    return await api.post('/testimonials', data);
  },
  updateTestimonial: async (id, data) => {
    return await api.put(`/testimonials/${id}`, data);
  },
  deleteTestimonial: async (id) => {
    return await api.delete(`/testimonials/${id}`);
  },
};

export default testimonialService;
