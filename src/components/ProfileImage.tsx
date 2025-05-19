import React from 'react';
import { User } from 'lucide-react';

interface ProfileImageProps {
  src?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  alt?: string;
  className?: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({
  src,
  size = 'md',
  alt = 'Profile photo',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-32 h-32'
  };

  return (
    <div 
      className={`relative rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center ${sizeClasses[size]} ${className}`}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '';
            e.currentTarget.classList.add('hidden');
            e.currentTarget.nextElementSibling?.classList.remove('hidden');
          }}
        />
      ) : null}
      <User 
        className={`w-1/2 h-1/2 text-gray-400 dark:text-gray-500 ${src ? 'hidden' : ''}`}
      />
    </div>
  );
};

export default ProfileImage;