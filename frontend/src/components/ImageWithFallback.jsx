import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

export function ImageWithFallback({ src, alt, className = '' }) {
  const [hasError, setHasError] = useState(!src);

  if (hasError || !src) {
    return (
      <div 
        className={`flex flex-col items-center justify-center bg-slate-900 text-slate-500 p-4 ${className}`}
        style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <ImageOff size={32} style={{ marginBottom: '0.5rem', opacity: 0.6 }} />
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>No Preview</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || 'Image'}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}
