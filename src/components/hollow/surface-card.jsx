import { Pressable, StyleSheet, View } from "react-native";
import { useHaptics, useSettings } from "../../settings/SettingsContext.jsx";
import { layout, radius, space } from "../../ui/design-system";

// One surface treatment across Free, Premium and both games. Pressable only
// wraps cards that navigate; plain cards remain Views for nested controls.
export function SurfaceCard({
  children,
  onPress,
  label,
  accessibilityHint,
  style,
  compact = false,
  active = false,
  disabled = false,
}) {
  const { colors, settings } = useSettings();
  const haptic = useHaptics();
  const base = [
    styles.surface,
    compact ? styles.compact : null,
    {
      backgroundColor: colors.card,
      borderColor: active ? colors.accent : colors.border,
      borderWidth: settings.highContrast ? 2 : 1,
    },
    style,
  ];
  if (!onPress) return <View style={base}>{children}</View>;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={() => { haptic(); onPress(); }}
      style={({ pressed }) => [
        base,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  surface: {
    borderRadius: radius.card,
    borderWidth: 1,
    padding: layout.cardPadding,
    gap: space.sm,
  },
  compact: {
    padding: layout.compactCardPadding,
    gap: space.xs,
  },
  pressed: { opacity: 0.84 },
  disabled: { opacity: 0.52 },
});
