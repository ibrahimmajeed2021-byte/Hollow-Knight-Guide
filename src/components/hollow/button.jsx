import { Pressable, StyleSheet } from 'react-native';

import { useHaptics, useSettings } from '../../settings/settings-context';
import { AppText } from './app-text';

export function Button({ label, onPress, variant = 'solid', style, disabled }) {
  const { colors } = useSettings();
  const triggerHaptic = useHaptics();
  const solid = variant === 'solid';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={() => {
        triggerHaptic();
        onPress?.();
      }}
      style={[
        styles.button,
        solid
          ? { backgroundColor: colors.button, borderColor: colors.button }
          : { borderColor: colors.border },
        disabled && styles.disabled,
        style,
      ]}
    >
      <AppText style={[styles.label, solid && { color: colors.buttonText }]}>{label}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 15, fontWeight: 'bold' },
  disabled: { opacity: 0.5 },
});
