export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  category: Category;
  priority: Priority;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  subtasks: SubTask[];
  pomodoroSessions: number;
  mood?: Mood;
  order: number;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  color: PastelColor;
  icon: string;
  tasks: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  preferences: UserPreferences;
  stats: UserStats;
}

export interface UserPreferences {
  language: 'en' | 'fa';
  theme: 'light' | 'dark';
  calendarType: 'gregorian' | 'jalali';
  soundEnabled: boolean;
  focusMode: boolean;
  gamificationMode: 'animal' | 'plant' | 'robot' | 'fantasy' | 'points' | 'none';
}

export interface UserStats {
  totalTasks: number;
  completedTasks: number;
  currentStreak: number;
  longestStreak: number;
  points: number;
  level: number;
  pomodoroCount: number;
}

export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type PastelColor = 'mint' | 'lavender' | 'blue' | 'pink' | 'yellow' | 'orange' | 'teal' | 'purple';
export type Mood = '😊' | '😐' | '😔' | '😴' | '🔥' | '💪';

export interface FilterOptions {
  category?: string;
  priority?: Priority;
  completed?: boolean;
  dueDate?: 'today' | 'week' | 'overdue';
  search?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'task' | 'habit' | 'reminder';
  completed: boolean;
}