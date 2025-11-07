let permissionGranted = false;
let registration: ServiceWorkerRegistration | null = null;

export const pushNotifications = {
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('Push notifications not supported');
      return false;
    }

    if (Notification.permission === 'granted') {
      permissionGranted = true;
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      permissionGranted = permission === 'granted';
      return permissionGranted;
    }

    return false;
  },

  async initialize(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        registration = await navigator.serviceWorker.ready;
      } catch (error) {
        console.log('Service Worker not available');
      }
    }
  },

  async schedulePushNotification(
    title: string,
    body: string,
    scheduledTime: Date,
    soundEnabled: boolean = true
  ): Promise<void> {
    if (!permissionGranted) {
      const granted = await this.requestPermission();
      if (!granted) {
        console.log('Push notification permission not granted');
        return;
      }
    }

    const delay = scheduledTime.getTime() - Date.now();
    if (delay < 0) {
      return;
    }

    setTimeout(() => {
      this.showNotification(title, body, soundEnabled);
    }, delay);
  },

  showNotification(title: string, body: string, soundEnabled: boolean = true): void {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    try {
      if (registration) {
        registration.showNotification(title, {
          body,
          icon: '/icon-192.png',
          badge: '/icon-72.png',
          vibrate: [200, 100, 200],
          tag: 'care-task',
          requireInteraction: false,
          silent: !soundEnabled,
        });
      } else {
        new Notification(title, {
          body,
          icon: '/icon-192.png',
          silent: !soundEnabled,
        });
      }

      if (soundEnabled) {
        this.playNotificationSound();
      }
    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  },

  playNotificationSound(): void {
    try {
      const audio = new Audio('/sounds/beep.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {
      });
    } catch (error) {
    }
  },

  isSupported(): boolean {
    return 'Notification' in window;
  },

  getPermissionStatus(): NotificationPermission {
    if (!('Notification' in window)) {
      return 'denied';
    }
    return Notification.permission;
  },
};
