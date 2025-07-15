import React from 'react';

export default function Loader({ size = 'md' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex justify-center items-center py-4">
      <div className={`
        animate-spin ${sizeClasses[size]} border-4 border-purple-500/30 border-t-purple-500 rounded-full
      `}></div>
    </div>
  );
}
