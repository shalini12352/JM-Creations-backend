import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorMessage = ({
  title = 'Unable to load this content',
  message = 'Please try again or check your network connection.',
  onRetry,
}) => {
  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center max-w-lg mx-auto my-12 backdrop-blur-md">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 text-red-400 mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-300 mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-sm font-medium transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
