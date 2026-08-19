import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/layout/AdminLayout';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Blog from './pages/Blog';
import BlogPostDetail from './pages/BlogPostDetail';
import Testimonials from './pages/Testimonials';
import Careers from './pages/Careers';
import Contact from './pages/Contact';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEnquiries from './pages/admin/AdminEnquiries';
import AdminServices from './pages/admin/AdminServices';
import AdminPortfolio from './pages/admin/AdminPortfolio';
import AdminBlogs from './pages/admin/AdminBlogs';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminCareers from './pages/admin/AdminCareers';
import AdminSiteContent from './pages/admin/AdminSiteContent';
import AdminAnalytics from './pages/admin/AdminAnalytics';

function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<BlogPostDetail />} />
        <Route path="testimonials" element={<Testimonials />} />
        <Route path="careers" element={<Careers />} />
        <Route path="contact" element={<Contact />} />
      </Route>

      {/* Admin Login */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin Panel Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="enquiries" element={<AdminEnquiries />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="portfolio" element={<AdminPortfolio />} />
        <Route path="blogs" element={<AdminBlogs />} />
        <Route path="blog" element={<AdminBlogs />} />
        <Route path="testimonials" element={<AdminTestimonials />} />
        <Route path="careers" element={<AdminCareers />} />
        <Route path="site-content" element={<AdminSiteContent />} />
        <Route path="analytics" element={<AdminAnalytics />} />
      </Route>
    </Routes>
  );
}

export default App;
