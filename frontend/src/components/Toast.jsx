import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type || 'info'}`}>
          {t.type === 'success' && <CheckCircle size={18} style={{ color: 'var(--success)' }} />}
          {t.type === 'error' && <AlertCircle size={18} style={{ color: 'var(--danger)' }} />}
          {t.type === 'info' && <Info size={18} style={{ color: 'var(--primary)' }} />}
          
          <span style={{ fontSize: '0.9rem', flex: 1 }}>{t.message}</span>
          
          <button className="btn-icon" onClick={() => onDismiss(t.id)}>
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
