import { router, usePathname } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useGame } from "../../games/game-context";
import { useHaptics, useSettings } from "../../settings/SettingsContext";
import { AppText } from "./app-text";
import { layout, space, type } from "../../ui/design-system";

export function AppHeader() {
  const { top } = useSafeAreaInsets();
  const { colors } = useSettings();
  const triggerHaptic = useHaptics();
  const { config, clearGame } = useGame();
  const onSettings = usePathname() === "/settings";

  const pressSettings = () => {
    triggerHaptic();
    if (onSettings) router.back();
    else router.push("/settings");
  };

  return (
    <View style={[styles.container, { paddingTop: top + 6, backgroundColor: colors.header, borderBottomColor: colors.border }]}>
      <Pressable
        onPress={() => { triggerHaptic(); clearGame(); }}
        accessibilityRole="button"
        accessibilityLabel={`${config.guideTitle}. Tap to switch game`}
        hitSlop={8}
        style={({ pressed }) => [styles.sideAction, pressed && styles.pressedAction]}
      >
        <AppText style={[styles.actionIcon, { color: colors.headerText }]}>⇄</AppText>
      </Pressable>
      <View style={styles.titleWrap} pointerEvents="none">
        <AppText numberOfLines={1} style={[styles.title, { color: colors.headerText }]}>{config.guideTitle}</AppText>
        <AppText style={[styles.subtitle, { color: colors.headerText }]}>FIELD GUIDE</AppText>
      </View>
      <Pressable
        onPress={pressSettings}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={onSettings ? "Close settings" : "Settings"}
        style={styles.sideAction}
      >
        <AppText style={[styles.actionIcon, { color: colors.headerText }]}>{onSettings ? "×" : "⚙"}</AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 58,
    paddingHorizontal: space.sm,
    paddingBottom: space.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sideAction: {
    width: layout.touchTarget,
    height: layout.touchTarget,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  pressedAction: { opacity: 0.7 },
  actionIcon: { fontSize: 23, fontWeight: "500" },
  titleWrap: { flex: 1, alignItems: "center", paddingHorizontal: 8, gap: 1 },
  title: { ...type.subheading, letterSpacing: 0.2, textAlign: "center" },
  subtitle: { fontSize: 9, fontWeight: "700", letterSpacing: 2, opacity: 0.72 },
});
