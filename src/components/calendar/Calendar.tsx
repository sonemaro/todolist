import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../hooks/useTranslation';
import { useTaskStore } from '../../stores/useTaskStore';
import {
  getMonthGrid,
  getToday,
  addMonths,
  CalendarType,
  CalendarDay,
  getDateKey,
  isSameDay
} from '../../utils/dateUtils';
import CalendarHeader from './CalendarHeader';
import DayCell from './DayCell';
import TaskForm from '../task/TaskForm';

const Calendar: React.FC = () => {
  const { language, calendarType } = useTranslation();
  const { getTasksByDate } = useTaskStore();

  // Calendar state
  const [currentDate, setCurrentDate] = useState<Date>(getToday());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskFormDate, setTaskFormDate] = useState<Date | null>(null);

  // Get calendar data
  const monthGrid = getMonthGrid(currentDate, calendarType);
  const weekdayNames = calendarType === 'gregorian' 
    ? (language === 'fa' ? ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش'] : ['S','M','T','W','T','F','S'])
    : ['ش','ی','د','س','چ','پ','ج'];

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(prev => addMonths(prev, -1, calendarType));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1, calendarType));
  };

  const handleToday = () => {
    const today = getToday();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // Day selection handlers
  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddTask = (date: Date) => {
    setTaskFormDate(date);
    setShowTaskForm(true);
  };

  const handleCloseTaskForm = () => {
    setShowTaskForm(false);
    setTaskFormDate(null);
  };

  // Generate unique key for month transitions
  const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;

  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl shadow-lg overflow-hidden">
      {/* Calendar Header */}
      <CalendarHeader
        viewDate={currentDate}
        calendarType={calendarType}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
      />

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 border-b border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-gray-800">
        {weekdayNames.map((day, index) => (
          <div
            key={index}
            className="p-3 text-center text-sm font-medium text-gray-600 dark:text-gray-400"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={monthKey}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="grid grid-cols-7"
        >
          {monthGrid.map((day, index) => {
            const dayTasks = getTasksByDate(day.date);
            const isSelected = selectedDate && isSameDay(day.date, selectedDate);

            return (
              <DayCell
                key={`${getDateKey(day.date)}-${index}`}
                day={day}
                tasks={dayTasks}
                isSelected={!!isSelected}
                onClick={handleDayClick}
                onAddTask={handleAddTask}
              />
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Task Form Modal */}
      <AnimatePresence>
        {showTaskForm && (
          <TaskForm
            task={null}
            onClose={handleCloseTaskForm}
            defaultDate={taskFormDate}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Calendar;