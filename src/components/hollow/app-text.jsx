import { StyleSheet, Text } from "react-native";

import { useSettings } from "../../settings/SettingsContext";
import { type } from "../../ui/design-system";

export function AppText({ style, variant, ...props }) {
  const { colors, fontScale } = useSettings();
  const flat = StyleSheet.flatten([variant ? type[variant] : null, style]) ?? {};
  const scaled = { color: colors.text, ...flat };
  const size = flat.fontSize ?? 16;
  scaled.fontSize = size * fontScale;
  if (flat.lineHeight != null) scaled.lineHeight = flat.lineHeight * fontScale;
  return <Text {...props} style={scaled} />;
}
