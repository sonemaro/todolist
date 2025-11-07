import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Leaf, Heart, Upload } from 'lucide-react';
import { useCareStore } from '../../stores/useCareStore';
import { useAuthStore } from '../../stores/authStore';
import { CareItemType } from '../../types/care';

interface CareItemFormProps {
  onClose: () => void;
}

const CareItemForm: React.FC<CareItemFormProps> = ({ onClose }) => {
  const { addCareItem } = useCareStore();
  const { session } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    type: 'plant' as CareItemType,
    description: '',
    image: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    addCareItem({
      ...formData,
      userId: session?.user?.id || 'guest',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-border">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Add Care Item
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Snake Plant, Max"
              required
              className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border
                       rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-mint focus:border-transparent
                       text-gray-900 dark:text-white placeholder-gray-500"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'plant' })}
                className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center space-y-2
                  ${formData.type === 'plant'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-dark-border hover:border-gray-300'
                  }`}
              >
                <Leaf className={`h-8 w-8 ${formData.type === 'plant' ? 'text-green-500' : 'text-gray-400'}`} />
                <span className="font-medium text-gray-900 dark:text-white">Plant</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'pet' })}
                className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center space-y-2
                  ${formData.type === 'pet'
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                    : 'border-gray-200 dark:border-dark-border hover:border-gray-300'
                  }`}
              >
                <Heart className={`h-8 w-8 ${formData.type === 'pet' ? 'text-orange-500' : 'text-gray-400'}`} />
                <span className="font-medium text-gray-900 dark:text-white">Pet</span>
              </button>
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Image URL (optional)
            </label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border
                       rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-mint focus:border-transparent
                       text-gray-900 dark:text-white placeholder-gray-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description (optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Care notes, special requirements..."
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border
                       rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-mint focus:border-transparent
                       text-gray-900 dark:text-white placeholder-gray-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-3 rtl:space-x-reverse">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300
                       rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-pastel-mint text-white rounded-xl font-medium
                       hover:bg-pastel-mint/90 transition-colors shadow-md hover:shadow-lg"
            >
              Add Item
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CareItemForm;
