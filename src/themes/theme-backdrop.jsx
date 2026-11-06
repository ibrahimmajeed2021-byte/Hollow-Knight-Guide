import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

import { useGame } from "../games/game-context";
import { useOnlineAccess } from "../network/online-access-context";
import { useSettings } from "../settings/SettingsContext.jsx";
import { resolveTheme } from "./theme-catalog";

// Subtle themed wallpaper behind the entire guide. The foreground remains
// readable in both light and dark mode, and high contrast disables decoration.
// The online art URLs are controlled by api/media.json; bundled copies make
// Premium themes available when completely offline.
export function ThemeBackdrop() {
  const { colors, settings, isDark } = useSettings();
  const { mediaManifest } = useGame();
  const { status } = useOnlineAccess();
  const theme = resolveTheme(settings.themeStyle);

  if (theme.id === "default" || settings.highContrast) return null;

  const remote = status === "online" ? mediaManifest?.themes?.[theme.id] : null;
  const background = remote?.backgroundImageUrl
    ? { uri: remote.backgroundImageUrl }
    : theme.backgroundAsset;
  const motif = remote?.motifImageUrl
    ? { uri: remote.motifImageUrl }
    : theme.motifAsset;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View
        style={[styles.glow, {
          backgroundColor: theme.accent,
          opacity: isDark ? 0.12 : 0.075,
        }]}
      />
      {background ? (
        <Image
          source={background}
          style={[StyleSheet.absoluteFill, { opacity: isDark ? 0.19 : 0.13 }]}
          contentFit="cover"
          cachePolicy="memory-disk"
          accessible={false}
        />
      ) : null}
      <View
        style={[styles.ray, {
          borderColor: theme.accent,
          opacity: isDark ? 0.12 : 0.085,
        }]}
      />
      <View
        style={[styles.rayOther, {
          borderColor: theme.accent,
          opacity: isDark ? 0.08 : 0.055,
        }]}
      />
      {motif ? (
        <Image
          source={motif}
          style={[styles.motif, { opacity: isDark ? 0.14 : 0.1 }]}
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
