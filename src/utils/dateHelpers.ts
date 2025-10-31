import { format, isToday, isYesterday, isTomorrow, formatDistanceToNow } from 'date-fns';
import { format as formatJalali } from 'date-fns-jalali';

export const formatDate = (date: Date, calendarType: 'gregorian' | 'jalali' = 'gregorian'): string => {
  if (calendarType === 'jalali') {
    return formatJalali(date, 'yyyy/MM/dd');
  }
  return format(date, 'yyyy-MM-dd');
};

export const formatDateRelative = (date: Date, language: 'en' | 'fa' = 'en'): string => {
  if (isToday(date)) {
    return language === 'fa' ? 'امروز' : 'Today';
  }
  if (isYesterday(date)) {
    return language === 'fa' ? 'دیروز' : 'Yesterday';
  }
  if (isTomorrow(date)) {
    return language === 'fa' ? 'فردا' : 'Tomorrow';
  }
  return formatDistanceToNow(date, { addSuffix: true });
};

export const getWeekProgress = (tasks: any[]): number => {
  const now = new Date();
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  
  const weekTasks = tasks.filter(task => {
    if (!task.createdAt) return false;
    const taskDate = task.createdAt instanceof Date ? task.createdAt : new Date(task.createdAt);
    return taskDate >= weekStart && taskDate <= weekEnd;
  });
  
  if (weekTasks.length === 0) return 0;
  
  const completed = weekTasks.filter(task => task.completed).length;
  return Math.round((completed / weekTasks.length) * 100);
};

export const getTodayProgress = (tasks: any[]): number => {
  const todayTasks = tasks.filter(task => {
    if (!task.createdAt) return false;
    const createdAt = task.createdAt instanceof Date ? task.createdAt : new Date(task.createdAt);
    return isToday(createdAt);
  });
  
  if (todayTasks.length === 0) return 0;
  
  const completed = todayTasks.filter(task => task.completed).length;
  return Math.round((completed / todayTasks.length) * 100);
};