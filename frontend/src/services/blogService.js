import api from './api';

export const blogService = {
  getBlogs: async (params = {}) => {
    return await api.get('/blogs', { params });
  },
  getBlogBySlug: async (slug) => {
    return await api.get(`/blogs/slug/${slug}`);
  },
  getBlogById: async (id) => {
    return await api.get(`/blogs/${id}`);
  },
  createBlog: async (data) => {
    return await api.post('/blogs', data);
  },
  updateBlog: async (id, data) => {
    return await api.put(`/blogs/${id}`, data);
  },
  deleteBlog: async (id) => {
    return await api.delete(`/blogs/${id}`);
  },
};

export default blogService;
