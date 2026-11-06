import { ApiArtworkImage } from "../components/hollow/api-artwork-image";
import { Animated, AppState, Easing, StyleSheet, View } from "react-native";
import { useEffect, useRef, useState } from "react";

import { useGame } from "../games/game-context";
import { useOnlineAccess } from "../network/online-access-context";
import { useSettings } from "../settings/SettingsContext.jsx";
import { resolveTheme } from "./theme-catalog";

// Subtle themed wallpaper behind the entire guide. The foreground remains
// readable in both light and dark mode, and high contrast disables decoration.
// The online art URLs are controlled by api/media.json; bundled copies make
// Premium themes available when completely offline.
export function ThemeBackdrop({ active = true }) {
  const { colors, settings, isDark } = useSettings();
  const { mediaManifest } = useGame();
  const { status } = useOnlineAccess();
  const theme = resolveTheme(settings.themeStyle);
  const pulse = useRef(new Animated.Value(1)).current;
  const [appActive, setAppActive] = useState(() =>
    AppState.currentState !== "background" && AppState.currentState !== "inactive"
  );

  useEffect(() => {
    const listener = AppState.addEventListener("change", (state) => {
      setAppActive(state === "active");
    });
    return () => listener.remove();
  }, []);
  const intensity = Math.max(0, Math.min(100, Number(settings.wallpaperStrength ?? 50))) / 50;

  useEffect(() => {
    if (!active || !appActive || theme.id === "default" || settings.ambientMotion !== true || settings.reduceMotion || settings.highContrast) {
      pulse.stopAnimation();
      pulse.setValue(1);
      return;
    }
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.12, duration: 4400, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 4400, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [pulse, active, appActive, theme.id, settings.ambientMotion, settings.reduceMotion, settings.highContrast]);

  if (theme.id === "default" || settings.highContrast) return null;

  const remote = status === "online" ? mediaManifest?.themes?.[theme.id] : null;
  const hasBackground = theme.backgroundAsset || remote?.backgroundImageUrl;
  const hasMotif = theme.motifAsset || remote?.motifImageUrl;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Animated.View
        style={[styles.glow, {
          backgroundColor: theme.accent,
          opacity: (isDark ? 0.12 : 0.075) * intensity,
          transform: [{ scale: pulse }],
        }]}
      />
      {hasBackground && intensity > 0 ? (
        <ApiArtworkImage
          iconUrl={remote?.backgroundImageUrl}
          fallbackImage={theme.backgroundAsset}
          style={[StyleSheet.absoluteFill, { opacity: (isDark ? 0.19 : 0.13) * intensity }]}
          contentFit="cover"
          cachePolicy="memory-disk"
          accessible={false}
        />
      ) : null}
      <View
        style={[styles.ray, {
          borderColor: theme.accent,
          opacity: (isDark ? 0.12 : 0.085) * intensity,
        }]}
      />
      <View
        style={[styles.rayOther, {
          borderColor: theme.accent,
          opacity: (isDark ? 0.08 : 0.055) * intensity,
        }]}
      />
      {hasMotif && intensity > 0 ? (
        <ApiArtworkImage
          iconUrl={remote?.motifImageUrl}
          fallbackImage={theme.motifAsset}
          style={[styles.motif, { opacity: (isDark ? 0.14 : 0.1) * intensity }]}
          contentFit="contain"
          cachePolicy="memory-disk"
          accessible={false}
        />
      ) : null}
      <View
        style={[styles.bottomFade, {
          backgroundColor: colors.background,
          opacity: isDark ? 0.14 : 0.2,
        }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  glow: {
    position: "absolute",
    top: -190,
    right: -150,
    width: 430,
    height: 430,
    borderRadius: 250,
  },
  ray: {
    position: "absolute",
    top: -170,
    right: 28,
    height: 650,
    width: 205,
    borderLeftWidth: 2,
    borderRightWidth: 1,
    transform: [{ rotate: "-15deg" }],
  },
  rayOther: {
    position: "absolute",
    bottom: -100,
    left: -120,
    height: 610,
    width: 190,
    borderLeftWidth: 1,
    borderRightWidth: 2,
    transform: [{ rotate: "18deg" }],
  },
  motif: {
    position: "absolute",
    right: -55,
    bottom: "12%",
    width: 330,
    height: 370,
  },
  bottomFade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
  },
});
