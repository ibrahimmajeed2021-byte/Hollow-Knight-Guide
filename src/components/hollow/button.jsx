import { Pressable, StyleSheet } from "react-native";

import { useHaptics, useSettings } from "../../settings/SettingsContext";
import { layout, radius, space, type } from "../../ui/design-system";
import { AppText } from "./app-text";

export function Button({ label, onPress, variant = "solid", style, disabled, accessibilityHint }) {
  const { colors, settings } = useSettings();
  const triggerHaptic = useHaptics();
  const solid = variant === "solid";
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={() => {
        triggerHaptic();
        onPress?.();
      }}
      style={({ pressed }) => [
        styles.button,
        solid
          ? { backgroundColor: colors.button, borderColor: colors.button }
          : { backgroundColor: colors.card, borderColor: colors.border },
        settings.highContrast && { borderWidth: 2 },
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <AppText style={[styles.label, solid && { color: colors.buttonText }]}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderRadius: radius.control,
    minHeight: layout.touchTarget,
    paddingVertical: space.sm,
    paddingHorizontal: space.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  label: { ...type.label, textAlign: "center" },
  pressed: { opacity: 0.82 },
  disabled: { opacity: 0.5 },
});
