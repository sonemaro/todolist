import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Mic, Send } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useTaskStore } from '../../stores/useTaskStore';

const QuickAddButton: React.FC = () => {
  const { t, isRTL } = useTranslation();
  const { addTask, categories } = useTaskStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskTitle.trim()) {
      addTask({
        title: taskTitle.trim(),
        description: '',
        priority: 'medium',
        category: categories[0], // Default to first category
        tags: [],
        completed: false,
        subtasks: [],
        pomodoroSessions: 0,
      });
      setTaskTitle('');
      setIsExpanded(false);
    }
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
        setTaskTitle(transcript);
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

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>

      {/* Quick Add Interface */}
      <motion.div
        layout
        className="fixed bottom-6 right-6 z-50"
      >
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            // Collapsed FAB
            <motion.button
              key="fab"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsExpanded(true)}
              className="bg-gradient-to-r from-pastel-mint-dark to-pastel-blue-dark text-white 
                       p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300
                       border-2 border-white/20"
            >
              <Plus className="h-6 w-6" />
            </motion.button>
          ) : (
            // Expanded Form
            <motion.div
              key="form"
              initial={{ scale: 0, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: 20 }}
              className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl p-4 w-80 
                       border border-gray-200 dark:border-dark-border"
            >
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {t('addTask')}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder={t('taskTitle')}
                    autoFocus
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border 
                             rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-mint-dark focus:border-transparent
                             text-gray-900 dark:text-white placeholder-gray-500 pr-12 rtl:pr-4 rtl:pl-12"
                  />
                  
                  {/* Voice Input Button */}
                  <button
                    type="button"
                    onClick={handleVoiceInput}
                    disabled={isVoiceActive}
                    className={`absolute right-3 rtl:right-auto rtl:left-3 top-1/2 transform -translate-y-1/2 
                              p-2 rounded-lg transition-colors ${
                                isVoiceActive 
                                  ? 'bg-pastel-mint-dark text-white animate-pulse' 
                                  : 'text-gray-400 hover:text-pastel-mint-dark hover:bg-gray-100 dark:hover:bg-gray-600'
                              }`}
                  >
                    <Mic className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex space-x-2 rtl:space-x-reverse">
                  <button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                             rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={!taskTitle.trim()}
                    className="flex-1 px-4 py-2 bg-pastel-mint-dark text-white rounded-xl 
                             hover:bg-pastel-mint-dark/90 disabled:opacity-50 disabled:cursor-not-allowed 
                             transition-colors font-medium flex items-center justify-center space-x-2 rtl:space-x-reverse"
                  >
                    <Send className="h-4 w-4" />
                    <span>{t('add')}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default QuickAddButton;