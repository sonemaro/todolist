import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, X, User } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

interface AvatarUploadProps {
  currentAvatar?: string | null;
  onUpload: (file: File) => Promise<void>;
  isLoading?: boolean;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ currentAvatar, onUpload, isLoading }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    setError('');

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG or PNG)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    onUpload(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const avatarUrl = preview || currentAvatar;

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`relative w-32 h-32 rounded-full overflow-hidden border-4 ${
            isDragging
              ? 'border-pastel-mint'
              : 'border-gray-200 dark:border-gray-700'
          } transition-colors cursor-pointer`}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-pastel-mint to-pastel-blue flex items-center justify-center">
              <User className="h-16 w-16 text-white" />
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center"
          >
            <Camera className="h-8 w-8 text-white" />
          </motion.div>

          {isLoading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="h-8 w-8 border-4 border-white border-t-transparent rounded-full"
              />
            </div>
          )}
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={handleClick}
          className="absolute bottom-0 right-0 p-2 bg-pastel-mint text-white rounded-full shadow-lg hover:bg-pastel-blue transition-colors"
        >
          <Upload className="h-4 w-4" />
        </motion.button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="text-center">
        <button
          type="button"
          onClick={handleClick}
          className="text-sm text-pastel-mint hover:text-pastel-blue font-medium"
        >
          {currentAvatar ? t('changePhoto') : t('uploadPhoto')}
        </button>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          JPG or PNG, max 5MB
        </p>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-red-500"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AvatarUpload;
