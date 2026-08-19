import api from './api';

export const portfolioService = {
  getPortfolio: async () => {
    return await api.get('/portfolio');
  },
  getPortfolioById: async (id) => {
    return await api.get(`/portfolio/${id}`);
  },
  createPortfolio: async (data) => {
    return await api.post('/portfolio', data);
  },
  updatePortfolio: async (id, data) => {
    return await api.put(`/portfolio/${id}`, data);
  },
  deletePortfolio: async (id) => {
    return await api.delete(`/portfolio/${id}`);
  },
};

export default portfolioService;
