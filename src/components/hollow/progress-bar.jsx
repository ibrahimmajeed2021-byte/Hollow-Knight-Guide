import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useSettings } from "../../settings/SettingsContext.jsx";
import { clampPercent, motion } from "../../ui/design-system";

export function ProgressBar({ pct, label, height = 10 }) {
  const { colors, settings } = useSettings();
  const safePercent = clampPercent(pct);
  const width = useSharedValue(safePercent);

  useEffect(() => {
    width.value = settings.reduceMotion
      ? safePercent
      : withTiming(safePercent, { duration: motion.slow });
  }, [safePercent, settings.reduceMotion, width]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${width.value}%` }));

  return (
    <View
      style={[
        styles.track,
        { height, borderRadius: height / 2, backgroundColor: colors.border },
      ]}
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: safePercent }}
    >
      <Animated.View
        style={[
          styles.fill,
          { borderRadius: height / 2, backgroundColor: colors.button },
          fillStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { overflow: "hidden" },
  fill: { height: "100%" },
});
