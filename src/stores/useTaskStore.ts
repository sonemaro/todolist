import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Task, Category, FilterOptions, PastelColor } from '../types';
import { reminderService } from '../services/reminderService';

interface TaskState {
  tasks: Task[];
  categories: Category[];
  filter: FilterOptions;
  isLoading: boolean;
  
  // Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  reorderTasks: (startIndex: number, endIndex: number) => void;
  addCategory: (name: string, color: PastelColor, icon: string) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  setFilter: (filter: FilterOptions) => void;
  clearCompleted: () => void;
  getFilteredTasks: () => Task[];
  getTasksByCategory: (categoryId: string) => Task[];
  getCompletionRate: () => number;
  getTodayTasks: () => Task[];
  getOverdueTasks: () => Task[];
  getTasksByDate: (date: Date) => Task[];
}

const defaultCategories: Category[] = [
  { id: '1', name: 'Work', color: 'blue', icon: '💼', tasks: [] },
  { id: '2', name: 'Personal', color: 'mint', icon: '🏠', tasks: [] },
  { id: '3', name: 'Health', color: 'pink', icon: '💪', tasks: [] },
  { id: '4', name: 'Study', color: 'lavender', icon: '📚', tasks: [] },
  { id: '5', name: 'Shopping', color: 'yellow', icon: '🛒', tasks: [] },
  { id: '6', name: 'Projects', color: 'teal', icon: '🚀', tasks: [] },
];

