import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

const ImageWithFallback = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  fallbackIcon: FallbackIcon = ImageIcon,
  fallbackText,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`w-full h-full bg-[#151515] border border-white/5 flex flex-col items-center justify-center p-4 text-center select-none ${containerClassName}`}
      >
        <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center mb-2">
          <FallbackIcon className="w-5 h-5 text-[#D4AF37]" />
        </div>
        {fallbackText && (
          <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">
            {fallbackText}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      {...props}
    />
  );
};

export default ImageWithFallback;
