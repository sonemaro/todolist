import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Flag, Tag, Folder, Mic } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useTaskStore } from '../../stores/useTaskStore';
import { Task, Priority, PastelColor } from '../../types';
import { getColorClasses } from '../../utils/colorHelpers';

interface TaskFormProps {
  task?: Task | null;
  onClose: () => void;
  defaultDate?: Date | null;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onClose, defaultDate }) => {
  const { t, isRTL } = useTranslation();
  const { addTask, updateTask, categories } = useTaskStore();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as Priority,
    categoryId: categories[0]?.id || '',
    dueDate: '',
    tags: [] as string[],
  });
  
  const [tagInput, setTagInput] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        categoryId: task.category.id,
        dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : '',
        tags: task.tags,
      });
    } else if (defaultDate) {
      setFormData(prev => ({
        ...prev,
        dueDate: defaultDate.toISOString().split('T')[0]
      }));
    }
  }, [task, defaultDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedCategory = categories.find(cat => cat.id === formData.categoryId);
    if (!selectedCategory) return;

    const taskData = {
      title: formData.title,
      description: formData.description || undefined,
      priority: formData.priority,
      category: selectedCategory,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      tags: formData.tags,
      completed: false,
      subtasks: [],
      pomodoroSessions: 0,
    };

    if (task) {
      updateTask(task.id, taskData);
    } else {
      addTask(taskData);
    }
    
    onClose();
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = isRTL ? 'fa-IR' : 'en-US';

      setIsVoiceActive(true);
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setFormData({ ...formData, title: transcript });
        setIsVoiceActive(false);
      };

      recognition.onerror = () => {
        setIsVoiceActive(false);
      };

      recognition.onend = () => {
        setIsVoiceActive(false);
      };

      recognition.start();
    }
  };

  const priorityColors: Record<Priority, PastelColor> = {
    low: 'mint',
    medium: 'yellow',
    high: 'orange',
    urgent: 'pink',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-border">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {task ? t('editTask') : t('addTask')}
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
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('taskTitle')}
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={t('taskTitle')}
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border 
                         rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-mint focus:border-transparent
                         text-gray-900 dark:text-white placeholder-gray-500"
              />
              <button
                type="button"
                onClick={handleVoiceInput}
                disabled={isVoiceActive}
                className={`absolute right-3 rtl:right-auto rtl:left-3 top-1/2 transform -translate-y-1/2 
                          p-2 rounded-lg transition-colors ${
                            isVoiceActive 
                              ? 'bg-pastel-mint text-white animate-pulse' 
                              : 'text-gray-400 hover:text-pastel-mint hover:bg-gray-100 dark:hover:bg-gray-600'
                          }`}
              >
                <Mic className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('taskDescription')}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={t('taskDescription')}
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border 
                       rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-mint focus:border-transparent
                       text-gray-900 dark:text-white placeholder-gray-500 resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Folder className="inline h-4 w-4 mr-1 rtl:mr-0 rtl:ml-1" />
              {t('category')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, categoryId: category.id })}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 flex items-center space-x-2 rtl:space-x-reverse
                            ${formData.categoryId === category.id
                              ? `${getColorClasses(category.color, 'border')} ${getColorClasses(category.color, 'bg')}/10`
                              : 'border-gray-200 dark:border-dark-border hover:border-gray-300'
                            }`}
                >
                  <span className="text-lg">{category.icon}</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {category.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Flag className="inline h-4 w-4 mr-1 rtl:mr-0 rtl:ml-1" />
              {t('priority')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['low', 'medium', 'high', 'urgent'] as Priority[]).map((priority) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority })}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 capitalize
                            ${formData.priority === priority
                              ? `${getColorClasses(priorityColors[priority], 'border')} ${getColorClasses(priorityColors[priority], 'bg')}/10`
                              : 'border-gray-200 dark:border-dark-border hover:border-gray-300'
                            }`}
                >
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t(priority)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Calendar className="inline h-4 w-4 mr-1 rtl:mr-0 rtl:ml-1" />
              {t('dueDate')}
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border 
                       rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-mint focus:border-transparent
                       text-gray-900 dark:text-white"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Tag className="inline h-4 w-4 mr-1 rtl:mr-0 rtl:ml-1" />
              {t('tags')}
            </label>
            <div className="flex space-x-2 rtl:space-x-reverse mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Add tag..."
                className="flex-1 px-3 py-2 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border 
                         rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-mint focus:border-transparent
                         text-gray-900 dark:text-white placeholder-gray-500"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-pastel-mint text-white rounded-lg hover:bg-pastel-mint/90 
                         transition-colors font-medium"
              >
                {t('add')}
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 
                             text-gray-700 dark:text-gray-300 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 rtl:ml-0 rtl:mr-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-3 rtl:space-x-reverse pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                       rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={!formData.title.trim()}
              className="flex-1 px-6 py-3 bg-pastel-mint text-white rounded-xl hover:bg-pastel-mint/90 
                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium
                       shadow-md hover:shadow-lg transform hover:scale-105"
            >
              {task ? t('save') : t('add')}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default TaskForm;