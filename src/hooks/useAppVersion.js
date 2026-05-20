import { useState, useEffect, useCallback } from 'react';
import { App } from '@capacitor/app';

const VERSION_KEY = 'islamediaku_app_version';

export function useAppVersion() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  const checkVersion = useCallback(async () => {
    try {
      const res = await fetch(`/version.json?t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (!res.ok) return;
      const data = await res.json();
      const remote = data.version;
      const local = localStorage.getItem(VERSION_KEY);

      if (!local) {
        // First visit — store version, no prompt needed
        localStorage.setItem(VERSION_KEY, remote);
        return;
      }

      if (local !== remote) {
        setUpdateAvailable(true);
      }
    } catch {
      // Network error — ignore silently
    }
  }, []);

  const applyUpdate = useCallback(async () => {
    try {
      // Unregister all service workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(r => r.unregister()));
      }
      // Clear all caches
      if ('caches' in window) {
        const names = await caches.keys();
        await Promise.all(names.map(n => caches.delete(n)));
      }
      // Update stored version
      const res = await fetch(`/version.json?t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem(VERSION_KEY, data.version);
      }
    } catch {
      // Best effort cleanup
    }
    // Force reload from server
    window.location.reload();
  }, []);

  useEffect(() => {
    // Check on mount
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkVersion();

    // Check when tab becomes visible again
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        checkVersion();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Capacitor App State listener
    const appStateListener = App.addListener('appStateChange', ({ isActive }) => {
      if (isActive) {
        checkVersion();
      }
    });

    // Check periodically (every 5 minutes)
    const interval = setInterval(checkVersion, 5 * 60 * 1000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      clearInterval(interval);
      appStateListener.then(listener => listener.remove()).catch(() => {});
    };
  }, [checkVersion]);

  return { updateAvailable, applyUpdate };
}
