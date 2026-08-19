import React from 'react';

const LoadingSpinner = ({ message = 'Loading content...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="relative w-12 h-12">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-amber-500/20 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-sm text-gray-400 font-medium tracking-wide">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
