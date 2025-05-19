import React, { useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Camera, X, Upload } from 'lucide-react';
import ProfileImage from './ProfileImage';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface ProfilePhotoUploadProps {
  userId: string;
  currentPhotoUrl?: string;
  onPhotoUpdate: (url: string) => void;
}

const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({
  userId,
  currentPhotoUrl,
  onPhotoUpdate
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!validTypes.includes(file.type)) {
      setError('Please upload a JPG or PNG file');
      return false;
    }

    if (file.size > maxSize) {
      setError('File size must be less than 2MB');
      return false;
    }

    return true;
  };

  const processImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Make it square
        const size = Math.min(img.width, img.height);
        const x = (img.width - size) / 2;
        const y = (img.height - size) / 2;
        
        canvas.width = size;
        canvas.height = size;
        
        ctx?.drawImage(img, x, y, size, size, 0, 0, size, size);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          } else {
            resolve(file);
          }
        }, file.type, 0.8);
      };
    });
  };

  const handleFile = async (file: File) => {
    setError(null);
    
    if (!validateFile(file)) {
      return;
    }

    try {
      // Create preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // Process image
      const processedFile = await processImage(file);
      
      // Upload to Supabase Storage
      setUploading(true);
      
      // Delete old photo if exists
      if (currentPhotoUrl) {
        const oldPhotoPath = currentPhotoUrl.split('/').pop();
        if (oldPhotoPath) {
          await supabase.storage
            .from('profile-photos')
            .remove([`${userId}/${oldPhotoPath}`]);
        }
      }

      // Upload new photo
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(`${userId}/${fileName}`, processedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(`${userId}/${fileName}`);

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_photo: publicUrl })
        .eq('id', userId);

      if (updateError) throw updateError;

      onPhotoUpdate(publicUrl);
    } catch (err) {
      console.error('Error uploading photo:', err);
      setError('Failed to upload photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      await handleFile(file);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFile(file);
    }
  };

  const handleRemovePhoto = async () => {
    try {
      setUploading(true);
      setError(null);

      if (currentPhotoUrl) {
        const photoPath = currentPhotoUrl.split('/').pop();
        if (photoPath) {
          await supabase.storage
            .from('profile-photos')
            .remove([`${userId}/${photoPath}`]);
        }
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_photo: null })
        .eq('id', userId);

      if (updateError) throw updateError;

      setPreview(null);
      onPhotoUpdate('');
    } catch (err) {
      console.error('Error removing photo:', err);
      setError('Failed to remove photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/jpeg,image/png"
        onChange={handleFileInput}
      />

     <div
  className={`relative group cursor-pointer rounded-full overflow-hidden border-2 transition-all duration-300 w-32 h-32
    ${isDragging
      ? 'border-black dark:border-white scale-105'
      : 'border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white'
    }`}
  onDragOver={handleDragOver}
  onDragLeave={handleDragLeave}
  onDrop={handleDrop}
  onClick={() => fileInputRef.current?.click()}
>
  <ProfileImage
    src={preview || currentPhotoUrl}
    size="xl"
    alt="Profile"
  />

{/* Overlay */}
<div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full">
  <div className="flex flex-col items-center justify-center gap-1">
    <Upload className="w-6 h-6 text-white" />
    <span className="text-white text-xs font-medium">Unggah Foto</span>
  </div>
</div>

        {/* Remove Button */}
        {(preview || currentPhotoUrl) && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRemovePhoto();
            }}
            className="absolute top-4 right-4 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600"
          >
            <X className="w-3 h-3" />
          </button>
        )}
       
{/* Loading Indicator */}
{uploading && (
  <div className="absolute inset-0 flex items-center justify-center bg-black/40 dark:bg-white/30 rounded-full backdrop-blur-sm">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 dark:border-gray-500 border-t-black dark:border-t-white" />
  </div>
)}
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {/* Help Text */}
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
      Unggah dengan klik atau seret. JPG/PNG, maks. 2MB.
      </p>
    </div>
  );
};

export default ProfilePhotoUpload;
