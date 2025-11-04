import { Task } from '../types';

interface ScheduledReminder {
  taskId: string;
  timeoutId: number;
}

class ReminderService {
  private scheduledReminders: Map<string, ScheduledReminder> = new Map();
  private audio: HTMLAudioElement | null = null;
  private soundEnabled: boolean = true;
  private toastCallback: ((title: string, message: string) => void) | null = null;

  constructor() {
    this.loadSoundPreference();
    this.initAudio();
  }

  setToastCallback(callback: (title: string, message: string) => void) {
    this.toastCallback = callback;
  }

  private loadSoundPreference() {
    const saved = localStorage.getItem('soundAlertsEnabled');
    this.soundEnabled = saved !== null ? saved === 'true' : true;
  }

  setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    localStorage.setItem('soundAlertsEnabled', enabled.toString());
  }

  getSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  private initAudio() {
    if (typeof window !== 'undefined') {
      this.audio = new Audio('/sounds/beep.mp3');
      this.audio.volume = 0.5;
    }
  }

  private playSound() {
    if (this.soundEnabled && this.audio) {
      this.audio.currentTime = 0;
      this.audio.play().catch(err => {
        console.warn('Failed to play notification sound:', err);
      });
    }
  }

  private async showNotification(task: Task) {
    const dueTime = task.dueDate ? new Date(task.dueDate).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }) : 'soon';

    const message = `${task.title} is due at ${dueTime}`;

    if (!('Notification' in window)) {
      console.warn('Browser does not support notifications');
      if (this.toastCallback) {
        this.toastCallback('🔔 Task Reminder', message);
      }
      return;
    }

    if (Notification.permission === 'granted') {
      try {
        new Notification('🔔 Task Reminder', {
          body: message,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: task.id,
          requireInteraction: false,
        });

        this.playSound();
      } catch (err) {
        console.error('Failed to show notification:', err);
        if (this.toastCallback) {
          this.toastCallback('🔔 Task Reminder', message);
        }
      }
    } else if (Notification.permission === 'denied') {
      console.warn('Notification permission denied, showing in-app toast');
      if (this.toastCallback) {
        this.toastCallback('🔔 Task Reminder', message);
      }
      this.playSound();
    }
  }

  scheduleReminder(task: Task) {
    if (!task.dueDate || task.completed) {
      return;
    }

    this.cancelReminder(task.id);

    const dueDate = new Date(task.dueDate);
    const reminderTime = new Date(dueDate.getTime() - 5 * 60 * 1000);
    const now = new Date();
    const delay = reminderTime.getTime() - now.getTime();

    if (delay > 0 && delay < 2147483647) {
      const timeoutId = window.setTimeout(() => {
        this.showNotification(task);
        this.scheduledReminders.delete(task.id);
      }, delay);

      this.scheduledReminders.set(task.id, {
        taskId: task.id,
        timeoutId
      });
    }
  }

  cancelReminder(taskId: string) {
    const scheduled = this.scheduledReminders.get(taskId);
    if (scheduled) {
      clearTimeout(scheduled.timeoutId);
      this.scheduledReminders.delete(taskId);
    }
  }

  rescheduleReminder(task: Task) {
    this.cancelReminder(task.id);
    this.scheduleReminder(task);
  }

  scheduleAllReminders(tasks: Task[]) {
    this.clearAllReminders();
    tasks.forEach(task => {
      if (task.dueDate && !task.completed) {
        this.scheduleReminder(task);
      }
    });
  }

  clearAllReminders() {
    this.scheduledReminders.forEach(reminder => {
      clearTimeout(reminder.timeoutId);
    });
    this.scheduledReminders.clear();
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('Browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (err) {
      console.error('Error requesting notification permission:', err);
      return false;
    }
  }
}

export const reminderService = new ReminderService();
