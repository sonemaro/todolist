import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Clock } from 'lucide-react';
import { useCareStore } from '../../stores/useCareStore';
import { useAuthStore } from '../../stores/authStore';
import { RepeatType } from '../../types/care';
import DatePicker from 'react-datepicker';
import TimePicker from 'react-time-picker';

interface CareTaskFormProps {
  careItemId: string;
  onClose: () => void;
}

const CareTaskForm: React.FC<CareTaskFormProps> = ({ careItemId, onClose }) => {
  const { addCareTask } = useCareStore();
  const { session } = useAuthStore();
  const [formData, setFormData] = useState({
    title: '',
    repeat: 'none' as RepeatType,
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('09:00');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !selectedDate) return;

    const [hours, minutes] = selectedTime.split(':').map(Number);
    const dueDate = new Date(selectedDate);
    dueDate.setHours(hours, minutes, 0, 0);

    addCareTask({
      ...formData,
      careItemId,
      userId: session?.user?.id || 'guest',
      dueDate,
      completed: false,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-md"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-border">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Add Care Task
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Water, Feed, Vet Visit"
              required
              className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border
                       rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-mint focus:border-transparent
                       text-gray-900 dark:text-white placeholder-gray-500"
            />
          </div>

          <fieldset className="border border-gray-200 dark:border-dark-border rounded-xl p-4">
            <legend className="text-sm font-medium text-gray-700 dark:text-gray-300 px-2">
              Schedule
            </legend>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Date</label>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="MMM d, yyyy"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border
                           rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-mint focus:border-transparent
                           text-gray-900 dark:text-white"
                  placeholderText="Select date"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  <Clock className="inline h-3 w-3 mr-1" />
                  Time
                </label>
                <TimePicker
                  onChange={(value) => setSelectedTime(value || '09:00')}
                  value={selectedTime}
                  disableClock
                  format="h:mm a"
                  className="w-full"
                  clockIcon={null}
                  clearIcon={null}
                />
              </div>
            </div>
          </fieldset>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Repeat
            </label>
            <select
              value={formData.repeat}
              onChange={(e) => setFormData({ ...formData, repeat: e.target.value as RepeatType })}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border
                       rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-mint focus:border-transparent
                       text-gray-900 dark:text-white"
            >
              <option value="none">None</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

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
              Add Task
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CareTaskForm;
