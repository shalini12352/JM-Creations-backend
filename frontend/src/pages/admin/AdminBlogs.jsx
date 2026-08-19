import React, { useState, useEffect } from 'react';
import { FileText, Plus, Edit, Trash2, X, Eye } from 'lucide-react';
import blogService from '../../services/blogService';
import Seo from '../../components/common/Seo';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBlog, setEditingBlog] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    category: '',
    author: '',
    authorRole: '',
    readTime: '',
    status: 'published',
    featured: false,
    seoMetaTitle: '',
    seoMetaDescription: '',
  });

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await blogService.getBlogs();
      const data = res?.data || res || [];
      setBlogs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || 'Failed to fetch blogs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: editingBlog ? prev.slug : generateSlug(title),
    }));
  };

  const handleOpenCreate = () => {
    setEditingBlog(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featuredImage: '',
      category: '',
      author: 'JM Creations Team',
      authorRole: 'Solution Strategist',
      readTime: '5 min read',
      status: 'published',
      featured: false,
      seoMetaTitle: '',
      seoMetaDescription: '',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (b) => {
    setEditingBlog(b);
    setFormData({
      title: b.title || '',
      slug: b.slug || '',
      excerpt: b.excerpt || '',
      content: b.content || '',
      featuredImage: b.featuredImage || '',
      category: b.category || '',
      author: b.author || '',
      authorRole: b.authorRole || '',
      readTime: b.readTime || '',
      status: b.status || 'draft',
      featured: b.featured || false,
      seoMetaTitle: b.seo?.metaTitle || '',
      seoMetaDescription: b.seo?.metaDescription || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.slug || !formData.content) {
      alert('Title, Slug, and Content are required.');
      return;
    }

    const payload = {
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt,
      content: formData.content,
      featuredImage: formData.featuredImage,
      category: formData.category,
      author: formData.author,
      authorRole: formData.authorRole,
      readTime: formData.readTime,
      status: formData.status,
      featured: formData.featured,
      publishedAt: formData.status === 'published' ? new Date() : null,
      seo: {
        metaTitle: formData.seoMetaTitle,
        metaDescription: formData.seoMetaDescription,
      },
    };

    try {
      if (editingBlog) {
        await blogService.updateBlog(editingBlog._id, payload);
      } else {
        await blogService.createBlog(payload);
      }
      setShowModal(false);
      fetchBlogs();
    } catch (err) {
      alert('Save failed: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await blogService.deleteBlog(id);
      setBlogs((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  return (
    <>
      <Seo title="Admin — Manage Blogs" />

      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Blog Management</h1>
            <p className="text-xs text-gray-400 mt-1">Manage published articles and SEO metadata.</p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="btn-gold px-4 py-2.5 rounded-xl text-xs uppercase font-bold tracking-wider flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Article</span>
          </button>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading blogs database..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchBlogs} />
        ) : (
          <div className="space-y-4">
            {blogs.map((b) => (
              <div
                key={b._id}
                className="bg-[#131313] border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-white">{b.title}</h3>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        b.status === 'published' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                      }`}
                    >
                      {b.status}
                    </span>
                    {b.featured && (
                      <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">
                    Slug: /blog/{b.slug} • Category: {b.category || 'General'} • Author: {b.author}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(b)}
                    className="p-2 rounded-lg bg-white/5 text-gray-300 hover:text-white"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(b._id)}
                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-[#1b1b1b] border border-white/10 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h3 className="text-lg font-bold text-white">
                  {editingBlog ? 'Edit Blog Post' : 'Create Blog Post'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={handleTitleChange}
                      className="w-full bg-[#131313] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">
                      URL Slug *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full bg-[#131313] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-[#131313] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">
                      Author Name
                    </label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full bg-[#131313] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">
                      Read Time
                    </label>
                    <input
                      type="text"
                      placeholder="5 min read"
                      value={formData.readTime}
                      onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                      className="w-full bg-[#131313] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">
                    Featured Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.featuredImage}
                    onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                    className="w-full bg-[#131313] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">
                    Excerpt / Short Summary
                  </label>
                  <textarea
                    rows={2}
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    className="w-full bg-[#131313] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">
                    Full Content *
                  </label>
                  <textarea
                    rows={8}
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full bg-[#131313] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">
                      Publication Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full bg-[#131313] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 accent-amber-500"
                    />
                    <label htmlFor="featured" className="text-xs font-semibold text-white">
                      Feature on Homepage
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-3">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    SEO Metadata Overrides
                  </h4>
                  <input
                    type="text"
                    placeholder="SEO Meta Title"
                    value={formData.seoMetaTitle}
                    onChange={(e) => setFormData({ ...formData, seoMetaTitle: e.target.value })}
                    className="w-full bg-[#131313] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white"
                  />
                  <textarea
                    rows={2}
                    placeholder="SEO Meta Description"
                    value={formData.seoMetaDescription}
                    onChange={(e) => setFormData({ ...formData, seoMetaDescription: e.target.value })}
                    className="w-full bg-[#131313] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white"
                  ></textarea>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-lg bg-white/5 text-gray-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-gold px-6 py-2 rounded-lg text-xs uppercase font-bold">
                    Save Article
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminBlogs;