// Date reviver function to properly deserialize Date objects from JSON
const dateReviver = (key: string, value: any) => {
  // Check if the value is a string that looks like an ISO date
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
    return new Date(value);
  }
  return value;
};

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      categories: defaultCategories,
      filter: {},
      isLoading: false,

      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
          order: get().tasks.length,
        };

        set((state) => ({
          tasks: [...state.tasks, newTask],
          categories: state.categories.map(cat =>
            cat.id === newTask.category.id
              ? { ...cat, tasks: [...cat.tasks, newTask.id] }
              : cat
          )
        }));

        reminderService.scheduleReminder(newTask);
      },

      updateTask: (id, updates) => {
        const updatedTask = get().tasks.find(t => t.id === id);
        set((state) => ({
          tasks: state.tasks.map(task =>
            task.id === id
              ? { ...task, ...updates, updatedAt: new Date() }
              : task
          )
        }));

        if (updatedTask) {
          const finalTask = { ...updatedTask, ...updates };
          reminderService.rescheduleReminder(finalTask);
        }
      },

      deleteTask: (id) => {
        const task = get().tasks.find(t => t.id === id);
        reminderService.cancelReminder(id);

        // If the task was ever rewarded, deduct the earned points (regardless of current completed status)
        if (task) {
          import('../stores/rewardsStore').then(({ useRewardsStore }) => {
            const rewardsState = useRewardsStore.getState();
            if (rewardsState.isTaskRewarded(id)) {
              const pointsEarned = task.priority === 'urgent' ? 20 : task.priority === 'high' ? 15 : task.priority === 'medium' ? 10 : 5;
              import('../stores/useAppStore').then(({ useAppStore }) => {
                useAppStore.getState().decrementPoints(pointsEarned);
              });
              rewardsState.removeTaskRewarded(id);
            }
          });
        }

        set((state) => ({
          tasks: state.tasks.filter(task => task.id !== id),
          categories: state.categories.map(cat => ({
            ...cat,
            tasks: cat.tasks.filter(taskId => taskId !== id)
          }))
        }));
      },

      toggleTask: (id) => {
        const task = get().tasks.find(t => t.id === id);

        // If uncompleting a task that was rewarded, deduct points
        if (task && task.completed) {
          import('../stores/rewardsStore').then(({ useRewardsStore }) => {
            const rewardsState = useRewardsStore.getState();
            if (rewardsState.isTaskRewarded(id)) {
              const pointsEarned = task.priority === 'urgent' ? 20 : task.priority === 'high' ? 15 : task.priority === 'medium' ? 10 : 5;
              import('../stores/useAppStore').then(({ useAppStore }) => {
                useAppStore.getState().decrementPoints(pointsEarned);
              });
              rewardsState.removeTaskRewarded(id);
            }
          });
        }

        set((state) => ({
          tasks: state.tasks.map(task =>
            task.id === id
              ? { ...task, completed: !task.completed, updatedAt: new Date() }
              : task
          )
        }));
      },

      reorderTasks: (startIndex, endIndex) => {
        set((state) => {
          const result = Array.from(state.tasks);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          
          // Update order property
          const updatedTasks = result.map((task, index) => ({
            ...task,
            order: index
          }));

          return { tasks: updatedTasks };
        });
      },

      addCategory: (name, color, icon) => {
        const newCategory: Category = {
          id: Date.now().toString(),
          name,
          color,
          icon,
          tasks: []
        };
        
        set((state) => ({
          categories: [...state.categories, newCategory]
        }));
      },

      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map(cat =>
            cat.id === id ? { ...cat, ...updates } : cat
          )
        }));
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter(cat => cat.id !== id)
        }));
      },

      setFilter: (filter) => set({ filter }),

      clearCompleted: () => {
        const completedTasks = get().tasks.filter(task => task.completed);

        // Deduct points for all completed+rewarded tasks being cleared
        if (completedTasks.length > 0) {
          import('../stores/rewardsStore').then(({ useRewardsStore }) => {
            import('../stores/useAppStore').then(({ useAppStore }) => {
              const rewardsState = useRewardsStore.getState();
              const appStore = useAppStore.getState();
              let totalPointsToDeduct = 0;

              for (const task of completedTasks) {
                if (rewardsState.isTaskRewarded(task.id)) {
                  const pointsEarned = task.priority === 'urgent' ? 20 : task.priority === 'high' ? 15 : task.priority === 'medium' ? 10 : 5;
                  totalPointsToDeduct += pointsEarned;
                  rewardsState.removeTaskRewarded(task.id);
                }
              }

              if (totalPointsToDeduct > 0) {
                appStore.decrementPoints(totalPointsToDeduct);
              }
            });
          });
        }

        set((state) => ({
          tasks: state.tasks.filter(task => !task.completed)
        }));
      },

      getFilteredTasks: () => {
        const { tasks, filter } = get();
        let filtered = [...tasks];

        if (filter.category) {
          filtered = filtered.filter(task => task.category.id === filter.category);
        }

        if (filter.priority) {
          filtered = filtered.filter(task => task.priority === filter.priority);
        }

        if (filter.completed !== undefined) {
          filtered = filtered.filter(task => task.completed === filter.completed);
        }

        if (filter.search) {
          const search = filter.search.toLowerCase();
          filtered = filtered.filter(task =>
            task.title.toLowerCase().includes(search) ||
            task.description?.toLowerCase().includes(search) ||
            task.tags.some(tag => tag.toLowerCase().includes(search))
          );
        }

        if (filter.dueDate) {
          const today = new Date();
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          const weekFromNow = new Date(today);
          weekFromNow.setDate(weekFromNow.getDate() + 7);

          switch (filter.dueDate) {
            case 'today':
              filtered = filtered.filter(task =>
                task.dueDate && 
                task.dueDate.toDateString() === today.toDateString()
              );
              break;
            case 'week':
              filtered = filtered.filter(task =>
                task.dueDate && 
                task.dueDate <= weekFromNow
              );
              break;
            case 'overdue':
              filtered = filtered.filter(task =>
                task.dueDate && 
                task.dueDate < today && 
                !task.completed
              );
              break;
          }
        }

        return filtered.sort((a, b) => a.order - b.order);
      },

      getTasksByCategory: (categoryId) => {
        const { tasks } = get();
        return tasks.filter(task => task.category.id === categoryId);
      },

       getTasksByStatus: (status) => {
        const { tasks } = get();
        switch (status) {
          case 'completed':
            return tasks.filter(t => !!t.completed);
          case 'pending':
            return tasks.filter(t => !t.completed);
          // add more statuses if your app uses them
          default:
            return tasks;
        }
      },

      getCompletionRate: () => {
        const { tasks } = get();
        if (tasks.length === 0) return 0;
        const completed = tasks.filter(task => task.completed).length;
        return Math.round((completed / tasks.length) * 100);
      },

      getTodayTasks: () => {
        const { tasks } = get();
        const today = new Date();
        return tasks.filter(task => {
          if (!task.dueDate) return false;
          // Ensure dueDate is a Date object
          const dueDate = task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate);
          return dueDate.toDateString() === today.toDateString();
        });
      },

      getOverdueTasks: () => {
        const { tasks } = get();
        const today = new Date();
        return tasks.filter(task => {
          if (!task.dueDate || task.completed) return false;
          // Ensure dueDate is a Date object
          const dueDate = task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate);
          return dueDate < today;
        });
      },

      getTasksByDate: (date: Date) => {
        const { tasks } = get();
        const targetDateStr = date.toISOString().split('T')[0];
        
        return tasks.filter(task => {
          if (!task.dueDate) return false;
          const taskDate = task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate);
          const taskDateStr = taskDate.toISOString().split('T')[0];
          return taskDateStr === targetDateStr;
        });
      },
    }),
    {
      name: 'task-storage',
      version: 1,
      storage: createJSONStorage(() => localStorage, {
        reviver: dateReviver,
      }),
    }
  )
);