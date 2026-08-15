import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layers, Briefcase, Server, PhoneCall, ShieldCheck, Home as HomeIcon } from 'lucide-react';

export function Navbar() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <header className="navbar">
      <div className="container nav-container">
        <Link to="/" className="logo">
          <Layers size={26} style={{ color: 'var(--primary)' }} />
          <span>JM Creations</span>
        </Link>

        <nav className="nav-links">
          {!isAdmin ? (
            <>
              <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                <HomeIcon size={16} style={{ display: 'inline', marginRight: '4px' }} />
                Home
              </Link>
              <Link to="/services" className={`nav-link ${location.pathname === '/services' ? 'active' : ''}`}>
                <Server size={16} style={{ display: 'inline', marginRight: '4px' }} />
                Services
              </Link>
              <Link to="/portfolio" className={`nav-link ${location.pathname === '/portfolio' ? 'active' : ''}`}>
                <Briefcase size={16} style={{ display: 'inline', marginRight: '4px' }} />
                Portfolio
              </Link>
              <Link to="/admin/portfolio" className="admin-badge-btn">
                <ShieldCheck size={16} />
                Admin Panel
              </Link>
            </>
          ) : (
            <>
              <Link to="/" className="nav-link">
                ← Back to Website
              </Link>
              <Link to="/admin/portfolio" className={`nav-link ${location.pathname === '/admin/portfolio' ? 'active' : ''}`}>
                Portfolio Admin
              </Link>
              <Link to="/admin/services" className={`nav-link ${location.pathname === '/admin/services' ? 'active' : ''}`}>
                Services Admin
              </Link>
              <Link to="/admin/enquiries" className={`nav-link ${location.pathname === '/admin/enquiries' ? 'active' : ''}`}>
                Enquiries
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
