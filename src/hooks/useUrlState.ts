import { useState, useEffect, useCallback } from 'react';
import LZString from 'lz-string';
import type { AppSettings, ThemeType } from '../types';

const DEFAULT_SETTINGS: AppSettings = {
  text: 'https://github.com/YuJunWang/Magic_QRcode',
  theme: 'sakura',
  elevation: 1.0,
  blockDensity: 0.95,
  autoRotate: true,
  particlesEnabled: true,
  cameraMode: 'orbit',
};

export function useUrlState() {
  const [settings, setSettings] = useState<AppSettings>(() => {
    // 1. Check URL hash first
    const hash = window.location.hash.slice(1);
    if (hash) {
      try {
        const decompressed = LZString.decompressFromEncodedURIComponent(hash);
        if (decompressed) {
          const parsed = JSON.parse(decompressed);
          return { ...DEFAULT_SETTINGS, ...parsed, cameraMode: 'orbit' };
        }
      } catch (err) {
        console.warn('Failed to parse URL hash state:', err);
      }
    }

    // 2. Fallback to query params
    const params = new URLSearchParams(window.location.search);
    const textParam = params.get('text') || params.get('url');
    const themeParam = params.get('theme') as ThemeType;

    if (textParam || themeParam) {
      return {
        ...DEFAULT_SETTINGS,
        text: textParam || DEFAULT_SETTINGS.text,
        theme: themeParam || DEFAULT_SETTINGS.theme,
      };
    }

    return DEFAULT_SETTINGS;
  });

  // Sync state to URL hash (debounced)
  useEffect(() => {
    const handler = setTimeout(() => {
      try {
        const stateToSave = {
          text: settings.text,
          theme: settings.theme,
          elevation: settings.elevation,
          blockDensity: settings.blockDensity,
        };
        const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(stateToSave));
        window.history.replaceState(null, '', `#${compressed}`);
      } catch (err) {
        console.error('Error writing hash:', err);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [settings.text, settings.theme, settings.elevation, settings.blockDensity]);

  const updateSetting = useCallback(<K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const getShareableUrl = useCallback(() => {
    return window.location.href;
  }, []);

  return {
    settings,
    setSettings,
    updateSetting,
    getShareableUrl,
  };
}
