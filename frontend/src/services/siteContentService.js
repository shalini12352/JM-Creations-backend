import api from './api';

export const siteContentService = {
  getSiteContent: async () => {
    return await api.get('/site-content');
  },
  createSiteContent: async (data) => {
    return await api.post('/site-content', data);
  },
  updateSiteContent: async (data) => {
    return await api.put('/site-content', data);
  },
};

export default siteContentService;
