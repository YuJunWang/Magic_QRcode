import { useState, useEffect, useCallback } from 'react';
import LZString from 'lz-string';
import type { AppSettings, ThemeType } from '../types';

const DEFAULT_SETTINGS: AppSettings = {
  text: 'https://github.com/YuJunWang/Magic_QRcode',
  theme: 'sakura',
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
          // cameraMode is always reset to 'orbit' on load (don't persist scan mode)
          return { ...DEFAULT_SETTINGS, ...parsed, cameraMode: 'orbit' };
        }
      } catch (err) {
        console.warn('Failed to parse URL hash state:', err);
      }
    }

    // 2. Fallback to legacy query params (backward-compat)
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

  // Sync state to URL hash (debounced 300 ms)
  // Persisted: text, theme, autoRotate, particlesEnabled
  // NOT persisted: cameraMode (always starts in orbit)
  useEffect(() => {
    const handler = setTimeout(() => {
      try {
        const stateToSave = {
          text:             settings.text,
          theme:            settings.theme,
          autoRotate:       settings.autoRotate,
          particlesEnabled: settings.particlesEnabled,
        };
        const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(stateToSave));
        window.history.replaceState(null, '', `#${compressed}`);
      } catch (err) {
        console.error('Error writing hash:', err);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [settings.text, settings.theme, settings.autoRotate, settings.particlesEnabled]);

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
