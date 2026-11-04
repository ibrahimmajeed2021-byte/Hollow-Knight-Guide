import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";

import { usePurchases } from "../purchases/PurchasesContext";

import {
  defaultSettings,
  fontScales,
  highContrast,
  palettes,
} from "../constants/hollow";

const STORAGE_KEY = "hollow-knight-guide:settings";
// Converts the old single "theme" setting into the separate mode and style settings.
const LEGACY_THEMES = {
  default: { mode: "light", themeStyle: "default" },
  dark: { mode: "dark", themeStyle: "default" },
  system: { mode: "system", themeStyle: "default" },
  hollowknight: { mode: "dark", themeStyle: "hollowknight" },
  silksong: { mode: "dark", themeStyle: "silksong" },
};

function migrate(saved) {
  if (!saved || typeof saved !== "object") return {};
  const { theme, ...rest } = saved;
  return theme in LEGACY_THEMES && !rest.mode
    ? { ...LEGACY_THEMES[theme], ...rest }
    : rest;
}

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings);
  const [loaded, setLoaded] = useState(false);
  const systemScheme = useColorScheme();
  const { isPremium } = usePurchases();

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw)
          setSettings({ ...defaultSettings, ...migrate(JSON.parse(raw)) });
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const update = useCallback((patch) => {
    setSettings((prev) => {
      const next = { ...prev, ...migrate(patch) };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const reset = useCallback(() => update(defaultSettings), [update]);

  const value = useMemo(() => {
    // Use free choices whenever the entitlement is inactive, including expiry.
    // Keep saved premium selections so they return if the user subscribes again.
    const visibleSettings = isPremium
      ? settings
      : {
          ...settings,
          themeStyle: "default",
          selectorMusicTrack:
            (settings.selectorMusicTrack ?? 0) < 2
              ? settings.selectorMusicTrack ?? 0
              : 0,
        };
    const isDark =
      visibleSettings.mode === "dark" ||
      (visibleSettings.mode === "system" && systemScheme === "dark");
    const style = visibleSettings.themeStyle;
    const paletteKey =
      style === "default"
        ? isDark
          ? "dark"
          : "default"
        : isDark
        ? `${style}Dark`
        : style;
    const colors = visibleSettings.highContrast
      ? highContrast[isDark ? "dark" : "light"]
      : palettes[paletteKey];
    return {
      settings: visibleSettings,
      update,
      reset,
      isDark,
      colors,
      fontScale: fontScales[visibleSettings.fontSize] ?? 1,
    };
  }, [settings, isPremium, systemScheme, update, reset]);

  if (!loaded) return null;
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}

const impactStyles = {
  light: Haptics.ImpactFeedbackStyle.Light,
  medium: Haptics.ImpactFeedbackStyle.Medium,
  heavy: Haptics.ImpactFeedbackStyle.Heavy,
};

export function useLoadingVolume() {
  const { settings } = useSettings();
  return useMemo(() => {
    // Check if toggle switch is active (defaults to true)
    const enabled = settings?.loadingSoundEnabled ?? true;

    // Get numeric slider value 0-100 (defaults to 80)
    const volumeVal =
      typeof settings?.loadingSoundVolume === "number"
        ? settings.loadingSoundVolume
        : 80;

    // Returns a float from 0.0 to 1.0 for expo-av (or 0 if disabled)
    return enabled ? volumeVal / 100 : 0;
  }, [settings?.loadingSoundEnabled, settings?.loadingSoundVolume]);
}

export function useHaptics() {
  const { settings } = useSettings();
  const { hapticsEnabled, hapticsIntensity } = settings;
  return useCallback(() => {
    if (!hapticsEnabled) return;
    if (hapticsIntensity === "default") Haptics.selectionAsync();
    else Haptics.impactAsync(impactStyles[hapticsIntensity]);
  }, [hapticsEnabled, hapticsIntensity]);
}
