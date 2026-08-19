import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import FloatingWhatsApp from '../common/FloatingWhatsApp';
import useAnalytics from '../../hooks/useAnalytics';

const PublicLayout = () => {
  // Track page views automatically across all public pages
  useAnalytics();

  return (
    <div className="min-h-screen bg-[#131313] text-[#e2e2e2] flex flex-col font-['DM_Sans'] antialiased">
      <Header />
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default PublicLayout;
