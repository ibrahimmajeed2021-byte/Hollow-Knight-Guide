import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HKFont } from "../../constants/hollow";
import { gameList } from "../../games/config";
import { useGame } from "../../games/game-context";
import { useHaptics, useSettings } from "../../settings/SettingsContext.jsx";
import { ThemeBackdrop } from "../../themes/theme-backdrop";

export function GameSelect() {
  const { gameId, loaded, selectGame } = useGame();
  const triggerHaptic = useHaptics();
  const { colors, settings } = useSettings();
  const customTheme = settings.themeStyle !== "default";
  const { top, bottom } = useSafeAreaInsets();

  if (!loaded || gameId) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      style={[
        styles.overlay,
        { paddingTop: top + 24, paddingBottom: bottom + 24, backgroundColor: customTheme ? colors.background : "#000" },
      ]}
    >
      <ThemeBackdrop />
      <Text style={[styles.heading, customTheme && { color: colors.text }]}>CHOOSE YOUR GAME</Text>
      <View style={styles.list}>
        {gameList.map((game) => (
          <Pressable
            key={game.id}
            accessibilityRole="button"
            accessibilityLabel={game.title}
            onPress={() => {
              triggerHaptic();
              // Navigate while the existing Stack is still mounted.
              // Selecting a game rekeys its journal and guide navigator.
              router.replace("/");
              selectGame(game.id);
            }}
            style={[styles.card, customTheme && { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Text style={[styles.title, customTheme && { color: colors.text }]}>{game.title.toUpperCase()}</Text>
            <Text style={[styles.tagline, customTheme && { color: colors.muted }]}>{game.tagline}</Text>
          </Pressable>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    gap: 32,
    paddingHorizontal: 24,
    zIndex: 900,
    elevation: 900,
  },
  heading: {
    color: "#fff",
    fontFamily: HKFont,
    fontSize: 22,
    letterSpacing: 4,
    textAlign: "center",
  },
  list: { width: "100%", gap: 16 },
  card: {
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 14,
    paddingVertical: 28,
    paddingHorizontal: 16,
    backgroundColor: "#111",
    alignItems: "center",
    gap: 6,
  },
  title: {
    color: "#fff",
    fontFamily: HKFont,
    fontSize: 20,
    letterSpacing: 3,
    textAlign: "center",
  },
  tagline: { color: "#aaa", fontSize: 14 },
});
