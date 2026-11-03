import { StyleSheet, Text } from "react-native";

import { useSettings } from "../../settings/SettingsContext";

export function AppText({ style, ...props }) {
  const { colors, fontScale } = useSettings();
  const flat = StyleSheet.flatten(style) ?? {};
  const scaled = { color: colors.text, ...flat };
  const size = flat.fontSize ?? 16;
  scaled.fontSize = size * fontScale;
  if (flat.lineHeight) scaled.lineHeight = flat.lineHeight * fontScale;
  return <Text {...props} style={scaled} />;
}
