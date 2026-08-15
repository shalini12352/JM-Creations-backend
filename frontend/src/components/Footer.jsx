import React from 'react';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>© {new Date().getFullYear()} JM Creations. All rights reserved.</p>
        <p style={{ fontSize: '0.8rem', marginTop: '0.4rem', opacity: 0.7 }}>
          Full-Stack Portfolio & Services Management System connected to MongoDB Atlas
        </p>
      </div>
    </footer>
  );
}
