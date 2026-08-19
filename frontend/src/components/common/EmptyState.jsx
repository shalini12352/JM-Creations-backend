import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({
  title = 'No content available',
  message = 'There are currently no items to display in this section.',
  icon: Icon = Inbox,
  actionText,
  onAction,
}) => {
  return (
    <div className="border border-white/5 bg-neutral-900/40 rounded-xl p-12 text-center max-w-lg mx-auto my-12 backdrop-blur-sm">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-500/10 text-amber-500 mb-4 border border-amber-500/20">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400 mb-6">{message}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="btn-gold px-6 py-2.5 rounded-lg text-sm font-semibold transition-all"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
