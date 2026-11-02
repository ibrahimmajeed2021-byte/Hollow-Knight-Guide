import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

import { defaultSettings, fontScales, highContrast, palettes } from '../constants/hollow';

const STORAGE_KEY = 'hollow-knight-guide:settings';
const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings);
  const [loaded, setLoaded] = useState(false);
  const systemScheme = useColorScheme();

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setSettings({ ...defaultSettings, ...JSON.parse(raw) });
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const update = useCallback((patch) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const reset = useCallback(() => update(defaultSettings), [update]);

  const value = useMemo(() => {
    const isDark =
      settings.theme === 'dark' || (settings.theme === 'system' && systemScheme === 'dark');
    const colors = settings.highContrast
      ? highContrast[isDark ? 'dark' : 'light']
      : palettes[isDark ? 'dark' : 'default'];
    return {
      settings,
      update,
      reset,
      isDark,
      colors,
      fontScale: fontScales[settings.fontSize] ?? 1,
    };
  }, [settings, systemScheme, update, reset]);

  if (!loaded) return null;
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  return useContext(SettingsContext);
}

const impactStyles = {
  light: Haptics.ImpactFeedbackStyle.Light,
  medium: Haptics.ImpactFeedbackStyle.Medium,
  heavy: Haptics.ImpactFeedbackStyle.Heavy,
};

export function useHaptics() {
  const { settings } = useSettings();
  const { hapticsEnabled, hapticsIntensity } = settings;
  return useCallback(() => {
    if (!hapticsEnabled) return;
    if (hapticsIntensity === 'default') Haptics.selectionAsync();
    else Haptics.impactAsync(impactStyles[hapticsIntensity]);
  }, [hapticsEnabled, hapticsIntensity]);
}
