import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { PublicPortfolio } from './pages/PublicPortfolio';
import { PublicServices } from './pages/PublicServices';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminPortfolio } from './pages/admin/AdminPortfolio';
import { AdminServices } from './pages/admin/AdminServices';
import { AdminEnquiries } from './pages/admin/AdminEnquiries';

// Simple Admin Protected Route
function AdminRoute({ children }) {
  const isAuthenticated = localStorage.getItem('jm_admin_session') === 'true';
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<PublicPortfolio />} />
            <Route path="/services" element={<PublicServices />} />

            {/* Admin Pages */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={<Navigate to="/admin/portfolio" replace />}
            />
            <Route
              path="/admin/portfolio"
              element={
                <AdminRoute>
                  <AdminPortfolio />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/services"
              element={
                <AdminRoute>
                  <AdminServices />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/enquiries"
              element={
                <AdminRoute>
                  <AdminEnquiries />
                </AdminRoute>
              }
            />

            {/* Fallback Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
