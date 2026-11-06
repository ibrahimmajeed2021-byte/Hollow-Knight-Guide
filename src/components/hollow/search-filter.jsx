import { Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";

import { useSettings } from "../../settings/SettingsContext.jsx";
import { AppText } from "./app-text";
import { layout, radius, space, type } from "../../ui/design-system";

export function SearchFilter({
  value,
  onChangeText,
  placeholder,
  filters,
  filter,
  onFilter,
  hideSearch,
}) {
  const { colors, fontScale, settings } = useSettings();
  return (
    <View
      style={[
        styles.wrap,
        { backgroundColor: colors.background, borderColor: colors.border },
      ]}
    >
      {!hideSearch && (
        <View
          style={[
            styles.inputWrap,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={colors.muted}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
            accessibilityLabel={placeholder}
            style={[
              styles.input,
              { color: colors.text, fontSize: 16 * fontScale },
            ]}
          />
          {typeof value === "string" && value.length > 0 && onChangeText ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              accessibilityHint="Show the full list using the current filters"
              onPress={() => onChangeText("")}
              hitSlop={6}
              style={({ pressed }) => [styles.clearButton, pressed && styles.pressed]}
            >
              <AppText style={[styles.clearIcon, { color: colors.muted }]}>×</AppText>
            </Pressable>
          ) : null}
        </View>
      )}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        accessibilityRole="radiogroup"
        contentContainerStyle={styles.chips}
      >
        {filters.map((f) => {
          const on = filter === f.value;
          return (
            <Pressable
              key={f.value}
              onPress={() => onFilter(f.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              accessibilityLabel={f.label}
              style={({ pressed }) => [
                styles.chip,
                { borderColor: colors.border },
                on && {
                  backgroundColor: colors.button,
                  borderColor: colors.button,
                },
                pressed && styles.pressed,
                settings.highContrast && { borderWidth: 2 },
              ]}
            >
              <AppText
                style={[
                  styles.chipText,
                  on && { color: colors.buttonText, fontWeight: "bold" },
                ]}
              >
                {f.label}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: layout.gutter,
    paddingTop: space.sm,
    paddingBottom: space.sm,
    gap: space.sm,
    borderBottomWidth: 1,
  },
  inputWrap: { borderWidth: 1, borderRadius: radius.control, paddingLeft: 14, flexDirection: "row", alignItems: "center" },
  input: { flex: 1, minWidth: 0, minHeight: layout.touchTarget, paddingVertical: space.sm },
  clearButton: { width: layout.touchTarget, height: layout.touchTarget, alignItems: "center", justifyContent: "center" },
  clearIcon: { fontSize: 25, lineHeight: 31, fontWeight: "500" },
  chips: { flexDirection: "row", gap: space.sm, paddingRight: layout.gutter },
  chip: {
    borderWidth: 1,
    borderRadius: radius.pill,
    minHeight: layout.touchTarget,
    paddingVertical: space.sm,
    paddingHorizontal: space.md,
    justifyContent: "center",
  },
  pressed: { opacity: 0.78 },
  chipText: { ...type.label },
});
