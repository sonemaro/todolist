// PWA utilities for service worker registration and app installation

export const registerServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('SW registered: ', registration);
    } catch (registrationError) {
      console.log('SW registration failed: ', registrationError);
    }
  }
};

export function registerSW() {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    navigator.serviceWorker.register('/sw.js').catch(console.error);
  }
}

export const checkForUpdates = async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      registration.update();
    }
  }
};

// PWA Install Prompt
let deferredPrompt: any;

export const setupInstallPrompt = (): void => {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Show install button or banner
    showInstallPromotion();
  });
};

export const showInstallPromotion = (): void => {
  // Show custom install UI
  const installBanner = document.createElement('div');
  installBanner.innerHTML = `
    <div class="fixed bottom-4 left-4 right-4 bg-white dark:bg-dark-card rounded-xl shadow-lg p-4 z-50 border border-gray-200 dark:border-dark-border">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="bg-pastel-mint rounded-lg p-2">
            <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 dark:text-white">Install App</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">Add to home screen for quick access</p>
          </div>
        </div>
        <div class="flex space-x-2">
          <button id="install-dismiss" class="px-3 py-1 text-sm text-gray-600 dark:text-gray-400">Later</button>
          <button id="install-app" class="px-4 py-2 bg-pastel-mint text-white rounded-lg text-sm font-medium">Install</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(installBanner);
  
  // Handle install button click
  document.getElementById('install-app')?.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      deferredPrompt = null;
    }
    installBanner.remove();
  });
  
  // Handle dismiss button click
  document.getElementById('install-dismiss')?.addEventListener('click', () => {
    installBanner.remove();
  });
};

// Check if app is installed
export const isAppInstalled = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true;
};

// Detect if device is mobile
export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Get device info
export const getDeviceInfo = () => {
  return {
    isMobile: isMobile(),
    isInstalled: isAppInstalled(),
    supportsServiceWorker: 'serviceWorker' in navigator,
    supportsNotifications: 'Notification' in window,
    supportsPush: 'PushManager' in window,
  };
};