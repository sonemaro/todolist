import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Square, SkipForward, Coffee, Target, Volume2, VolumeX } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useTaskStore } from '../../stores/useTaskStore';
import { useAppStore } from '../../stores/useAppStore';

const FocusMode: React.FC = () => {
  const { t } = useTranslation();
  const { getFilteredTasks } = useTaskStore();
  const { preferences, toggleSound, incrementPoints } = useAppStore();
  
  const [selectedTask, setSelectedTask] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [cycles, setCycles] = useState(0);

  const tasks = getFilteredTasks().filter(task => !task.completed);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, isPaused, timeLeft]);

  const handleTimerComplete = () => {
    setIsActive(false);
    
    if (mode === 'work') {
      setCycles(prev => prev + 1);
      setMode('break');
      setTimeLeft(5 * 60); // 5 minute break
      incrementPoints(25); // Award points for completed pomodoro
      
      if (preferences.soundEnabled) {
        // Play completion sound
        const audio = new Audio('/notification.mp3');
        audio.play().catch(() => {}); // Ignore errors if sound fails
      }
    } else {
      setMode('work');
      setTimeLeft(25 * 60); // Back to 25 minutes
    }
  };

  const startTimer = () => {
    if (selectedTask) {
      setIsActive(true);
      setIsPaused(false);
    }
  };

  const pauseTimer = () => {
    setIsPaused(!isPaused);
  };

  const stopTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const skipSession = () => {
    handleTimerComplete();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'work' 
    ? ((25 * 60 - timeLeft) / (25 * 60)) * 100
    : ((5 * 60 - timeLeft) / (5 * 60)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-lavender/20 to-pastel-mint/20 dark:from-dark-bg dark:to-dark-card p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-white dark:bg-dark-card 
                     px-6 py-3 rounded-full shadow-lg mb-4"
          >
            <Target className="h-6 w-6 text-pastel-lavender" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {t('focusMode')}
            </h1>
          </motion.div>
          
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            {t('focusModeDesc')}
          </p>
        </div>

        {/* Task Selection */}
        {!selectedTask && tasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-dark-card rounded-2xl shadow-xl p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Select a task to focus on
            </h3>
            <div className="space-y-3">
              {tasks.slice(0, 5).map((task) => (
                <button
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className="w-full text-left p-4 bg-gray-50 dark:bg-dark-bg rounded-xl 
                           hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span className="text-lg">{task.category.icon}</span>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{task.title}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{task.category.name}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Timer */}
        <AnimatePresence>
          {selectedTask && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl p-8 text-center"
            >
              {/* Current Task */}
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  {mode === 'work' ? t('focusTask') : t('breakTime')}
                </h3>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {mode === 'work' ? selectedTask.title : '☕ Take a Break!'}
                </h2>
              </div>

              {/* Timer Display */}
              <div className="mb-8">
                <div className="relative w-64 h-64 mx-auto mb-6">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="text-gray-200 dark:text-gray-700"
                    />
                    {/* Progress circle */}
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      className={mode === 'work' ? 'text-pastel-lavender' : 'text-pastel-mint'}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: progress / 100 }}
                      transition={{ duration: 0.5 }}
                      style={{
                        pathLength: progress / 100,
                        strokeDasharray: "0 1"
                      }}
                    />
                  </svg>
                  
                  {/* Time display */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-mono font-bold text-gray-900 dark:text-white mb-2">
                        {formatTime(timeLeft)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Cycle {cycles + 1}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timer Controls */}
                <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse">
                  {!isActive ? (
                    <button
                      onClick={startTimer}
                      className="bg-pastel-lavender hover:bg-pastel-lavender/90 text-white p-4 rounded-full 
                               shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                      <Play className="h-6 w-6" />
                    </button>
                  ) : (
                    <button
                      onClick={pauseTimer}
                      className="bg-pastel-orange hover:bg-pastel-orange/90 text-white p-4 rounded-full 
                               shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                      {isPaused ? <Play className="h-6 w-6" /> : <Pause className="h-6 w-6" />}
                    </button>
                  )}

                  <button
                    onClick={stopTimer}
                    className="bg-gray-500 hover:bg-gray-600 text-white p-4 rounded-full 
                             shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    <Square className="h-6 w-6" />
                  </button>

                  <button
                    onClick={skipSession}
                    disabled={!isActive}
                    className="bg-pastel-blue hover:bg-pastel-blue/90 text-white p-4 rounded-full 
                             shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <SkipForward className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Settings */}
              <div className="flex items-center justify-center space-x-6 rtl:space-x-reverse pt-6 border-t border-gray-200 dark:border-dark-border">
                <button
                  onClick={toggleSound}
                  className="flex items-center space-x-2 rtl:space-x-reverse text-gray-600 dark:text-gray-400 
                           hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                >
                  {preferences.soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                  <span className="text-sm">Sound</span>
                </button>

                <button
                  onClick={() => setSelectedTask(null)}
                  className="flex items-center space-x-2 rtl:space-x-reverse text-gray-600 dark:text-gray-400 
                           hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                >
                  <Target className="h-5 w-5" />
                  <span className="text-sm">Change Task</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-4 mt-8"
        >
          <div className="bg-white dark:bg-dark-card rounded-xl p-4 text-center shadow-lg">
            <div className="text-2xl font-bold text-pastel-lavender">{cycles}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Cycles Today</div>
          </div>
          <div className="bg-white dark:bg-dark-card rounded-xl p-4 text-center shadow-lg">
            <div className="text-2xl font-bold text-pastel-mint">25</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Minutes Focus</div>
          </div>
          <div className="bg-white dark:bg-dark-card rounded-xl p-4 text-center shadow-lg">
            <div className="text-2xl font-bold text-pastel-blue">5</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Minutes Break</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FocusMode;