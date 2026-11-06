import { StyleSheet, View } from "react-native";
import { useSettings } from "../../settings/SettingsContext.jsx";
import { layout, radius, space, type } from "../../ui/design-system";
import { AppText } from "./app-text";

// Shared empty state for guide lists, filters and searches.
// No locks or upsells: empty results should always explain how to recover.
export function EmptyState({ title = "Nothing found", description = "Try a different search or filter.", style }) {
  const { colors } = useSettings();
  return (
    <View
      accessibilityRole="summary"
      style={[
        styles.container,
        { backgroundColor: colors.card, borderColor: colors.border },
        style,
      ]}
    >
      <AppText style={styles.title}>{title}</AppText>
      <AppText style={[styles.description, { color: colors.muted }]}>
        {description}
      </AppText>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    marginHorizontal: layout.gutter,
    marginTop: space.lg,
    padding: space.xl,
    gap: space.sm,
    alignItems: "center",
    borderWidth: 1,
    borderRadius: radius.card,
  },
  title: { ...type.subheading, textAlign: "center" },
  description: { ...type.small, textAlign: "center" },
});
