import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { useSettings } from "../../settings/SettingsContext.jsx";
import { AppText } from "./app-text";

export function SearchFilter({
  value,
  onChangeText,
  placeholder,
  filters,
  filter,
  onFilter,
  hideSearch,
}) {
  const { colors, fontScale } = useSettings();
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
            clearButtonMode="while-editing"
            returnKeyType="search"
            accessibilityLabel={placeholder}
            style={[
              styles.input,
              { color: colors.text, fontSize: 16 * fontScale },
            ]}
          />
        </View>
      )}
      <View style={styles.chips} accessibilityRole="radiogroup">
        {filters.map((f) => {
          const on = filter === f.value;
          return (
            <Pressable
              key={f.value}
              onPress={() => onFilter(f.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              style={[
                styles.chip,
                { borderColor: colors.border },
                on && {
                  backgroundColor: colors.button,
                  borderColor: colors.button,
                },
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
    gap: 8,
    borderBottomWidth: 1,
  },
  inputWrap: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14 },
  input: { paddingVertical: 10 },
  chips: { flexDirection: "row", gap: 8 },
  chip: {
    borderWidth: 1,
    borderRadius: 18,
    minHeight: 36,
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  chipText: { fontSize: 14 },
});
