
import React from 'react';

interface AvatarProps {
  src: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-10 h-10 text-xl',
  md: 'w-16 h-16 text-4xl',
  lg: 'w-24 h-24 text-6xl',
  xl: 'w-32 h-32 text-7xl',
};

const Avatar: React.FC<AvatarProps> = ({ src, size = 'md', className = '' }) => {
  const isDataUrl = src.startsWith('data:image');
  const sizeClass = sizeClasses[size];

  if (isDataUrl) {
    return (
      <img
        src={src}
        alt="Avatar"
        className={`${sizeClass} rounded-full object-cover border-2 border-white shadow-md ${className}`}
      />
    );
  }

  return (
    <span
      className={`${sizeClass} rounded-full bg-brand-light flex items-center justify-center border-2 border-white shadow-md ${className}`}
      role="img"
    >
      {src}
    </span>
  );
};

export default Avatar;
