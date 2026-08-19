import api from './api';

export const analyticsService = {
  trackEvent: async (eventData) => {
    return await api.post('/analytics/track', eventData);
  },
  getStats: async (params = {}) => {
    return await api.get('/analytics/stats', { params });
  },
};

export default analyticsService;
