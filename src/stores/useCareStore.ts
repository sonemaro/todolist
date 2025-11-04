import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CareItem, CareTask, CareItemType, RepeatType } from '../types/care';
import { reminderService } from '../services/reminderService';

interface CareState {
  careItems: CareItem[];
  careTasks: CareTask[];
  filter: CareItemType | 'all';

  addCareItem: (item: Omit<CareItem, 'id' | 'createdAt'>) => void;
  updateCareItem: (id: string, updates: Partial<CareItem>) => void;
  deleteCareItem: (id: string) => void;

  addCareTask: (task: Omit<CareTask, 'id' | 'createdAt'>) => void;
  updateCareTask: (id: string, updates: Partial<CareTask>) => void;
  deleteCareTask: (id: string) => void;
  toggleCareTask: (id: string) => void;

  getCareItemWithTasks: (id: string) => { item: CareItem; tasks: CareTask[] } | null;
  getTasksByCareItem: (careItemId: string) => CareTask[];
  getUpcomingTasks: () => CareTask[];
  setFilter: (filter: CareItemType | 'all') => void;
}

const dateReviver = (key: string, value: any) => {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
    return new Date(value);
  }
  return value;
};

export const useCareStore = create<CareState>()(
  persist(
    (set, get) => ({
      careItems: [],
      careTasks: [],
      filter: 'all',

      addCareItem: (itemData) => {
        const newItem: CareItem = {
          ...itemData,
          id: Date.now().toString(),
          createdAt: new Date(),
        };

        set((state) => ({
          careItems: [...state.careItems, newItem],
        }));
      },

      updateCareItem: (id, updates) => {
        set((state) => ({
          careItems: state.careItems.map(item =>
            item.id === id ? { ...item, ...updates } : item
          ),
        }));
      },

      deleteCareItem: (id) => {
        const tasks = get().careTasks.filter(t => t.careItemId === id);
        tasks.forEach(task => reminderService.cancelReminder(task.id));

        set((state) => ({
          careItems: state.careItems.filter(item => item.id !== id),
          careTasks: state.careTasks.filter(task => task.careItemId !== id),
        }));
      },

      addCareTask: (taskData) => {
        const newTask: CareTask = {
          ...taskData,
          id: Date.now().toString(),
          createdAt: new Date(),
        };

        set((state) => ({
          careTasks: [...state.careTasks, newTask],
        }));

        const mockTask = {
          id: newTask.id,
          title: newTask.title,
          dueDate: newTask.dueDate,
          completed: newTask.completed,
          category: { id: '1', name: 'Care', color: 'mint' as any, icon: '🌿', tasks: [] },
          priority: 'medium' as any,
          tags: [],
          subtasks: [],
          pomodoroSessions: 0,
          createdAt: newTask.createdAt,
          updatedAt: newTask.createdAt,
          order: 0,
        };
        reminderService.scheduleReminder(mockTask);
      },

      updateCareTask: (id, updates) => {
        const task = get().careTasks.find(t => t.id === id);
        set((state) => ({
          careTasks: state.careTasks.map(t =>
            t.id === id ? { ...t, ...updates } : t
          ),
        }));

        if (task) {
          const updatedTask = { ...task, ...updates };
          const mockTask = {
            id: updatedTask.id,
            title: updatedTask.title,
            dueDate: updatedTask.dueDate,
            completed: updatedTask.completed,
            category: { id: '1', name: 'Care', color: 'mint' as any, icon: '🌿', tasks: [] },
            priority: 'medium' as any,
            tags: [],
            subtasks: [],
            pomodoroSessions: 0,
            createdAt: updatedTask.createdAt,
            updatedAt: new Date(),
            order: 0,
          };
          reminderService.rescheduleReminder(mockTask);
        }
      },

      deleteCareTask: (id) => {
        reminderService.cancelReminder(id);
        set((state) => ({
          careTasks: state.careTasks.filter(task => task.id !== id),
        }));
      },

      toggleCareTask: (id) => {
        set((state) => ({
          careTasks: state.careTasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
          ),
        }));
      },

      getCareItemWithTasks: (id) => {
        const item = get().careItems.find(i => i.id === id);
        if (!item) return null;
        const tasks = get().careTasks.filter(t => t.careItemId === id);
        return { item, tasks };
      },

      getTasksByCareItem: (careItemId) => {
        return get().careTasks.filter(t => t.careItemId === careItemId);
      },

      getUpcomingTasks: () => {
        return get().careTasks
          .filter(t => !t.completed && t.dueDate >= new Date())
          .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
      },

      setFilter: (filter) => set({ filter }),
    }),
    {
      name: 'care-storage',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const data = JSON.parse(str);
          if (data.state) {
            data.state.careItems = data.state.careItems?.map((item: any) => ({
              ...item,
              createdAt: new Date(item.createdAt),
            }));
            data.state.careTasks = data.state.careTasks?.map((task: any) => ({
              ...task,
              dueDate: new Date(task.dueDate),
              createdAt: new Date(task.createdAt),
            }));
          }
          return data;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);
