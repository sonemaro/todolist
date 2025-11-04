import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Leaf, Heart, Filter, BarChart3, Download } from 'lucide-react';
import { useCareStore } from '../../stores/useCareStore';
import { useNotificationStore } from '../../stores/notificationStore';
import { CareItem, CareItemType } from '../../types/care';
import CareItemCard from './CareItemCard';
import CareItemForm from './CareItemForm';
import CareItemDetail from './CareItemDetail';
import CareReports from './CareReports';
import EmptyState from '../common/EmptyState';

const exportAllToICS = (items: CareItem[], tasks: any[]) => {
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}T${hours}${minutes}${seconds}`;
  };

  const now = new Date();
  const events = tasks
    .filter(t => !t.completed)
    .map(task => {
      const item = items.find(i => i.id === task.careItemId);
      const endDate = new Date(task.dueDate.getTime() + 30 * 60 * 1000);
      return [
        'BEGIN:VEVENT',
        `UID:${task.id}@caremanager.app`,
        `DTSTAMP:${formatDate(now)}`,
        `DTSTART:${formatDate(task.dueDate)}`,
        `DTEND:${formatDate(endDate)}`,
        `SUMMARY:${task.title}${item ? ` - ${item.name}` : ''}`,
        `DESCRIPTION:Care task${item ? ` for ${item.name}` : ''}`,
        'STATUS:CONFIRMED',
        'END:VEVENT'
      ].join('\r\n');
    });

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Care Manager//Care Tasks//EN',
    ...events,
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'care-tasks.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const CarePage: React.FC = () => {
  const { careItems, careTasks, filter, setFilter } = useCareStore();
  const { addNotification } = useNotificationStore();
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CareItem | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showReports, setShowReports] = useState(false);

  const filteredItems = filter === 'all'
    ? careItems
    : careItems.filter(item => item.type === filter);

  const plantCount = careItems.filter(i => i.type === 'plant').length;
  const petCount = careItems.filter(i => i.type === 'pet').length;

  const handleItemClick = (item: CareItem) => {
    setSelectedItem(item);
    setShowDetail(true);
  };

  const handleExportCalendar = () => {
    const pendingTasks = careTasks.filter(t => !t.completed);
    if (pendingTasks.length === 0) {
      addNotification('No pending tasks to export', 'info');
      return;
    }
    exportAllToICS(careItems, careTasks);
    addNotification(`Exported ${pendingTasks.length} tasks to calendar`, 'success');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 bg-white dark:bg-dark-bg border-b border-gray-200 dark:border-dark-border p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Plant & Pet Care</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {plantCount} plants, {petCount} pets
            </p>
          </div>

          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <button
              onClick={() => setShowReports(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-xl font-medium
                       shadow-md hover:shadow-lg transition-all duration-200
                       flex items-center space-x-2 rtl:space-x-reverse"
              title="View Reports"
            >
              <BarChart3 className="h-5 w-5" />
              <span className="hidden sm:inline">Reports</span>
            </button>
            <button
              onClick={handleExportCalendar}
              className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-xl font-medium
                       shadow-md hover:shadow-lg transition-all duration-200
                       flex items-center space-x-2 rtl:space-x-reverse"
              title="Export to Calendar"
            >
              <Download className="h-5 w-5" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="bg-pastel-mint hover:bg-pastel-mint/90 text-white px-4 py-2 rounded-xl font-medium
                       shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200
                       flex items-center space-x-2 rtl:space-x-reverse"
            >
              <Plus className="h-5 w-5" />
              <span>Add Item</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: 'all' as const, label: 'All', icon: Filter, count: careItems.length },
            { id: 'plant' as const, label: 'Plants', icon: Leaf, count: plantCount },
            { id: 'pet' as const, label: 'Pets', icon: Heart, count: petCount },
          ].map(filterItem => (
            <button
              key={filterItem.id}
              onClick={() => setFilter(filterItem.id)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all flex items-center space-x-2 rtl:space-x-reverse ${
                filter === filterItem.id
                  ? 'bg-pastel-mint text-white shadow-md'
                  : 'bg-gray-100 dark:bg-dark-card text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <filterItem.icon className="h-4 w-4" />
              <span>{filterItem.label}</span>
              {filterItem.count > 0 && (
                <span className="px-2 py-0.5 text-xs bg-white/20 rounded-full">
                  {filterItem.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        {filteredItems.length === 0 ? (
          <EmptyState
            icon={filter === 'plant' ? Leaf : filter === 'pet' ? Heart : Filter}
            title={`No ${filter === 'all' ? 'items' : filter + 's'} yet`}
            description={`Add your first ${filter === 'all' ? 'plant or pet' : filter} to start tracking care tasks`}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence>
              {filteredItems.map((item, index) => (
                <CareItemCard
                  key={item.id}
                  item={item}
                  index={index}
                  onClick={() => handleItemClick(item)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modals */}
      {showForm && <CareItemForm onClose={() => setShowForm(false)} />}
      {showDetail && selectedItem && (
        <CareItemDetail
          item={selectedItem}
          onClose={() => {
            setShowDetail(false);
            setSelectedItem(null);
          }}
        />
      )}
      {showReports && <CareReports onClose={() => setShowReports(false)} />}
    </div>
  );
};

export default CarePage;
